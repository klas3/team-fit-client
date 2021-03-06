// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Avatar, Card } from 'react-native-paper';
import { Text, StyleSheet } from 'react-native';
import { Score as IScore } from '../other/entities';
import { Sizes, Typography } from '../styles';
import { getTimeFromDate } from '../other/library';

interface IProps {
  score: IScore;
}

const Score = ({ score }: IProps) => {
  const { mileage, date } = score;

  const getLeftCardSide = (cardProps: { size: number }) => (
    <Avatar.Icon size={cardProps.size} icon="run" />
  );

  const getRightCardSide = () => <Text style={styles.time}>{getTimeFromDate(date)}</Text>;

  return (
    <Card style={styles.card}>
      <Card.Title title={`${mileage} km`} left={getLeftCardSide} right={getRightCardSide} />
    </Card>
  );
};

const styles = StyleSheet.create({
  time: {
    ...Typography.smallInfoLabel,
    marginRight: Sizes.smaller,
  },
  card: {
    margin: Sizes.tiny,
  },
});

export default Score;
