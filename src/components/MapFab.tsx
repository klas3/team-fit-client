// eslint-disable-next-line
import React, { useState } from 'react';
import { FAB } from 'react-native-paper';
import { theme } from '../other/constants';

interface IProps {
  onDeleteButtonPress(): void;
  // eslint-disable-next-line no-unused-vars
  setOtherFabsVisibility(visibility: boolean): void;
  onPartyButtonnPress(): void;
}

const MapFab = (props: IProps) => {
  const [open, setOpen] = useState(false);

  const { onDeleteButtonPress, setOtherFabsVisibility, onPartyButtonnPress } = props;

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
      icon: 'delete',
      label: 'Drop route',
      onPress: () => onDeleteButtonPress(),
    },
    {
      icon: 'account-multiple',
      label: 'Party',
      onPress: () => onPartyButtonnPress(),
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
