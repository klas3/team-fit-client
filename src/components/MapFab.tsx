// eslint-disable-next-line
import * as React from 'react';
import { FAB } from 'react-native-paper';
import { theme } from '../other/constants';

interface IState {
  open: boolean;
}

interface IProps {
  dropMapRoute(): void;
  // eslint-disable-next-line no-unused-vars
  setOtherFabsVisibility(visibility: boolean): void;
}

const MapFab = (props: IProps) => {
  const [state, setState] = React.useState<IState>({ open: false });

  const onStateChange = ({ open }: IState) => setState({ open });

  const { dropMapRoute, setOtherFabsVisibility } = props;
  const { open } = state;

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
      onPress: () => dropMapRoute(),
    },
    {
      icon: 'account-multiple',
      label: 'Team',
      onPress: () => undefined,
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
