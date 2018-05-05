export const getFieldValues = fields =>
  Object.keys(fields).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: fields[curr].value
    }),
    {}
  );

export const checkFormValid = fields =>
  Object.keys(fields).every(field => fields[field].valid);

export const checkFormChanged = fields =>
  Object.keys(fields).some(field => fields[field].changed);

export const isFunction = obj => typeof obj === "function";

export const isObject = obj => obj !== null && typeof obj === "object";

export const isPromise = value => isObject(value) && isFunction(value.then);
