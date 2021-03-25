import React from 'react';

import {
  Input,
  Checkbox,
  Button,
  Form,
  Spin,
  Typography,
  Collapse,
  message,
} from 'antd';
const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

import { EditOutlined, DownloadOutlined } from '@ant-design/icons';

import { MobileView } from 'react-device-detect';
import { HuePicker, AlphaPicker } from 'react-color';

import AppContext from '../context/AppContext';

import './step-process.scss';

import { injectIntl } from 'gatsby-plugin-intl';

import config from '../../config.json';

class StepProcess extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      processing: false,
      faceHide: false,
      faceBox: null,
      watermarkText: formatMessage({ id: 'defaultWatermarkText' }),
      displayColorPicker: false,
      color: {
        r: '0',
        g: '0',
        b: '0',
        a: '0.3',
      },
    };
  }

  componentDidMount() {
    this.updateCanvas();
  }

  async faceDetection() {
    const { formatMessage } = this.props.intl;

    if (!faceapi.nets.tinyFaceDetector.params) {
      await faceapi.nets.tinyFaceDetector.load('/');
    }

    const img = document.createElement('img');
    img.setAttribute('src', this.context.imageSource);

    const fullFaceDescriptions = await faceapi.detectAllFaces(
      img,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 512,
        scoreThreshold: 0.5,
      })
    );

    if (fullFaceDescriptions.length) {
      this.setState({ faceBox: fullFaceDescriptions[0].box });
    } else {
      this.setState({ faceBox: null });
      message.error(formatMessage({ id: 'faceNotFound' }));
    }

    this.setState({
      processing: false,
    });

    this.updateCanvas();
  }

  onFaceDetectionChange = (e) => {
    this.setState({
      faceHide: e.target.checked,
    });
    if (e.target.checked) {
      this.setState({
        processing: true,
      });
      this.faceDetection();
    } else {
      this.setState({
        faceBox: null,
      });
      this.updateCanvas();
    }
  };

  onTextChange = (e) => {
    this.setState({ watermarkText: e.target.value });
    this.updateCanvas();
  };

  handleDownload = () => {
    const dataURL = document
      .getElementsByClassName('canvas')[0]
      .toDataURL('image/jpeg');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = config.defaultFilename;
    a.target = 'blank';
    a.click();
    document
      .getElementsByClassName('download-image')[0]
      .setAttribute('src', dataURL);
  };

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    const img = new Image();
    img.src = this.context.imageSource;

    const that = this;
    img.onload = function () {
      const w = img.width;
      const h = img.height;

      ctx.canvas.width = w;
      ctx.canvas.height = h;

      ctx.drawImage(img, 0, 0);

      if (that.state.faceBox) {
        ctx.rect(
          that.state.faceBox.x,
          that.state.faceBox.y,
          that.state.faceBox.width,
          that.state.faceBox.height
        );
        ctx.fillStyle = 'rgba(255,255,255)';
        ctx.fill();
      }

      if (that.state.watermarkText) {
        const text = '  ' + that.state.watermarkText + '  ';

        // диагональ
        const d = Math.sqrt(w * w + h * h);
        // угол наклона диагонали
        const a = Math.asin(h / d);

        ctx.translate(w / 2, h / 2);
        ctx.rotate(-1 * a);
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        const font_h = Math.floor(h / 2);
        ctx.font = `${font_h}px serif`;
        const font_w = ctx.measureText(text).width;

        if (font_w > d) {
          ctx.font = `${(font_h * d) / font_w}px serif`;
        }

        ctx.fillStyle = `rgba(${that.state.color.r},${that.state.color.g},${that.state.color.b},${that.state.color.a})`;
        ctx.fillText(text, 0, 0, d);
      }
    };
  }

  handleHueChange = (color) => {
    const rgb = {
      r: color.rgb.r,
      g: color.rgb.g,
      b: color.rgb.b,
      a: this.state.color.a,
    };
    this.setState({ color: rgb });
    this.updateCanvas();
  };

  handleAlphaChange = (color) => {
    const rgb = {
      r: this.state.color.r,
      g: this.state.color.g,
      b: this.state.color.b,
      a: color.rgb.a,
    };
    this.setState({ color: rgb });
    this.updateCanvas();
  };

  isFaceApiAvailable = () => {
    return !!faceapi.nets && navigator.appVersion.indexOf('MSIE 10') === -1;
  };

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <Spin spinning={this.state.processing}>
        <div className="step-process">
          <div className="result">
            <canvas ref="canvas" className="canvas" width="300" height="300" />
          </div>
          <div className="settings">
            <Collapse bordered={false} defaultActiveKey={['2']}>
              <Panel header={formatMessage({ id: 'setupColor' })} key="1">
                <HuePicker
                  color={this.state.color}
                  onChange={this.handleHueChange}
                />
                <AlphaPicker
                  color={this.state.color}
                  onChange={this.handleAlphaChange}
                />
              </Panel>
              <Panel header={formatMessage({ id: 'setupText' })} key="2">
                <Form layout="inline">
                  <Form.Item>
                    <Input
                      prefix={<EditOutlined />}
                      placeholder={formatMessage({ id: 'watermarkText' })}
                      defaultValue={formatMessage({
                        id: 'defaultWatermarkText',
                      })}
                      onChange={this.onTextChange}
                    />
                  </Form.Item>
                  {this.isFaceApiAvailable() && (
                    <Form.Item>
                      <Checkbox
                        checked={this.state.faceHide}
                        onChange={this.onFaceDetectionChange}
                      >
                        {formatMessage({ id: 'hideFace' })}
                      </Checkbox>
                    </Form.Item>
                  )}
                </Form>
              </Panel>
            </Collapse>
          </div>
          <div className="actions">
            <MobileView>
              <Paragraph>
                <Text type="secondary">
                  {formatMessage({ id: 'downloadHelp' })}
                </Text>
              </Paragraph>
            </MobileView>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={this.handleDownload}
            >
              {formatMessage({ id: 'download' })}
            </Button>
            <div>
              <img className="download-image" />
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

export default injectIntl(StepProcess);
