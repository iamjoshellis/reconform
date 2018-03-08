const getFieldKeyValues = fields =>
  Object.keys(fields).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: fields[curr].value
    }),
    {}
  );

export default getFieldKeyValues;
