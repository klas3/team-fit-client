// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Button, Text, TextInput } from 'react-native-paper';
import LoadingSpinner from '../components/LoadingSpinner';
import { getUserInfo, loginToAccount, updateAxiosClient } from '../other/api';
import { theme } from '../other/constants';

const styles = StyleSheet.create({
  containter: { flex: 1, alignItems: 'center' },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '90%',
  },
  actionButton: {
    margin: 10,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    textTransform: 'none',
  },
  errorText: {
    color: theme.colors.primary,
    marginTop: 8,
    textAlign: 'center',
    fontSize: 17,
  },
  appLogo: {
    resizeMode: 'stretch',
    width: '100%',
    marginBottom: 20,
  },
});

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
    setIsLoading(false);
    if (!result) {
      setIsErrorOccured(true);
      return;
    }
    navigateToMenu();
    setLogin('');
    setPassword('');
    setIsErrorOccured(false);
  };

  useEffect(() => {
    (async () => {
      await updateAxiosClient();
      const userInfo = await getUserInfo();
      setIsLoading(false);
      if (!userInfo) {
        return;
      }
      navigateToMenu();
    })();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <View style={styles.containter}>
      <View style={styles.form}>
        <Image style={styles.appLogo} source={require('../../assets/app-logo.png')} />
        <TextInput mode="outlined" label="Login" value={login} onChangeText={setLogin} />
        <TextInput mode="outlined" label="Password" value={password} onChangeText={setPassword} />
        <Text style={styles.errorText}>
          {isErrorOccured && "The credentials you've provided was incorrect"}
        </Text>
        <Button
          mode="contained"
          style={styles.actionButton}
          color={theme.colors.primary}
          onPress={loginUser}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </Button>
        <Button
          mode="contained"
          style={styles.actionButton}
          color={theme.colors.blue}
          onPress={navigateToRegister}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Button>
      </View>
    </View>
  );
};

export default Login;