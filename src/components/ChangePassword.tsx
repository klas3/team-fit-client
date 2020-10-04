import { Formik } from 'formik';
// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { theme } from '../other/constants';
import { changingPasswordSchema } from '../other/validation.schemas';
import { changePassword } from '../other/api';
import LoadingSpinner from './LoadingSpinner';

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  inputsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    marginTop: 2,
    marginBottom: 2,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  widthContainer: {
    width: '90%',
  },
  button: {
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 20,
    textTransform: 'none',
  },
  errorText: {
    color: theme.colors.primary,
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 17,
  },
  successText: {
    color: 'green',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 17,
  },
});

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessLabel, setShowSuccessLabel] = useState(false);

  const changeUserPassword = async (values: any) => {
    setShowSuccessLabel(false);
    setIsLoading(true);
    const { oldPassword, newPassword } = values;
    const changingResult = await changePassword(oldPassword, newPassword);
    setIsLoading(false);
    if (changingResult.error) {
      setError(changingResult.error);
      return;
    }
    setShowSuccessLabel(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <Formik
      initialValues={{
        oldPassword: '',
        newPassword: '',
        confirmedNewPassword: '',
      }}
      validationSchema={changingPasswordSchema}
      onSubmit={changeUserPassword}
    >
      {(formik) => (
        <View style={styles.flexContainer}>
          <View style={styles.inputsContainer}>
            <View style={styles.widthContainer}>
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Old password"
                value={formik.values.oldPassword}
                onChangeText={formik.handleChange('oldPassword')}
              />
              <TextInput
                style={styles.input}
                mode="outlined"
                label="New password"
                value={formik.values.newPassword}
                onChangeText={formik.handleChange('newPassword')}
              />
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Confirm new password"
                value={formik.values.confirmedNewPassword}
                onChangeText={formik.handleChange('confirmedNewPassword')}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {showSuccessLabel && (
              <Text style={styles.successText}>Your password has been changed!</Text>
            )}
            {/* prettier-ignore */}
            <Text style={styles.errorText}>
              {formik.touched.newPassword
                && (formik.errors.oldPassword
                  || formik.errors.newPassword
                  || formik.errors.confirmedNewPassword
                )}
            </Text>
            <Text style={styles.errorText}>{error}</Text>
            <View style={styles.widthContainer}>
              <Button style={styles.button} mode="contained" onPress={formik.handleSubmit}>
                <Text style={styles.buttonText}>Change password</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default ChangePassword;
