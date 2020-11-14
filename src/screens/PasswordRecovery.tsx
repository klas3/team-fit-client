// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
// prettier-ignore
import {
  View, StyleSheet, Text, Modal,
} from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';
import Header from '../components/Header';
import ResetPassword from '../components/ResetPassword';
import { requestResetPassword, verifyResetCode } from '../other/api';
import { theme } from '../other/constants';
import userInfo from '../services/userInfo';
import { Alignments, Sizes, Typography } from '../styles';

interface IProps {
  // eslint-disable-next-line react/require-default-props
  navigation?: any;
}

const PasswordRecovery = (props: IProps) => {
  const [recoveryCode, setRecoveryCode] = useState('');
  const [modalVisibility, setModalVisibility] = useState(false);
  const [errorVisiblity, setErrorVisibility] = useState(false);
  const [resendMessageVisibility, setResendMessageVisiblity] = useState(false);

  const { navigation } = props;

  const onResendButtonPress = async () => {
    const response = await requestResetPassword(userInfo.email);
    if (response.error) {
      return;
    }
    setResendMessageVisiblity(true);
  };

  const onConfirmButtonPress = async () => {
    if (!recoveryCode) {
      return;
    }
    setErrorVisibility(false);
    const response = await verifyResetCode(userInfo.email, recoveryCode);
    if (response.error) {
      setErrorVisibility(true);
      return;
    }
    userInfo.recoveryCode = recoveryCode;
    setModalVisibility(true);
  };

  const onPasswordReset = () => navigation.navigate('Login');

  const closeModal = () => setModalVisibility(false);

  return (
    <View style={styles.flexContainer}>
      <View style={styles.flexContainer}>
        <Card style={styles.card}>
          <Card.Title title={userInfo.email} />
        </Card>
        <Button mode="text" onPress={onResendButtonPress}>
          <Text style={styles.sendCodeText}>Resend code</Text>
        </Button>
        {resendMessageVisibility && (
          <Text style={styles.successText}>Recovery code has been sent to your email</Text>
        )}
      </View>
      <View style={styles.containter}>
        <TextInput
          style={styles.codeInput}
          mode="flat"
          label="Recovery code"
          value={recoveryCode}
          onChangeText={setRecoveryCode}
        />
        {errorVisiblity && (
          <Text style={styles.errorText}>You have entered wrong recovery code</Text>
        )}
      </View>
      <Button
        mode="contained"
        style={styles.loginButton}
        color={theme.colors.primary}
        onPress={onConfirmButtonPress}
      >
        <Text style={styles.loginButtonText}>Submit</Text>
      </Button>
      <Modal visible={modalVisibility}>
        <Header title="Password recovering" onGoBack={closeModal} />
        <ResetPassword onPasswordReset={onPasswordReset} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: theme.colors.backgroundPrimary,
    paddingTop: Sizes.smallest,
    paddingBottom: Sizes.smallest,
    borderRadius: Sizes.small,
    margin: Sizes.small,
  },
  successText: Typography.successText,
  errorText: {
    ...Typography.errorText,
    marginTop: Sizes.smaller,
  },
  emailText: Typography.smallInfoLabel,
  containter: {
    ...Alignments.centerHorizontal,
    marginBottom: Sizes.extraLarge,
  },
  codeInput: {
    width: '70%',
    backgroundColor: theme.colors.background,
  },
  sendCodeText: {
    ...Typography.buttonText,
    fontSize: Sizes.base,
    color: theme.colors.primary,
  },
  loginButtonText: {
    ...Typography.buttonText,
    color: 'white',
  },
  loginButton: {
    margin: Sizes.small,
  },
});

export default PasswordRecovery;
