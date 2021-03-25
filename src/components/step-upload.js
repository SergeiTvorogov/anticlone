import React from 'react';

import { Button, Alert, Upload, Modal, Spin, Typography, Row, Col } from 'antd';
import {
  CameraTwoTone,
  ScissorOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const { Dragger } = Upload;

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import './step-upload.scss';
import AppContext from '../context/AppContext';

import WhatsappIcon from './social/whatsapp-icon';
import VkIcon from './social/vk-icon';
import TelegramIcon from './social/telegram-icon';

import { injectIntl } from 'gatsby-plugin-intl';

import config from '../../config.json';

class StepUpload extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      src: null,
      modalVisible: false,
      loadingFile: false,
      croppingFile: false,
    };
    this.cropImage = this.cropImage.bind(this);
    this.rotateLeft = this.rotateLeft.bind(this);
    this.rotateRight = this.rotateRight.bind(this);
  }

  cropImage() {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    this.context.setSourceImage(
      this.cropper.getCroppedCanvas().toDataURL('image/jpeg')
    );
  }

  handleUpload = (file) => {
    this.setState({ loadingFile: true });

    let that = this;
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = () => {
        that.setState({
          src: reader.result,
          modalVisible: true,
          loadingFile: false,
        });
      };
      reader.readAsDataURL(file);
    }, 100);
  };

  showCropModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleCropOk = (e) => {
    this.setState({ croppingFile: true });
    let that = this;
    setTimeout(() => {
      that.cropImage();
      that.setState({
        modalVisible: false,
        croppingFile: false,
      });
      window.scrollTo(0, 0);
      that.context.nextStep();
    }, 100);
  };

  rotateLeft() {
    this.cropper.rotate(-90);
  }

  rotateRight() {
    this.cropper.rotate(90);
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="step-upload">
        <Spin spinning={this.state.loadingFile}>
          <Alert
            message={formatMessage({ id: 'privacyHeader' })}
            description={formatMessage({ id: 'privacyMessage' })}
            type="info"
            className="alert"
          />
          <Row>
            <Col md={6} />
            <Col md={12}>
              <Paragraph>
                <img
                  alt="example"
                  src="/example.jpg"
                  className="example-image"
                />
              </Paragraph>
              <Paragraph>
                <Text type="secondary">
                  {formatMessage({ id: 'servicePurpose' })}
                </Text>
              </Paragraph>
            </Col>
            <Col md={6} />
          </Row>
          <Dragger
            multiple={false}
            showUploadList={false}
            accept="image/jpeg,image/png"
            beforeUpload={this.handleUpload}
            customRequest={()=>{}}
            className="uploader"
          >
            <p className="ant-upload-drag-icon">
              <CameraTwoTone />
            </p>
            <p className="uploader-text">{formatMessage({ id: 'dragHere' })}</p>
          </Dragger>
          <div className="share">
            <div className="share-text">
              <Text type="secondary">
                {formatMessage({ id: 'socialShare' })}
              </Text>
            </div>
            <a
              className="share-link"
              href={config.shareUrlWhatsapp}
              target="_blank"
              rel="noopener"
              aria-label="WhatsApp"
            >
              <div className="share-button whatsapp">
                <div aria-hidden="true" className="share-icon">
                  <WhatsappIcon />
                </div>
                WhatsApp
              </div>
            </a>
            <a
              className="share-link"
              href={config.shareUrlVk}
              target="_blank"
              rel="noopener"
              aria-label="VK"
            >
              <div className="share-button vk">
                <div aria-hidden="true" className="share-icon">
                  <VkIcon />
                </div>
                VK
              </div>
            </a>
            <a
              className="share-link"
              href={config.shareUrlTelegram}
              target="_blank"
              rel="noopener"
              aria-label="Telegram"
            >
              <div className="share-button telegram">
                <div aria-hidden="true" className="share-icon">
                  <TelegramIcon />
                </div>
                Telegram
              </div>
            </a>
          </div>
        </Spin>
        <Modal
          visible={this.state.modalVisible}
          className="crop-modal"
          centered
          footer={[
            <Button
              key="submit"
              type="primary"
              icon={<ScissorOutlined />}
              loading={this.state.croppingFile}
              onClick={this.handleCropOk}
            >
              {formatMessage({ id: 'crop' })}
            </Button>,
          ]}
        >
          <Spin spinning={this.state.croppingFile}>
            <Cropper
              style={{ height: '300px', width: '100%' }}
              guides={false}
              src={this.state.src}
              ref={(cropper) => {
                this.cropper = cropper;
              }}
            />
            <div className="modal-actions">
              <Button.Group>
                <Button
                  type="primary"
                  icon={<UndoOutlined />}
                  size="large"
                  onClick={this.rotateLeft}
                />
                <Button
                  type="primary"
                  icon={<RedoOutlined />}
                  size="large"
                  onClick={this.rotateRight}
                />
              </Button.Group>
            </div>
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default injectIntl(StepUpload);
