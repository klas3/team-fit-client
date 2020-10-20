// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Avatar, Card } from 'react-native-paper';
import { Image, StyleSheet } from 'react-native';
import { User } from '../other/entities';
import { getMarkerColorLiteral } from '../other/library';
import { Images, Spacing } from '../styles';
import { userMarkers } from '../other/images';

interface IProps {
  member: User;
}

const PartyMember = (props: IProps) => {
  const { member } = props;

  const userColor = getMarkerColorLiteral(member.markerColor);
  const userTheme = {
    colors: { primary: userColor },
  };

  const getLeftCardSide = (cardProps: { size: number }) => (
    <Avatar.Icon theme={userTheme} color="white" size={cardProps.size} icon="account" />
  );

  const getRightCardSide = () => <Image style={styles.marker} source={userMarkers[userColor]} />;

  return (
    <Card style={styles.card}>
      <Card.Title title={member.login} left={getLeftCardSide} right={getRightCardSide} />
    </Card>
  );
};

const styles = StyleSheet.create({
  marker: {
    marginRight: Spacing.smaller,
    ...Images.marker,
  },
  card: {
    margin: Spacing.tiny,
  },
});

export default PartyMember;
