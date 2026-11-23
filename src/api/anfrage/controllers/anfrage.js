'use strict';

/**
 * anfrage controller
 *
 * Öffentlich ist nur "create" freigegeben (siehe src/index.js). Der Controller
 * nimmt ausschließlich bekannte Felder an, prüft Pflichtfelder und filtert Spam:
 *  - Honeypot-Feld "website" + Mindest-Ausfülldauer → still verworfen
 *  - max. RATE_MAX Anfragen je IP in RATE_WINDOW_MS → 429
 *  - Nachrichten mit vielen Links → gespeichert, aber nicht weitergeleitet
 * Gespeicherte Daten werden nie zurückgegeben.
 *
 * Hinter einem Reverse-Proxy (nginx, Plesk, …) IS_PROXIED=true setzen, sonst sehen
 * alle Anfragen wie dieselbe IP aus (siehe config/server.js).
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { weiterleiten } = require('../integrationen');

const TEXT_FIELDS = {
  anliegen: 100,
  modell: 150,
  firma: 150,
  anrede: 20,
  vorname: 100,
  nachname: 100,
  email: 200,
  telefon: 50,
  strasse: 150,
  plz: 20,
  ort: 100,
  nachricht: 5000,
};
const BOOL_FIELDS = ['rueckruf', 'newsletter', 'datenschutz'];
const REQUIRED = ['vorname', 'nachname', 'email', 'nachricht'];
const MIN_FILL_MS = 3000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_MAX = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_LINKS = 2;
const LINK_RE = /https?:\/\/|www\./gi;

// Einfacher In-Memory-Zähler – reicht für eine einzelne Strapi-Instanz
const versuche = new Map();

function zuVieleVersuche(ip) {
  const jetzt = Date.now();
  if (versuche.size > 5000) {
    for (const [key, zeiten] of versuche) {
      if (zeiten[zeiten.length - 1] < jetzt - RATE_WINDOW_MS) versuche.delete(key);
    }
  }
  const zeiten = (versuche.get(ip) ?? []).filter((t) => t > jetzt - RATE_WINDOW_MS);
  zeiten.push(jetzt);
  versuche.set(ip, zeiten);
  return zeiten.length > RATE_MAX;
}

function spamVerdacht(data) {
  const text = Object.values(data).filter((v) => typeof v === 'string').join(' ');
  return (text.match(LINK_RE) ?? []).length > MAX_LINKS;
}

module.exports = createCoreController('api::anfrage.anfrage', ({ strapi }) => ({
  async create(ctx) {
    const body = ctx.request.body?.data ?? {};

    // Bots füllen das versteckte Feld aus oder senden sofort ab → still "Erfolg" melden
    const tooFast = Number(body.ausfuelldauer) < MIN_FILL_MS;
    if (body.website || tooFast) {
      return ctx.send({ ok: true });
    }

    if (zuVieleVersuche(ctx.request.ip)) {
      ctx.status = 429;
      ctx.body = {
        error: {
          status: 429,
          message:
            'Sie haben in kurzer Zeit sehr viele Anfragen gesendet. Bitte versuchen Sie es später erneut.',
        },
      };
      return;
    }

    const data = {};
    for (const [key, max] of Object.entries(TEXT_FIELDS)) {
      if (typeof body[key] === 'string' && body[key].trim()) {
        data[key] = body[key].trim().slice(0, max);
      }
    }
    for (const key of BOOL_FIELDS) data[key] = body[key] === true;

    const missing = REQUIRED.filter((key) => !data[key]);
    if (missing.length) return ctx.badRequest(`Pflichtfelder fehlen: ${missing.join(', ')}`);
    if (!EMAIL_RE.test(data.email)) return ctx.badRequest('Bitte eine gültige E-Mail-Adresse angeben.');
    if (!data.datenschutz) return ctx.badRequest('Bitte der Datenschutzerklärung zustimmen.');

    // Verdächtige Anfragen landen nur im Admin – keine Leads, Newsletter-Mails oder Benachrichtigungen
    if (spamVerdacht(data)) {
      await strapi.documents('api::anfrage.anfrage').create({
        data: { ...data, weiterleitung: 'Spam-Verdacht (viele Links) – nicht weitergeleitet' },
      });
      return ctx.send({ ok: true });
    }

    const anfrage = await strapi.documents('api::anfrage.anfrage').create({ data });
    const weiterleitung = await weiterleiten(strapi, data);
    if (weiterleitung) {
      await strapi
        .documents('api::anfrage.anfrage')
        .update({ documentId: anfrage.documentId, data: { weiterleitung } });
    }

    return ctx.send({ ok: true });
  },
}));
