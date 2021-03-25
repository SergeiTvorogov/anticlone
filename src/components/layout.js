import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'gatsby';
import { Layout, Row, Col } from 'antd';

const { Header, Content, Footer } = Layout;

import './layout.scss';

import config from '../../config.json';

import { useIntl } from 'gatsby-plugin-intl';

const MyLayout = ({ children }) => {
  const intl = useIntl();
  return (
    <>
      <Header className="header">
        <Link to="/">
          <div className="logo">{intl.formatMessage({ id: 'logo' })}</div>
        </Link>
      </Header>
      <Row className="content-wrapper">
        <Col md={6} />
        <Col md={12}>
          <Content className="content">{children}</Content>
        </Col>
        <Col md={6} />
      </Row>
      <Footer className="footer">
        <Link to={config.authorUrl}>Sergei Tvorogov</Link>
        <Link to={config.githubUrl}>GitHub</Link>
        <div className="lang">
          <Link to={intl.locale === 'ru' ? '/en' : '/ru'}>
            {intl.formatMessage({ id: 'languageSwitch' })}
          </Link>
        </div>
      </Footer>
    </>
  );
};

MyLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MyLayout;
