import * as yup from 'yup';

function equalTo(ref: yup.Ref, msg: string) {
  return yup.mixed().test({
    name: 'equalTo',
    exclusive: false,
    message: msg || 'must be the same as',
    test(value) {
      return value === this.resolve(ref);
    },
  });
}

// prettier-ignore
// eslint-disable-next-line
export const registerSchema = yup.object({
  login: yup
    .string()
    .required('Enter your login')
    .min(4, 'The minimum login length is 4')
    .test('is-valid', 'The login should contain only letters or numbers', (value) => /^[a-zA-Z0-9_.-]*$/.test(value as string)),
  email: yup.string().required('Enter your email').email('Email is incorrect'),
  password: yup
    .string()
    .required('Enter your password')
    .min(7, 'The minimum password length is 7')
    .test('has-letter', 'The password should contain at least 1 letter', (value) => /.*[a-zA-Z].*/.test(value as string)),
  confirmedPassword: equalTo(yup.ref('password'), 'The passwords don\'t match').required(
    'All fields should be filled',
  ),
});

// prettier-ignore
// eslint-disable-next-line
export const changingPasswordSchema = yup.object({
  oldPassword: yup.string().required('All fields should be filled'),
  newPassword: yup
    .string()
    .required('Enter your new password')
    .min(7, 'The minimum password length is 7')
    .test('has-letter', 'The password should contain at least 1 letter', (value) => /.*[a-zA-Z].*/.test(value as string)),
  confirmedNewPassword: equalTo(yup.ref('newPassword'), 'Passwords don\'t match').required(
    'All fields should be filled',
  ),
});
