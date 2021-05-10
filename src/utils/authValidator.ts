import validator from "validator";

interface IErrorsRegister {
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}

interface IErrorsLogin {
  username?: string;
  password?: string;
}

export const registerValidation = (
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  password: string
) => {
  let errors: IErrorsRegister = {};
  // validate username, first_name, last_name, and email not empty
  validator.isEmpty(username)
    ? (errors.username = "Username must not empty")
    : null;
  validator.isEmpty(first_name)
    ? (errors.first_name = "first name must not empty")
    : null;
  validator.isEmpty(last_name)
    ? (errors.last_name = "last name must not empty")
    : null;
  validator.isEmpty(email) ? (errors.email = "email must not empty") : null;
  validator.isEmpty(password)
    ? (errors.password = "password must not empty")
    : null;

  // validate email
  if (!validator.isEmail(email)) {
    errors.email = "Email not valid";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1 ? true : false,
  };
};

export const loginValidation = (username: string, password: string) => {
  let errors: IErrorsLogin = {};
  // validate username, first_name, last_name, and email not empty
  validator.isEmpty(username)
    ? (errors.username = "Username must not empty")
    : null;
  validator.isEmpty(password)
    ? (errors.password = "password must not empty")
    : null;

  return {
    errors,
    valid: Object.keys(errors).length < 1 ? true : false,
  };
};
