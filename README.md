# Reconform

[![Build Status](https://travis-ci.org/iamjoshellis/reconform.svg?branch=master)](https://travis-ci.org/iamjoshellis/reconform)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/reconform.svg)](https://www.npmjs.com/package/reconform)

* [Higher order components](#higher-order-components)
  + [`withFields()`](#withfields)
  + [`withForm()`](#withform)
* [utils](#utils)
  + [`getFieldValues()`](#getfieldvalues)
  + [`checkFormValid()`](#checkFormValid)
  + [`checkFormChanged()`](#checkFormChanged)

## Higher order components

### `withFields()`

```js
config: {
  [fieldName: String]: {
    ?name: String // default: fieldName
    ?value: String | Array, // default: ''
    ?message: String, // default: ''
    ?focused: Boolean, // default: false
    ?touched: Boolean, // default: false
    ?changed: Boolean, // default: false
    ?valid: Boolean, // default: true
    ?debounce: Number // default: undefined
    ?validator: (value: String, props: Object) => Boolean | String, // default: undefined
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
    debounce: 300
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
  onSubmit: (props) => {
    props.changeLoading(true);
    someHandler(props.form.values)
      .then(() => {
        props.changeLoading(false);
      })
      .catch(() => {
        props.changeLoading(false);
      })
  }
});

const Form = enhance(({ fields, fieldEventHandlers, form, onSubmit }) =>
  <form disabled={form.loading || !form.valid || !form.changed} onSubmit={onSubmit}>
    <label>
      <span>username</span>
      <input name={fields.username.name} value={fields.username.value} {...fieldEventHandlers} />
    </label>
    {fields.username.touched && !fields.username.valid && <p>{fields.username.message}</p>}
    <button>submit</button>
  </form>
)
```

## Utils

### `getFieldValues()`

```js
getFieldValues(fields: Object) => ({
  [fieldName: String]: String
})
```

### `checkFormValid()`

```js
checkFormValid(fields: Object) => Boolean
```

### `checkFormChanged()`

```js
checkFormChanged(fields: Object) => Boolean
```