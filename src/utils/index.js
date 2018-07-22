export const getFieldValues = fields =>
  Object.keys(fields).reduce((prev, curr) => {
    if (fields[curr].type === "checkbox") {
      return {
        ...prev,
        [fields[curr].value || curr]: fields[curr].checked || false
      };
    }
    return {
      ...prev,
      [curr]: fields[curr].value
    };
  }, {});
