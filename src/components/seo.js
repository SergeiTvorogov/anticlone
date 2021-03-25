import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { useIntl } from 'gatsby-plugin-intl';

import config from '../../config.json';

function SEO({ description, lang, meta, title, image }) {
  const intl = useIntl();

  const metaTitle = title || intl.formatMessage({ id: 'title' });
  const metaDescription =
    description || intl.formatMessage({ id: 'description' });

  const metaImage = image || config.siteMetadata.image;

  return (
    <Helmet
      htmlAttributes={{
        lang: intl.locale
      }}
      title={metaTitle}
      titleTemplate={`%s | ${intl.formatMessage({ id: 'author' })}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: metaImage,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: intl.formatMessage({ id: 'author' }),
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    />
  );
}

SEO.defaultProps = {
  lang: `ru`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  image: PropTypes.string,
};

export default SEO;
