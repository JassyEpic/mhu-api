'use strict';

/**
 * konfigurator service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::konfigurator.konfigurator');
