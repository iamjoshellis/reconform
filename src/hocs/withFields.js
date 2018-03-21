import React from "react";

const withFields = (config = {}) => BaseComponent =>
  class Fields extends React.Component {
    _config = typeof config === "function" ? config(this.props) : config;

    state = Object.keys(this._config).reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: {
          name: this._config[curr].name || curr,
          value: this._config[curr].value || "",
          message: this._config[curr].message || "",
          focused: this._config[curr].focused || false,
          touched: this._config[curr].touched || false,
          changed: this._config[curr].changed || false,
          valid: this._config[curr].valid || true,
          ...this._config[curr]
        }
      }),
      {}
    );

    _handleValidation = ({ name, value }) => {
      if (this._config[name] && this._config[name].validator) {
        const validation = this._config[name].validator(value, this.props);
        if (this[name]) window.clearTimeout(this[name]);
        this[name] = window.setTimeout(() => {
          this.setState(prevState => ({
            ...prevState,
            [name]: {
              ...prevState[name],
              valid: validation == false, // eslint-disable-line eqeqeq
              message: validation
            }
          }));
        }, (this.state[name].valid && validation.length && this._config[name].debounce) || 0);
      }
    };

    _handleFieldChange = e => {
      const { name, value, type } = e.target;
      this.setState(prevState => {
        const newValue =
          type === "checkbox"
            ? prevState[name] &&
              prevState[name].value &&
              Array.isArray(prevState[name].value)
              ? prevState[name].value.includes(value)
                ? prevState[name].value.filter(item => item !== value)
                : [...prevState[name].value, value]
              : [value]
            : value;
        return {
          [name]: {
            ...prevState[name],
            touched: true,
            value: newValue,
            changed: newValue !== this._config[name].value
          }
        };
      });
      this._handleValidation({ name, value });
    };

    _handleFieldFocus = e => {
      const { name } = e.target;
      this.setState(prevState => ({
        [name]: { ...prevState[name], focused: true }
      }));
    };

    _handleFieldBlur = e => {
      const { name } = e.target;
      this.setState(prevState => ({
        [name]: { ...prevState[name], focused: false, touched: true }
      }));
    };

    render = () => (
      <BaseComponent
        fields={this.state}
        fieldEventHandlers={{
          onChange: this._handleFieldChange,
          onFocus: this._handleFieldFocus,
          onBlur: this._handleFieldBlur
        }}
        {...this.props}
      />
    );
  };

export default withFields;
