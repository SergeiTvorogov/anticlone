import React from 'react';

const defaultState = {
  currentStep: 0,
  nextStep: () => {},
  setStep: () => {},
  imageSource: null,
  setSourceImage: () => {},
};

const AppContext = React.createContext(defaultState);

class AppProvider extends React.Component {
  state = {
    currentStep: 0,
    imageSource: null,
  };

  nextStep = () => {
    this.setState({ currentStep: this.state.currentStep + 1 });
  };

  setStep = (currentStep) => {
    this.setState({ currentStep });
  };

  setSourceImage = (imageSource) => {
    this.setState({ imageSource });
  };

  render() {
    const { children } = this.props;
    const { imageSource, currentStep } = this.state;
    return (
      <AppContext.Provider
        value={{
          imageSource,
          setSourceImage: this.setSourceImage,
          currentStep,
          nextStep: this.nextStep,
          setStep: this.setStep,
        }}
      >
        {children}
      </AppContext.Provider>
    );
  }
}

export default AppContext;
export { AppProvider };
