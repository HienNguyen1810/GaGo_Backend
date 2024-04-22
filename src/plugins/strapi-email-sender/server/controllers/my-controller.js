'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-email-sender')
      .service('myService')
      .getWelcomeMessage();
  },
});
