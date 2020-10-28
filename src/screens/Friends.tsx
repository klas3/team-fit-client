// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { IconButton, Searchbar, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Friend from '../components/Friend';
import LoadingSpinner from '../components/LoadingSpinner';
import ScreenError from '../components/ScreenError';
import { createFriendship } from '../other/api';
import { Friendship } from '../other/entities';
import userInfo from '../services/userInfo';
import { Sizes, Typography } from '../styles';

const Friends = () => {
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isErrorOccured, setIsErrorOccured] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchLogin, setSearchLogin] = useState('');
  const [snackbarText, setSnackbarText] = useState('');
  const [snackbarVisibility, setSnackbarVisibility] = useState(false);
  const [dialogVisibility, setDialogVisibility] = useState(false);
  const [onDialogConfirm, setOnDialogConfirm] = useState<() => void>(() => {});

  const userId = userInfo.id;

  const hideDialog = () => setDialogVisibility(false);

  const confirmDelete = () => {
    onDialogConfirm();
    setDialogVisibility(false);
  };

  const beforeDelete = (deleteHandler: () => void) => {
    setOnDialogConfirm(() => deleteHandler);
    setDialogVisibility(true);
  };

  const showSnackbar = async (message: string) => {
    setSnackbarText(message);
    setSnackbarVisibility(true);
    await loadFriendships();
  };

  const onDismissSnackbar = () => setSnackbarVisibility(false);

  const loadFriendships = async () => {
    setIsErrorOccured(false);
    await userInfo.reloadFriendships();
    if (!userInfo.friendships) {
      setIsErrorOccured(true);
      return;
    }
    setFriendships(userInfo.friendships);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadFriendships();
    setSearchLogin('');
    setIsRefreshing(false);
  };

  const onIconPress = async () => {
    const response = await createFriendship(searchLogin);
    showSnackbar(response.error ?? 'Friendship request has been sent');
    setSearchLogin('');
  };

  const getSendIcon = (iconProps: { size: number; color: string }) => (
    <IconButton icon="send" size={iconProps.size} color={iconProps.color} onPress={onIconPress} />
  );

  useEffect(() => {
    (async () => loadFriendships())();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isErrorOccured) {
    return <ScreenError onRefresh={onRefresh} />;
  }

  const newRequests = friendships.filter(
    (friendship) => !friendship.isAccepted && friendship.receiver.id === userId,
  );
  const acceptedFriendships = friendships.filter((friendship) => friendship.isAccepted);
  const sentRequests = friendships.filter(
    (friendship) => !friendship.isAccepted && friendship.initiator.id === userId,
  );

  const renderedNewRequests = newRequests.map((newRequest) => {
    const { id, initiator } = newRequest;
    return (
      <Friend
        key={id}
        friend={initiator}
        friendshipId={id}
        beforeDelete={beforeDelete}
        onAction={showSnackbar}
      />
    );
  });
  const renderedAcceptedFriendships = acceptedFriendships.map((acceptedFriendship) => {
    const { id, initiator, receiver } = acceptedFriendship;
    return (
      <Friend
        key={id}
        friend={initiator.id === userId ? receiver : initiator}
        friendshipId={id}
        beforeDelete={beforeDelete}
        accepted
        onAction={showSnackbar}
      />
    );
  });
  const renderedSentRequests = sentRequests.map((sentRequest) => {
    const { id, receiver } = sentRequest;
    return (
      <Friend
        key={id}
        friend={receiver}
        friendshipId={id}
        beforeDelete={beforeDelete}
        initiator
        onAction={showSnackbar}
      />
    );
  });

  return (
    <SafeAreaView style={styles.flexContainer}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <Searchbar
          placeholder="Send friendship request to..."
          clearIcon={getSendIcon}
          onChangeText={setSearchLogin}
          value={searchLogin}
        />
        {!!renderedNewRequests.length && <Text style={styles.textLabel}>New requests</Text>}
        {renderedNewRequests}
        {!!renderedAcceptedFriendships.length && <Text style={styles.textLabel}>Friends</Text>}
        {renderedAcceptedFriendships}
        {!!renderedSentRequests.length && <Text style={styles.textLabel}>Sent requests</Text>}
        {renderedSentRequests}
      </ScrollView>
      <ConfirmationDialog
        visibility={dialogVisibility}
        title="Delete confirmation"
        content="Are you sure you want to delete this user from your friends list?"
        onDismiss={hideDialog}
        onConfirm={confirmDelete}
      />
      <Snackbar visible={snackbarVisibility} onDismiss={onDismissSnackbar}>
        {snackbarText}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  textLabel: {
    ...Typography.smallInfoLabel,
    marginTop: Sizes.small,
  },
});

export default Friends;
