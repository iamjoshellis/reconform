import React from "react";
import isEqual from "lodash.isequal";

import {
  getFieldValues,
  checkFormValid,
  checkFormChanged,
  isPromise
} from "../utils";

const withForm = (config = {}) => BaseComponent =>
  class Form extends React.Component {
    _config = typeof config === "function" ? config(this.props) : config;

    static defaultProps = {
      fields: {}
    };

    state = {
      loading: this._config.loading || false,
      valid: this._config.valid || checkFormValid(this.props.fields),
      changed: this._config.changed || checkFormChanged(this.props.fields),
      values: getFieldValues(this.props.fields)
    };

    componentWillReceiveProps(nextProps) {
      if (!isEqual(this.props.fields, nextProps.fields)) {
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

    _handleOnSubmit = async e => {
      e.preventDefault();
      if (this._config.onSubmit) {
        if (isPromise(this._config.onSubmit)) {
          this._handleChangeLoading(true);
          try {
            await this._config.onSubmit({
              ...this.props,
              form: this.state
            });
            this._handleChangeLoading(false);
          } catch (error) {
            this._handleChangeLoading(false);
          }
        } else {
          this._config.onSubmit({
            ...this.props,
            form: this.state
          });
        }
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
