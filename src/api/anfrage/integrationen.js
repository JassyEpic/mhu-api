'use strict';

/**
 * Weiterleitung von Kontaktanfragen an externe Dienste. Jede Integration ist nur aktiv,
 * wenn ihre Umgebungsvariablen in .env gesetzt sind. Fehler werden protokolliert und
 * im Feld "weiterleitung" der Anfrage vermerkt – die Anfrage selbst geht nie verloren.
 *
 * weclapp (Lead anlegen, wie das Formular der alten Website):
 *   WECLAPP_WEB2LEAD_URL    z. B. https://mobilheimunion.weclapp.com/webapp/seam/resource/rest/web2lead
 *   WECLAPP_WEB2LEAD_TOKEN  Token aus dem weclapp-Web-to-Lead-Formular
 *
 * Brevo (Newsletter mit Double-Opt-in, nur wenn der Haken "newsletter" gesetzt ist):
 *   BREVO_API_KEY           API-Schlüssel (Brevo → SMTP & API → API Keys)
 *   BREVO_LISTE_ID          ID der Kontaktliste, z. B. 3
 *   BREVO_DOI_TEMPLATE_ID   ID der Double-Opt-in-Vorlage (Vorlage mit Tag "optin")
 *   BREVO_DOI_REDIRECT      Seite nach der Bestätigung, z. B. https://mobilheim-union.de/newsletter-bestaetigt
 *
 * E-Mail-Benachrichtigung ans Team (über die Brevo-Transaktions-API, gleicher API-Schlüssel):
 *   KONTAKT_EMAIL_AN        Empfänger, mehrere mit Komma getrennt, z. B. info@mobilheim-union.de
 *   KONTAKT_EMAIL_VON       Absender – muss in Brevo als Absender bestätigt sein
 *                           (Brevo → Senders, Domains & Dedicated IPs), z. B. website@mobilheim-union.de
 */

const TIMEOUT_MS = 8000;

// weclapp kennt nur Herr/Frau
const ANREDE = { Herr: 'MR', Frau: 'MRS' };

async function weclapp(data) {
  const url = process.env.WECLAPP_WEB2LEAD_URL;
  const token = process.env.WECLAPP_WEB2LEAD_TOKEN;
  if (!url || !token) return null;

  // weclapp verlangt das Rechen-Captcha des Formulars: Wert = Salz + Ziffer, Ergebnis = Summe.
  // Der Spam-Schutz passiert bereits im Controller, daher lösen wir es hier selbst.
  const salt = String(Date.now()).slice(0, 12);
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);

  // Anliegen und Modell haben in weclapp kein eigenes Feld → vor die Nachricht schreiben
  const kopf = [
    data.anliegen && `Anliegen: ${data.anliegen}`,
    data.modell && `Modell: ${data.modell}`,
    data.konfiguration && `Konfiguration: ${data.konfiguration}`,
  ].filter(Boolean);
  const description = [...kopf, kopf.length ? '' : null, data.nachricht]
    .filter((z) => z !== null)
    .join('\n');

  const form = new URLSearchParams({
    company_name: data.firma ?? '',
    firstname: data.vorname,
    lastName: data.nachname,
    street: data.strasse ?? '',
    zipcode: data.plz ?? '',
    city: data.ort ?? '',
    phone: data.telefon ?? '',
    email: data.email,
    description,
    captchaValue1: salt + a,
    captchaValue2: salt + b,
    captchaResult: String(a + b),
    honeypot: '',
    token,
  });
  if (ANREDE[data.anrede]) form.set('salutation', ANREDE[data.anrede]);
  if (data.rueckruf) form.set('opt_in_phone', 'true');
  if (data.newsletter) form.set('opt_in', 'true');

  const res = await fetch(`${url}?charset=UTF-8`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: form,
    redirect: 'manual', // weclapp antwortet mit Weiterleitung auf eine Dankeseite
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (res.status >= 400) throw new Error(`HTTP ${res.status}`);
  return 'Lead angelegt';
}

async function brevo(data) {
  const apiKey = process.env.BREVO_API_KEY;
  const liste = Number(process.env.BREVO_LISTE_ID);
  const vorlage = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  if (!data.newsletter || !apiKey || !liste || !vorlage) return null;

  const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email: data.email,
      attributes: { VORNAME: data.vorname, NACHNAME: data.nachname },
      includeListIds: [liste],
      templateId: vorlage,
      redirectionUrl:
        process.env.BREVO_DOI_REDIRECT || 'https://mobilheim-union.de/newsletter-bestaetigt',
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  return 'Bestätigungs-Mail gesendet';
}

const BESCHRIFTUNG = {
  anliegen: 'Anliegen',
  modell: 'Modell',
  konfiguration: 'Konfiguration',
  firma: 'Firma / Campingplatz',
  anrede: 'Anrede',
  vorname: 'Vorname',
  nachname: 'Nachname',
  email: 'E-Mail',
  telefon: 'Telefon',
  strasse: 'Straße',
  plz: 'PLZ',
  ort: 'Ort',
  rueckruf: 'Rückruf gewünscht',
  newsletter: 'Newsletter gewünscht',
};

async function email(data) {
  const apiKey = process.env.BREVO_API_KEY;
  const an = (process.env.KONTAKT_EMAIL_AN || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  const von = process.env.KONTAKT_EMAIL_VON;
  if (!apiKey || !an.length || !von) return null;

  const zeilen = Object.entries(BESCHRIFTUNG)
    .filter(([key]) => data[key])
    .map(([key, label]) => `${label}: ${data[key] === true ? 'ja' : data[key]}`);
  const text = [...zeilen, '', 'Nachricht:', data.nachricht].join('\n');

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: von, name: 'Website Mobilheim Union' },
      to: an.map((e) => ({ email: e })),
      replyTo: { email: data.email, name: `${data.vorname} ${data.nachname}` },
      subject: `Neue Anfrage: ${data.anliegen || 'Kontaktformular'} – ${data.vorname} ${data.nachname}`,
      textContent: text,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  return 'Benachrichtigung gesendet';
}

// Führt alle aktiven Integrationen parallel aus und liefert eine Statuszeile für das Admin
async function weiterleiten(strapi, data) {
  const dienste = { weclapp, brevo, email };
  const ergebnisse = await Promise.allSettled(Object.values(dienste).map((fn) => fn(data)));
  const zeilen = [];
  Object.keys(dienste).forEach((name, i) => {
    const r = ergebnisse[i];
    if (r.status === 'fulfilled' && r.value) zeilen.push(`${name}: ${r.value}`);
    if (r.status === 'rejected') {
      strapi.log.warn(`Anfrage gespeichert, Weiterleitung an ${name} fehlgeschlagen: ${r.reason?.message}`);
      zeilen.push(`${name}: FEHLER – ${r.reason?.message}`);
    }
  });
  return zeilen.join('\n');
}

module.exports = { weiterleiten };
