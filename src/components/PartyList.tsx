// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Modal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { leaveParty } from '../other/api';
import { theme } from '../other/constants';
import { Party } from '../other/entities';
import partyConnection from '../other/partyConnection';
import ConfirmationDialog from './ConfirmationDialog';
import Header from './Header';
import PartyMember from './PartyMember';

interface IProps {
  party: Party;
  visibility: boolean;
  onDismiss: () => void;
}

const PartyList = (props: IProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dialogVisibility, setDialogVisibility] = useState(false);

  const hideDialog = () => setDialogVisibility(false);

  const showDialog = () => setDialogVisibility(true);

  const confirmLeave = async () => {
    await leaveParty(partyConnection.party.id);
    setDialogVisibility(false);
  };

  // prettier-ignore
  const {
    party, visibility, onDismiss,
  } = props;

  const onRefresh = async () => {
    setIsRefreshing(true);
    await partyConnection.loadParty();
    setIsRefreshing(false);
  };

  const renderedUsers = party.users.map((user) => <PartyMember key={user.id} member={user} />);

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

export default PartyList;
