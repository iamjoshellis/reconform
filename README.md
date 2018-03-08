# Reform

[![Build Status](https://travis-ci.org/iamjoshellis/reconform.svg?branch=master)](https://travis-ci.org/iamjoshellis/reconform)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

* [Higher order components](#higher-order-components)
  + [`withFields()`](#withfields)
  + [`withSubmit()`](#withsubmit)
* [utils](#utils)
  + [`getFieldValues()`](#getfieldvalues)

## Higher order components

### `withFields()`

```js
withFields({
  [fieldName: string]: {
    ?value: String, // default: ''
    ?focused: Boolean, // default: false
    ?touched: Boolean, // default: false
    ?valid: Boolean, // default: true
    ?validator: (value: String, props: Object) => Boolean | String, // default: undefined
    ?message: String, // default: ''
    ?debounce: 300 // default: undefined
  }
}): HigherOrderComponent
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
      <input name="username" value={fields.username.value} {...fieldEventHandlers} />
    </label>
    {!fields.username.valid && <p>{fields.username.message}</p>}
  </form>
)
```

### `withSubmit()`

```js
withSubmit(
  (fields: Object, props: Object) => any
): HigherOrderComponent
```

Usage example:

```js
const enhance = withSubmit(props => {
  props.submit(props.fields);
});

const Form = enhance(({ fields, fieldEventHandlers, formEventHandlers }) =>
  <form {...formEventHandlers}>
    <label>
      <span>username</span>
      <input name="username" value={fields.username.value} {...fieldEventHandlers} />
    </label>
    {!fields.username.valid && <p>{fields.username.message}</p>}
  </form>
)
```

## Utils

### `getFieldValues()`

```js
getFieldValues((fields: Object) => any): void
```

Usage example:

```js
const enhance = withSubmit(props => {
  props.submit(getFieldValues(props.fields));
});
```