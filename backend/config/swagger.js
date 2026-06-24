const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'FitTrack API',
      version:     '2.0.0',
      description: 'API REST de l\'application de suivi de fitness FitTrack.',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
