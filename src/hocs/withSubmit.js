import React from "react";

const withSubmit = (onSubmit = () => null) => BaseComponent =>
  class Submit extends React.Component {
    _handleFormSubmit = e => {
      e.preventDefault();
      onSubmit(this.props);
    };

    render = () => (
      <BaseComponent
        formEventHandlers={{
          onSubmit: this._handleFormSubmit
        }}
        {...this.props}
      />
    );
  };

export default withSubmit;
