import React from "react";

const setIntialState = config =>
  Object.keys(config).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: {
        name: config[curr].name || curr,
        value: config[curr].value || "",
        message: config[curr].message || "",
        focused: config[curr].focused || false,
        touched: config[curr].touched || false,
        changed: config[curr].changed || false,
        valid: config[curr].valid || true,
        ...config[curr]
      }
    }),
    {}
  );

const withFields = (config = {}) => BaseComponent =>
  class Fields extends React.Component {
    _config = typeof config === "function" ? config(this.props) : config;

    state = setIntialState(this._config);

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
              message: validation || prevState[name].message
            }
          }));
        }, (this.state[name].valid && validation != false && this._config[name].debounce) || 0); // eslint-disable-line eqeqeq
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
      const { name, value } = e.target;
      this.setState(prevState => ({
        [name]: { ...prevState[name], focused: true }
      }));
      this._handleValidation({ name, value });
    };

    _handleFieldBlur = e => {
      const { name, value } = e.target;
      this.setState(prevState => ({
        [name]: { ...prevState[name], focused: false, touched: true }
      }));
      this._handleValidation({ name, value });
    };

    _resetFields = () => {
      this.setState(() => setIntialState(this._config));
    };

    render = () => (
      <BaseComponent
        fields={this.state}
        fieldEventHandlers={{
          onChange: this._handleFieldChange,
          onFocus: this._handleFieldFocus,
          onBlur: this._handleFieldBlur
        }}
        resetFields={this._resetFields}
        {...this.props}
      />
    );
  };

export default withFields;
