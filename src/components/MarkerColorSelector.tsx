// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
// prettier-ignore
import {
  Button, Dialog, Portal, RadioButton,
} from 'react-native-paper';
import { MarkerColors } from '../other/entities';
import userInfo from '../services/userInfo';
import { parsingRadix } from '../other/constants';

interface IProps {
  visible: boolean;
  onDismiss: () => void;
  // eslint-disable-next-line no-unused-vars
  onConfirm: (markerColor: MarkerColors) => void;
}

const MarkerColorSelector = (props: IProps) => {
  const [markerColor, setMarkerColor] = useState(userInfo.markerColor.toString());

  const { visible, onConfirm, onDismiss } = props;

  const onConfirmbuttonPress = () => {
    const markerColorNumber = Number.parseInt(markerColor, parsingRadix);
    if (Number.isNaN(markerColorNumber)) {
      return;
    }
    onConfirm(markerColorNumber);
  };

  const onValueChange = (value: string) => setMarkerColor(value);

  const getOptions = () => {
    const colors = Object.keys(MarkerColors);
    colors.splice(0, colors.length / 2);
    const options = colors.map((color, index) => (
      <RadioButton.Item label={color} key={color} value={index.toString()} />
    ));
    return options;
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Map marker color</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group onValueChange={onValueChange} value={markerColor}>
            {getOptions()}
          </RadioButton.Group>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={onConfirmbuttonPress}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default MarkerColorSelector;
