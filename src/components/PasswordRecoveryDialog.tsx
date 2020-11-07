// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
// prettier-ignore
import {
  Button, Dialog, Portal, TextInput, Text,
} from 'react-native-paper';
import { requestResetPassword } from '../other/api';
import userInfo from '../services/userInfo';
import { Sizes, Typography } from '../styles';

interface IProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

const PasswordRecoveryDialog = (props: IProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const { visible, onDismiss, onConfirm } = props;

  const onConfirmbuttonPress = async () => {
    if (!email) {
      return;
    }
    const response = await requestResetPassword(email);
    if (response.error) {
      setError(response.error);
      return;
    }
    userInfo.email = email;
    setEmail('');
    setError('');
    onConfirm();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Password recovery</Dialog.Title>
        <Dialog.Content>
          <TextInput
            style={styles.input}
            mode="flat"
            label="Email"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.errorText}>{error}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={onConfirmbuttonPress}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  errorText: {
    ...Typography.errorText,
    marginTop: Sizes.smallest,
  },
  input: {
    backgroundColor: 'white',
  },
});

export default PasswordRecoveryDialog;
