import { Formik } from 'formik';
// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import LoadingSpinner from '../components/LoadingSpinner';
import { register } from '../other/api';
import { theme } from '../other/constants';
import { registerSchema } from '../other/validation.schemas';

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    alignItems: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '90%',
  },
  actionButton: {
    margin: 20,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    textTransform: 'none',
  },
  errorText: {
    color: theme.colors.primary,
    marginTop: 8,
    textAlign: 'center',
    fontSize: 17,
  },
  appLogo: {
    resizeMode: 'stretch',
    width: '100%',
    marginBottom: 20,
  },
});

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
              mode="outlined"
              label="Email"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
            />
            <TextInput
              mode="outlined"
              label="Login"
              value={formik.values.login}
              onChangeText={formik.handleChange('login')}
            />
            <TextInput
              mode="outlined"
              label="Password"
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
            />
            <TextInput
              mode="outlined"
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

export default Register;
