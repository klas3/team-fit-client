// eslint-disable-next-line
import React, { useState } from 'react';
import { FAB } from 'react-native-paper';
import { theme } from '../other/constants';

interface IProps {
  onDeleteButtonPress: () => void;
  // eslint-disable-next-line no-unused-vars
  setOtherFabsVisibility: (visibility: boolean) => void;
  onPartyButtonPress: () => void;
  onDistanceButtonPress: () => void;
  isDistanceDisplaying: boolean;
}

const MapFab = (props: IProps) => {
  const [open, setOpen] = useState(false);

  const {
    onDeleteButtonPress,
    setOtherFabsVisibility,
    onPartyButtonPress,
    onDistanceButtonPress,
    isDistanceDisplaying,
  } = props;

  const onStateChange = (state: { open: boolean }) => setOpen(state.open);

  const onFabPress = () => {
    if (open) {
      setOtherFabsVisibility(true);
      return;
    }
    setOtherFabsVisibility(false);
  };

  const actions = [
    {
      icon: 'account-multiple',
      label: 'Party',
      onPress: () => onPartyButtonPress(),
    },
    {
      icon: 'delete',
      label: 'Drop route',
      onPress: () => onDeleteButtonPress(),
    },
    {
      icon: 'run-fast',
      label: isDistanceDisplaying ? 'Save score' : 'Start counting distance',
      onPress: () => onDistanceButtonPress(),
    },
  ];

  return (
    <FAB.Group
      onPress={onFabPress}
      color="white"
      theme={theme}
      visible
      open={open}
      icon="map"
      actions={actions}
      onStateChange={onStateChange}
    />
  );
};

export default MapFab;
