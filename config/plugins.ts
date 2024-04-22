module.exports = ({ env }) => ({
  upload: {
    enabled: true,
    resolve: "./src/plugins/@strapi/plugin-upload",
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  'import-export-entries': {
    enabled: true,
  },
  "fuzzy-search": {
    enabled: false,
    config: {
      contentTypes: [
        {}
      ]
    }
  },
  graphql: {
    enabled: false,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
  migrations: {
    enabled: true,
    config: {
      autoStart: true,
      migrationFolderPath: 'migrations'
    },
  },
  publisher: {
    enabled: true,
  },
  seo: {
    enabled: true,
  },
  'wysiwyg': {
    enabled: true,
    resolve: './src/plugins/wysiwyg'
  },
  "postgis": {
    enabled: true,
    resolve: "./src/plugins/strapi-plugin-postgis",
    config: {
      googleApiKey: ""
    }
  },
  email: {
    enable: false,
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: 'hello@gago.studio',
        defaultReplyTo: 'hello@gago.studio',
      },
    },
  }
});
