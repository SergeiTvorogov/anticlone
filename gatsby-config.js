const config = require('./config.json');

module.exports = {
  siteMetadata: {
    siteUrl: config.siteMetadata.siteUrl,
    languages: {
      langs: ['en', 'ru'],
      defaultLangKey: 'ru',
    },
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-antd',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'АнтиКлон',
        short_name: 'АнтиКлон',
        start_url: '/',
        background_color: '#001428',
        theme_color: '#001428',
        display: 'minimal-ui',
        icon: 'src/images/icon.png',
      },
    },
    {
      resolve: 'gatsby-plugin-webfonts',
      options: {
        fonts: {
          google: [
            {
              family: 'Roboto Slab',
              variants: ['400'],
              subsets: ['cyrillic'],
            },
          ],
        },
      },
    },
    {
      resolve: '@sentry/gatsby',
      options: {
        dsn:
          'https://54b76e5a5b68492cafbac42af85d0ff6@o368638.ingest.sentry.io/5691033',
        sampleRate: 0.7,
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-robots-txt',
    'gatsby-plugin-advanced-sitemap',
    {
      resolve: 'gatsby-plugin-intl',
      options: {
        path: `${__dirname}/src/intl`,
        languages: ['en', 'ru'],
        defaultLanguage: 'en',
        redirect: true,
      },
    },
  ],
};
