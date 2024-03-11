import toast from "react-hot-toast";

// validate login page username
export async function usernameValidate(values) {
  const error = usernameVerify({}, values);
  return error;
}

// validate password for login
export async function passwordValidate(values) {
  const error = passwordVerify({}, values);
  return error;
}

export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password not match...!");
  }

  return errors;
}

export async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);

  return errors;
}

/** validate profile page */
export async function profileValidation(values) {
  const errors = emailVerify({}, values);
  return errors;
}

// ----------------------------------------------------------------

// validate password
function passwordVerify(errors = {}, values) {
  const specialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!values.password) {
    errors.password = toast.error("Password Required...!");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("No Spaces Allowed...!");
  } else if (values.password.length < 6) {
    errors.password = toast.error("Password must be atleast 6 characters...!");
  } else if (!specialChar.test(values.password)) {
    errors.password = toast.error(
      "Password must contain special character...!",
    );
  }
  return errors;
}

// validate username
function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username Required...!");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("No Spaces Allowed...!");
  }
  return error;
}

function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email Required...!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email...!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address...!");
  }

  return error;
}
