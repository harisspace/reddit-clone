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
  if (
    validator.isEmpty(username) ||
    validator.isEmpty(first_name) ||
    validator.isEmpty(last_name) ||
    validator.isEmpty(email) ||
    validator.isEmpty(password)
  ) {
    errors.username = "Username must not empty";
  }

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
  if (validator.isEmpty(username) || validator.isEmpty(password)) {
    errors.username = "Username must not empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1 ? true : false,
  };
};
