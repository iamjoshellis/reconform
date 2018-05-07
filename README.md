# Reconform

[![Build Status](https://travis-ci.org/iamjoshellis/reconform.svg?branch=master)](https://travis-ci.org/iamjoshellis/reconform)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/reconform.svg)](https://www.npmjs.com/package/reconform)

* [Higher order components](#higher-order-components)
  + [`withFields()`](#withfields)
  + [`withForm()`](#withform)

## Higher order components

### `withFields()`

```js
config: {
  [fieldName: String]: {
    ?name: String // default: fieldName
    ?value: String | Array, // default: ''
    ?message: Node, // default: ''
    ?focused: Boolean, // default: false
    ?touched: Boolean, // default: false
    ?changed: Boolean, // default: false
    ?valid: Boolean, // default: true
    ?validator: (value: String, props: Object) => Boolean | Node, // default: undefined
  }
}

withFields(
  config | (props: Object) => config
): HigherOrderComponent
```

Usage example:

```js
const enhance = withFields({
  username: {
    validator: (value, props) => value.length > 12 && 'Too Long Amigo',
  }
});

const Form = enhance(({ fields, fieldEventHandlers }) =>
  <form>
    <label>
      <span>username</span>
      <input name={fields.username.name} value={fields.username.value} {...fieldEventHandlers} />
    </label>
    {fields.username.touched && !fields.username.valid && <p>{fields.username.message}</p>}
  </form>
)
```

### `withForm()`

```js
config: {
  loading: Boolean, // default: false
  onSubmit: (props: Object) => any // default: undefined
}

withFields(
  config | (props: Object) => config
): HigherOrderComponent
```

Usage example:

```js
const enhance = withForm({
  onSubmit: async (props) => {
    await props.someHandler(props.form.values);
  }
});

const Form = enhance(({ fields, fieldEventHandlers, form, onSubmit }) =>
  <form onSubmit={onSubmit}>
    <label>
      <span>Username</span>
      <input name={fields.username.name} value={fields.username.value} {...fieldEventHandlers} />
    </label>
    {fields.username.touched && !fields.username.valid && <p>{fields.username.message}</p>}
    <button disabled={form.loading || !form.valid || !form.changed}>Submit</button>
  </form>
)
```