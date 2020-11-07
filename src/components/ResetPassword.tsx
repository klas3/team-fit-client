import { Formik } from 'formik';
// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { resetPasswordSchema } from '../other/validation.schemas';
import { resetPassword } from '../other/api';
import LoadingSpinner from './LoadingSpinner';
import { Alignments, Sizes, Typography } from '../styles';
import userInfo from '../services/userInfo';

interface IProps {
  onPasswordReset: () => void;
}

const ResetPassword = (props: IProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const formikInitialValues = {
    newPassword: '',
    confirmedNewPassword: '',
  };

  const { onPasswordReset } = props;

  const changeUserPassword = async (values: any) => {
    setIsLoading(true);
    const { email, recoveryCode } = userInfo;
    const response = await resetPassword(email, recoveryCode, values.newPassword);
    setIsLoading(false);
    if (response.error) {
      return;
    }
    onPasswordReset();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <Formik
      initialValues={formikInitialValues}
      validationSchema={resetPasswordSchema}
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
            <Text style={styles.errorText}>
              {formik.touched.newPassword
                && (formik.errors.newPassword || formik.errors.confirmedNewPassword)}
            </Text>
            <View style={styles.widthContainer}>
              <Button style={styles.button} mode="contained" onPress={formik.handleSubmit}>
                <Text style={styles.buttonText}>Reset password</Text>
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

export default ResetPassword;
