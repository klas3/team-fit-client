// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { theme } from '../other/constants';

const styles = StyleSheet.create({
  main: {
    backgroundColor: theme.colors.primary,
  },
});

interface IProps {
  onGoBack(): void;
  title: string;
}

const Header = (props: IProps) => {
  const { onGoBack, title } = props;

  return (
    <Appbar.Header style={styles.main} statusBarHeight={0}>
      <Appbar.BackAction onPress={onGoBack} />
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default Header;
