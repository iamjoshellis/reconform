import React from "react";

const withFields = (config = {}) => BaseComponent =>
  class Fields extends React.Component {
    state = Object.keys(config).reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: {
          ...config[curr],
          value: config[curr].value || "",
          focused: config[curr].focused || false,
          touched: config[curr].touched || false,
          valid: config[curr].valid || true,
          message: config[curr].message || ""
        }
      }),
      {}
    );

    _handleValidation = ({ name, value }) => {
      if (config[name] && config[name].validator) {
        const validation = config[name].validator(value, this.props);
        if (this[name]) window.clearTimeout(this[name]);
        this[name] = window.setTimeout(() => {
          this.setState(prevState => ({
            ...prevState,
            [name]: {
              ...prevState[name],
              valid: !validation.length,
              message: validation
            }
          }));
        }, (this.state[name].valid && validation.length && config[name].debounce) || 0);
      }
    };

    _handleFieldChange = e => {
      const { name, value, type } = e.target;
      this.setState(prevState => ({
        [name]: {
          ...prevState[name],
          touched: true,
          value:
            type === "checkbox"
              ? prevState[name] &&
                prevState[name].value &&
                Array.isArray(prevState[name].value)
                ? prevState[name].value.includes(value)
                  ? prevState[name].value.filter(item => item !== value)
                  : [...prevState[name].value, value]
                : [value]
              : value
        }
      }));
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
