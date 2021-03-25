import React from 'react';

import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import StepUpload from './step-upload';
import StepProcess from './step-process';

import './master.scss';
import AppContext from '../context/AppContext';

import { injectIntl } from 'gatsby-plugin-intl';

class Master extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
  }

  first() {
    const current = 0;
    this.context.setStep(current);
  }

  next() {
    const current = this.context.currentStep + 1;
    this.context.setStep(current);
  }

  prev() {
    const current = this.context.currentStep - 1;
    this.context.setStep(current);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { currentStep } = this.context;
    return (
      <div className="master">
        {currentStep === 0 && (
          <div className="steps-content">
            <StepUpload />
          </div>
        )}

        {currentStep === 1 && (
          <div className="steps-content">
            <StepProcess />
          </div>
        )}

        <div className="steps-action">
          {currentStep === 1 && (
            <Button
              type="danger"
              size="large"
              onClick={() => this.first()}
              icon={<ReloadOutlined />}
            >
              {formatMessage({ id: 'retry' })}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default injectIntl(Master);
