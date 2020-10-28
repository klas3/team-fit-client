// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Button, Text, TextInput } from 'react-native-paper';
import LoadingSpinner from '../components/LoadingSpinner';
import { loginToAccount, updateAxiosClient } from '../other/api';
import { theme } from '../other/constants';
import { Alignments, Sizes, Typography } from '../styles';
import { appLogoImage } from '../other/images';
import userInfo from '../services/userInfo';
import partyConnection from '../services/partyConnection';

interface IProps {
  // eslint-disable-next-line react/require-default-props
  navigation?: any;
}

const Login = (props: IProps) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isErrorOccured, setIsErrorOccured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { navigation } = props;

  const navigateToRegister = () => navigation.navigate('Register');

  // prettier-ignore
  const navigateToMenu = () => navigation.navigate('Main', {}, NavigationActions.navigate({ routeName: 'Main' }));

  const loginUser = async () => {
    if (!login || !password) {
      return;
    }
    setIsLoading(true);
    const result = await loginToAccount(login, password);
    if (result.error) {
      setIsLoading(false);
      setIsErrorOccured(true);
      return;
    }
    await userInfo.realoadInfo();
    partyConnection.registerConnection();
    await partyConnection.loadParty();
    navigateToMenu();
    setLogin('');
    setPassword('');
    setIsErrorOccured(false);
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      await updateAxiosClient();
      await userInfo.realoadInfo();
      if (!userInfo.id) {
        setIsLoading(false);
        return;
      }
      partyConnection.registerConnection();
      await partyConnection.loadParty();
      navigateToMenu();
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <View style={styles.containter}>
      <View style={styles.form}>
        <Image source={appLogoImage} />
        <TextInput mode="outlined" label="Login" value={login} onChangeText={setLogin} />
        <TextInput mode="outlined" label="Password" value={password} onChangeText={setPassword} />
        <Text style={styles.errorText}>
          {isErrorOccured && "The credentials you've provided was incorrect"}
        </Text>
        <Button
          mode="contained"
          style={styles.loginButton}
          color={theme.colors.primary}
          onPress={loginUser}
        >
          <Text style={styles.loginButtonText}>Log in</Text>
        </Button>
        <Button mode="outlined" style={styles.registerButton} onPress={navigateToRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containter: Alignments.centerHorizontal,
  form: Alignments.centerVerticallyNarrowly,
  loginButtonText: { ...Typography.buttonText, color: 'white' },
  registerButtonText: {
    ...Typography.buttonText,
    color: theme.colors.primary,
  },
  registerButton: {
    borderColor: theme.colors.primary,
    borderWidth: Sizes.hairline,
    margin: Sizes.small,
  },
  errorText: Typography.errorText,
  loginButton: {
    margin: Sizes.small,
  },
});

export default Login;
