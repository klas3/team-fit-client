// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
// prettier-ignore
import {
  Text, StyleSheet, View, Image, Modal,
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import Header from '../components/Header';
import ScreenError from '../components/ScreenError';
import { logout } from '../other/api';
import { theme } from '../other/constants';
import { MarkerColors } from '../other/entities';
import ChangePassword from '../components/ChangePassword';
// prettier-ignore
import {
  Alignments, Images, Sizes, Typography,
} from '../styles';
import { appLogoImage, userMarkers } from '../other/images';
import MarkerColorSelector from '../components/MarkerColorSelector';
import userInfo from '../services/userInfo';
import { getMarkerColorLiteral } from '../other/library';

interface IProps {
  // eslint-disable-next-line react/require-default-props
  navigation?: any;
}

const Profile = (props: IProps) => {
  const [isErrorOccured, setIsErrorOccured] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectorVisibility, setSelectorVisibility] = useState(false);

  const { navigation } = props;

  const onSelectorConfirm = async (markerColor: MarkerColors) => {
    await userInfo.changeMarkerColor(markerColor);
    setSelectorVisibility(false);
  };

  const onSelectorDismiss = () => setSelectorVisibility(false);

  const showSelector = () => setSelectorVisibility(true);

  const fetchUserData = async () => {
    setIsErrorOccured(false);
    await userInfo.realoadInfo();
    if (!userInfo.email) {
      setIsErrorOccured(true);
    }
  };

  const openModal = () => setModalVisibility(true);

  const closeModal = () => setModalVisibility(false);

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Account');
  };

  const userMarkerIcon = userMarkers[getMarkerColorLiteral(userInfo.markerColor)];

  if (isErrorOccured || !userInfo.id) {
    return <ScreenError onRefresh={fetchUserData} />;
  }
  return (
    <SafeAreaView style={styles.flexContainer}>
      <ScrollView contentContainerStyle={styles.flexContainer}>
        <View style={styles.container}>
          <Image source={appLogoImage} />
          <View style={styles.infoContainer}>
            <Card style={styles.card}>
              <Card.Title
                title="Username"
                subtitleStyle={styles.subtitle}
                subtitle={userInfo.login}
              />
            </Card>
            <Card style={styles.card}>
              <Card.Title title="Email" subtitleStyle={styles.subtitle} subtitle={userInfo.email} />
            </Card>
            <Card style={styles.card}>
              <Card.Title
                title="Map marker color"
                subtitle="Change your map marker color to which you like more"
                subtitleNumberOfLines={2}
              />
              <Card.Actions style={styles.cardActions}>
                <Button onPress={showSelector}>Change</Button>
                <Image style={styles.mapMarker} source={userMarkerIcon} />
              </Card.Actions>
            </Card>
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
        <MarkerColorSelector
          visible={selectorVisibility}
          onDismiss={onSelectorDismiss}
          onConfirm={onSelectorConfirm}
        />
        <Modal animationType="slide" visible={modalVisibility}>
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
  },
  infoContainer: {
    width: '85%',
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingBottom: 0,
  },
  card: {
    backgroundColor: theme.colors.backgroundPrimary,
    paddingTop: Sizes.smallest,
    paddingBottom: Sizes.smallest,
    borderRadius: Sizes.small,
    marginBottom: Sizes.small,
  },
  mapMarker: {
    ...Images.marker,
    margin: Sizes.base,
  },
  container: {
    ...Alignments.centerHorizontal,
    ...Alignments.centerVertically,
    justifyContent: 'space-around',
  },
  infoText: Typography.infoText,
  buttonText: Typography.buttonText,
  button: {
    margin: Sizes.small,
  },
  subtitle: {
    fontSize: Sizes.base,
  },
});

export default Profile;
