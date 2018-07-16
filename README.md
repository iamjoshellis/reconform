# Reconform

[![Build Status](https://travis-ci.org/iamjoshellis/reconform.svg?branch=master)](https://travis-ci.org/iamjoshellis/reconform)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/reconform.svg)](https://www.npmjs.com/package/reconform)

## Higher order component

```js
config: {
  fields: {
    [fieldName: String]: {
      ?name: String // default: fieldName
      ?value: String | Array, // default: ''
      ?message: Node, // default: ''
      ?focused: Boolean, // default: false
      ?touched: Boolean, // default: false
      ?dirty: Boolean, // default: false
      ?valid: Boolean, // default: !Boolean(validator)
      ?validator: (value: String, props: Object) => Boolean | Node, // default: undefined
    }
  },
  submitting: Boolean, // default: false,
  onSubmit: (props: Object) => any // default: undefined
}
```

Usage example:

```js
const enhance = withForm({
  fields: {
    username: {
      validator: (value, props) => value.length > 12 && 'Too Long Amigo',
    }
  }
  onSubmit: async (values, props) => {
    await props.someHandler(values);
    props.resetForm();
  }
});

const Form = enhance(({ fields, submitting, fieldEventHandlers, onSubmit }) =>
  <form onSubmit={onSubmit}>
    <label>
      <span>Username</span>
      <input name={fields.username.name} value={fields.username.value} {...fieldEventHandlers} />
    </label>
    {fields.username.touched && !fields.username.valid && <p>{fields.username.message}</p>}
    <button disabled={submitting}>Submit</button>
  </form>
)
```