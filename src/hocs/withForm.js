import React from "react";
import { equals } from "ramda";

import { getFieldValues, checkFormValid, checkFormChanged } from "./utils";

const withForm = (config = {}) => BaseComponent =>
  class Form extends React.Component {
    _config = typeof config === "function" ? config(this.props) : config;

    static defaultProps = {
      fields: {}
    };

    state = {
      loading: this._config.loading || false,
      valid: checkFormValid(this.props.fields),
      changed: checkFormChanged(this.props.fields),
      values: getFieldValues(this.props.fields)
    };

    componentWillReceiveProps(nextProps) {
      if (!equals(this.props.fields, nextProps.fields)) {
        this.setState(() => ({
          valid: checkFormValid(nextProps.fields),
          changed: checkFormChanged(nextProps.fields),
          values: getFieldValues(nextProps.fields)
        }));
      }
    }

    _handleChangeLoading = loading => {
      this.setState(() => ({ loading }));
    };

    _handleOnSubmit = e => {
      e.preventDefault();
      if (this._config.onSubmit) {
        this._config.onSubmit(this.props);
      }
    };

    render = () => (
      <BaseComponent
        form={this.state}
        onSubmit={this._handleOnSubmit}
        changeLoading={this._handleChangeLoading}
        {...this.props}
      />
    );
  };

export default withForm;
