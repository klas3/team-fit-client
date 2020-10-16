import { Formik } from 'formik';
// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import LoadingSpinner from '../components/LoadingSpinner';
import { register } from '../other/api';
import { theme } from '../other/constants';
import { registerSchema } from '../other/validation.schemas';
// prettier-ignore
import {
  Alignments, Images, Spacing, Typography,
} from '../styles';

interface IProps {
  // eslint-disable-next-line react/require-default-props
  navigation?: any;
}

const Register = (props: IProps) => {
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsloading] = useState(false);

  const { navigation } = props;

  const registerUser = async (values: any, actions: any) => {
    setIsloading(true);
    const { login, password, email } = values;
    const result = await register(login, password, email);
    setIsloading(false);
    if (result.error) {
      setErrorText(result.error);
      return;
    }
    navigation.navigate('Login');
    actions.resetForm();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <View style={styles.containter}>
      <Formik
        initialValues={{
          login: '',
          password: '',
          email: '',
          confirmedPassword: '',
        }}
        validationSchema={registerSchema}
        onSubmit={registerUser}
      >
        {(formik) => (
          <View style={styles.form}>
            <Image style={styles.appLogo} source={require('../../assets/app-logo.png')} />
            <TextInput
              label="Email"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
            />
            <TextInput
              label="Login"
              value={formik.values.login}
              onChangeText={formik.handleChange('login')}
            />
            <TextInput
              label="Password"
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
            />
            <TextInput
              label="Confirm password"
              value={formik.values.confirmedPassword}
              onChangeText={formik.handleChange('confirmedPassword')}
            />
            <Text style={styles.errorText}>
              {(formik.touched.email && formik.errors.email) || errorText}
            </Text>
            <Text style={styles.errorText}>{formik.touched.login && formik.errors.login}</Text>
            {/* prettier-ignore */}
            <Text style={styles.errorText}>
              {formik.touched.password
                && (formik.errors.password || formik.errors.confirmedPassword)}
            </Text>
            <Button
              mode="contained"
              style={styles.actionButton}
              color={theme.colors.primary}
              onPress={formik.handleSubmit}
            >
              <Text style={styles.buttonText}>Register</Text>
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  containter: Alignments.centerHorizontal,
  form: Alignments.centerVerticallyNarrowly,
  buttonText: { ...Typography.buttonText, color: 'white' },
  errorText: Typography.errorText,
  appLogo: Images.appLogo,
  actionButton: {
    margin: Spacing.large,
  },
});

export default Register;
