export const getFieldValues = fields =>
  Object.keys(fields).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: fields[curr].value
    }),
    {}
  );
