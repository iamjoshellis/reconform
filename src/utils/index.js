export const getFieldValues = fields =>
  Object.keys(fields).reduce((prev, curr) => {
    if (fields[curr].type === "checkbox" || fields[curr].type === "radio") {
      return {
        ...prev,
        [curr]: fields[curr].checked || false
      };
    }
    return {
      ...prev,
      [curr]: fields[curr].value
    };
  }, {});
