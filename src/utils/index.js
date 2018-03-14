export const getFieldValues = fields =>
  Object.keys(fields).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: fields[curr].value
    }),
    {}
  );

export const checkFormValid = fields =>
  Object.keys(fields).every(field => field.valid);

export const checkFormChanged = fields =>
  Object.keys(fields).some(field => field.changed);
