// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { User } from '../other/entities';
import { deleteFriendship, acceptFriendship } from '../other/api';
import { Sizes } from '../styles';
import { theme } from '../other/constants';
import partyConnection from '../services/partyConnection';
import userInfo from '../services/userInfo';
import { getMarkerColorLiteral } from '../other/library';

interface IProps {
  friend: User;
  friendshipId: string;
  // eslint-disable-next-line no-unused-vars
  beforeDelete: (deleteHandler: () => void) => void;
  // eslint-disable-next-line no-unused-vars
  onAction: (message: string) => void;
  // eslint-disable-next-line react/require-default-props
  accepted?: boolean;
  // eslint-disable-next-line react/require-default-props
  initiator?: boolean;
}

const Friend = (props: IProps) => {
  const {
    friend,
    friendshipId,
    onAction,
    beforeDelete,
    accepted = false,
    initiator = false,
  } = props;

  const friendColor = getMarkerColorLiteral(friend.markerColor);
  const friendTheme = {
    colors: { primary: friendColor },
  };

  const getLeftCardSide = (cardProps: { size: number }) => (
    <Avatar.Icon theme={friendTheme} color="white" size={cardProps.size} icon="account" />
  );

  const sendInvite = () => {
    partyConnection.sendInvite(friend.id, userInfo.login);
    onAction(`You've invited ${friend.login} to your party`);
  };

  const requestDelete = () => beforeDelete(handleDelete);

  const handleDelete = async () => {
    const response = await deleteFriendship(friendshipId);
    if (response.error) {
      return;
    }
    onAction('Friendship has been declined');
  };

  const handleAccept = async () => {
    const response = await acceptFriendship(friendshipId);
    if (response.error) {
      return;
    }
    onAction('Friendship has been accepted');
  };

  const getRightCardSide = () => {
    if (accepted) {
      return (
        <View style={styles.buttonsConatainer}>
          <IconButton icon="account-multiple-plus" color="green" onPress={sendInvite} />
          <IconButton icon="account-minus" color={theme.colors.primary} onPress={requestDelete} />
        </View>
      );
    }
    if (initiator) {
      return (
        <IconButton
          style={styles.buttonPrimary}
          icon="close"
          color={theme.colors.primary}
          onPress={handleDelete}
        />
      );
    }
    return (
      <View style={styles.buttonsConatainer}>
        <IconButton style={styles.buttonGreen} icon="check" color="green" onPress={handleAccept} />
        <IconButton
          style={styles.buttonPrimary}
          icon="close"
          color={theme.colors.primary}
          onPress={handleDelete}
        />
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Title title={friend.login} left={getLeftCardSide} right={getRightCardSide} />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: Sizes.tiny,
  },
  buttonsConatainer: {
    flexDirection: 'row',
    margin: Sizes.smallest,
  },
  buttonGreen: {
    borderWidth: 1,
    borderColor: 'green',
  },
  buttonPrimary: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
});

export default Friend;
