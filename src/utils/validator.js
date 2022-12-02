import * as yup from 'yup';

const validate = (value, uniqueValues) => {
  const schema = yup.string().required().url().notOneOf(uniqueValues);
  try {
    schema.validateSync(value);
    return null;
  } catch (error) {
    return error;
  }
};

export default validate;
