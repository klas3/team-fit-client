// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
// prettier-ignore
import {
  RefreshControl, Text, StyleSheet, View, Image, Modal,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import ScreenError from '../components/ScreenError';
import { getUserInfo, logout } from '../other/api';
import { theme } from '../other/constants';
import { User } from '../other/entities';
import ChangePassword from '../components/ChangePassword';
import { Alignments, Images, Spacing, Typography } from '../styles';

interface IProps {
  // eslint-disable-next-line react/require-default-props
  navigation?: any;
}

const Profile = (props: IProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User>();
  const [isErrorOccured, setIsErrorOccured] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { navigation } = props;

  const fetchUserData = async () => {
    setIsErrorOccured(false);
    const userInfo = await getUserInfo();
    setIsLoading(false);
    if (!userInfo) {
      setIsErrorOccured(true);
      return;
    }
    setUserData(userInfo);
  };

  const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Account');
  };

  useEffect(() => {
    (async () => {
      await fetchUserData();
    })();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isErrorOccured || !userData) {
    return <ScreenError onRefresh={fetchUserData} />;
  }
  return (
    <SafeAreaView style={styles.flexContainer}>
      <ScrollView
        contentContainerStyle={styles.flexContainer}
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchUserData} />}
      >
        <View style={styles.container}>
          <Image style={styles.image} source={require('../../assets/user-profile.png')} />
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.info}>
              <Text style={styles.infoText}>{userData.login}</Text>
            </View>
            <Text style={styles.label}>Email</Text>
            <View style={styles.info}>
              <Text style={styles.infoText}>{userData.email}</Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Button style={styles.button} mode="contained" onPress={openModal}>
              <Text style={styles.buttonText}>Change password</Text>
            </Button>
            <Button style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Log out</Text>
            </Button>
          </View>
        </View>
        <Modal animationType="slide" visible={showModal}>
          <Header title="Changing password" onGoBack={closeModal} />
          <ChangePassword />
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  infoContainer: {
    width: '85%',
  },
  container: Alignments.centerHorizontal,
  label: Typography.largeInfoLable,
  infoText: Typography.infoText,
  buttonText: Typography.buttonText,
  image: Images.profileImage,
  info: {
    backgroundColor: theme.colors.backgroundPrimary,
    borderRadius: Spacing.small,
    marginBottom: Spacing.small,
    padding: Spacing.large,
  },
  button: {
    margin: Spacing.small,
  },
});

export default Profile;
