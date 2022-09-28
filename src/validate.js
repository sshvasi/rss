import * as yup from 'yup';

const validate = (value, uniqueValues) => {
  const scheme = yup
    .string()
    .required()
    .url()
    .notOneOf(uniqueValues);

  try {
    scheme.validateSync(value);

    return null;
  } catch (error) {
    return error;
  }
};

export default validate;
