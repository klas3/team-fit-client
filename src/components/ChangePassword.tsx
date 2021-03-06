import { Formik } from 'formik';
// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { changingPasswordSchema } from '../other/validation.schemas';
import { changePassword } from '../other/api';
import LoadingSpinner from './LoadingSpinner';
import { Alignments, Sizes, Typography } from '../styles';

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessLabel, setShowSuccessLabel] = useState(false);

  const formikInitialValues = {
    oldPassword: '',
    newPassword: '',
    confirmedNewPassword: '',
  };

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
      initialValues={formikInitialValues}
      validationSchema={changingPasswordSchema}
      onSubmit={changeUserPassword}
    >
      {(formik) => (
        <View style={styles.flexContainer}>
          <View style={styles.inputsContainer}>
            <View style={styles.widthContainer}>
              <TextInput
                secureTextEntry
                style={styles.input}
                mode="flat"
                label="Old password"
                value={formik.values.oldPassword}
                onChangeText={formik.handleChange('oldPassword')}
              />
              <TextInput
                secureTextEntry
                style={styles.input}
                mode="flat"
                label="New password"
                value={formik.values.newPassword}
                onChangeText={formik.handleChange('newPassword')}
              />
              <TextInput
                secureTextEntry
                style={styles.input}
                mode="flat"
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
            <Text style={styles.errorText}>
              {formik.touched.newPassword
                && (formik.errors.oldPassword
                  || formik.errors.newPassword
                  || formik.errors.confirmedNewPassword)}
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

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  widthContainer: {
    width: '90%',
  },
  errorText: Typography.errorText,
  buttonText: Typography.buttonText,
  successText: Typography.successText,
  inputsContainer: Alignments.centerHorizontal,
  buttonContainer: {
    ...Alignments.centerHorizontal,
    justifyContent: 'flex-end',
  },
  input: {
    margin: Sizes.tiny,
    backgroundColor: 'white',
  },
  button: {
    marginBottom: Sizes.base,
  },
});

export default ChangePassword;
