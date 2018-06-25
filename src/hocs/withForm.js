import React from "react";

import { getFieldValues } from "../utils";

const setIntialState = config => ({
  fields: Object.keys(config.fields).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: {
        name: config.fields[curr].name || curr,
        value: config.fields[curr].value || "",
        message: config.fields[curr].message || "",
        focused: config.fields[curr].focused || false,
        touched: config.fields[curr].touched || false,
        dirty: config.fields[curr].dirty || false,
        valid: !config.fields[curr].validator,
        ...config.fields[curr]
      }
    }),
    {}
  ),
  submitting: config.submitting || false
});

const withFields = (config = {}) => BaseComponent =>
  class Fields extends React.Component {
    _config = typeof config === "function" ? config(this.props) : config;

    state = setIntialState(this._config);

    _handleValidation = async ({ name, value }) => {
      if (this._config.fields[name] && this._config.fields[name].validator) {
        const validation = await this._config.fields[name].validator(
          value,
          this.props
        );
        this.setState(prevState => ({
          fields: {
            ...prevState.fields,
            [name]: {
              ...prevState.fields[name],
              valid: validation == false, // eslint-disable-line eqeqeq
              message: validation || prevState.fields[name].message
            }
          }
        }));
      }
    };

    _handleFieldChange = e => {
      const { name, value, type } = e.target;
      this.setState(prevState => {
        const newValue =
          type === "checkbox"
            ? prevState.fields[name] &&
              prevState.fields[name].value &&
              Array.isArray(prevState.fields[name].value)
              ? prevState.fields[name].value.includes(value)
                ? prevState.fields[name].value.filter(item => item !== value)
                : [...prevState.fields[name].value, value]
              : [value]
            : value;
        return {
          fields: {
            ...prevState.fields,
            [name]: {
              ...prevState.fields[name],
              touched: true,
              value: newValue,
              dirty: newValue !== this._config.fields[name].value
            }
          }
        };
      });
      this._handleValidation({ name, value });
    };

    _handleFieldFocus = e => {
      const { name, value } = e.target;
      this.setState(prevState => ({
        fields: {
          ...prevState.fields,
          [name]: { ...prevState.fields[name], focused: true }
        }
      }));
      this._handleValidation({ name, value });
    };

    _handleFieldBlur = e => {
      const { name, value } = e.target;
      this.setState(prevState => ({
        fields: {
          ...prevState.fields,
          [name]: { ...prevState.fields[name], focused: false, touched: true }
        }
      }));
      this._handleValidation({ name, value });
    };

    _resetForm = () => {
      this.setState(() => setIntialState(this._config));
    };

    _handleChangeSubmitting = submitting => {
      this.setState(() => ({ submitting }));
    };

    _handleOnSubmit = async e => {
      if (e && e.preventDefault && typeof e.preventDefault === "function") {
        e.preventDefault();
      }
      if (this._config.onSubmit) {
        this._handleChangeSubmitting(true);
        try {
          await this._config.onSubmit(getFieldValues(this.props.fields), {
            ...this.props,
            ...this.state
          });
          this._handleChangeSubmitting(false);
        } catch (error) {
          this._handleChangeSubmitting(false);
          throw error;
        }
      }
    };

    render = () => (
      <BaseComponent
        fields={this.state.fields}
        fieldEventHandlers={{
          onChange: this._handleFieldChange,
          onFocus: this._handleFieldFocus,
          onBlur: this._handleFieldBlur
        }}
        resetForm={this._resetForm}
        onSubmit={this._handleOnSubmit}
        changeSubmitting={this._handleChangeSubmitting}
        {...this.props}
      />
    );
  };

export default withFields;
