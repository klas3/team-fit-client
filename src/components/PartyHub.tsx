// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Modal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { leaveParty } from '../other/api';
import { applicationEvents, theme } from '../other/constants';
import { Party } from '../other/entities';
import partyConnection from '../services/partyConnection';
import ConfirmationDialog from './ConfirmationDialog';
import Header from './Header';
import PartyMember from './PartyMember';

interface IProps {
  visibility: boolean;
  onDismiss: () => void;
}

const PartyHub = (props: IProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dialogVisibility, setDialogVisibility] = useState(false);
  const [users, setUsers] = useState(partyConnection.party.users);

  const hideDialog = () => setDialogVisibility(false);

  const showDialog = () => setDialogVisibility(true);

  const confirmLeave = async () => {
    setDialogVisibility(false);
    await leaveParty(partyConnection.party.id);
    await partyConnection.loadParty();
  };

  const { visibility, onDismiss } = props;

  const onRefresh = async () => {
    setIsRefreshing(true);
    await partyConnection.loadParty();
    setIsRefreshing(false);
  };

  const renderedUsers = users.map((user) => <PartyMember key={user.id} member={user} />);

  useEffect(() => {
    applicationEvents.addListener('partyChanged', (newParty: Party) => {
      setUsers([...newParty.users]);
    });
  }, []);

  return (
    <Modal contentContainerStyle={styles.flexContainer} visible={visibility} onDismiss={onDismiss}>
      <SafeAreaView style={styles.flexContainer}>
        <Header
          onGoBack={onDismiss}
          title="Party"
          showActionButton
          actionButtonIcon="exit-to-app"
          onActionButtonPress={showDialog}
        />
        <ScrollView
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        >
          {renderedUsers}
        </ScrollView>
        <ConfirmationDialog
          visibility={dialogVisibility}
          title="Leave confirmation"
          content="Are you sure you want to leave this party?"
          onDismiss={hideDialog}
          onConfirm={confirmLeave}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default PartyHub;
