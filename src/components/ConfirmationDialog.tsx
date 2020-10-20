// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Button, Dialog, Paragraph } from 'react-native-paper';

interface IProps {
  visibility: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

const ConfirmationDialog = (props: IProps) => {
  // prettier-ignore
  const {
    visibility, onConfirm, onDismiss, title, content,
  } = props;

  return (
    <Dialog visible={visibility} onDismiss={onDismiss}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Paragraph>{content}</Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancel</Button>
        <Button onPress={onConfirm}>Yes</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default ConfirmationDialog;
