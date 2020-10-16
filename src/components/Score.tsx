// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Avatar, Card } from 'react-native-paper';
import { Text, StyleSheet } from 'react-native';
import { Score as IScore } from '../other/entities';
import { Spacing, Typography } from '../styles';

interface IProps {
  score: IScore;
}

const Score = (props: IProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { mileage, date } = props.score;

  const getTimeFromDate = (timeDate: Date) => {
    const hours = timeDate.getHours();
    const minutes = timeDate.getMinutes();
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
  };

  return (
    <Card.Title
      title={`${mileage} km`}
      left={({ size }) => <Avatar.Icon size={size} icon="run" />}
      right={() => <Text style={styles.time}>{getTimeFromDate(date)}</Text>}
    />
  );
};

const styles = StyleSheet.create({
  time: {
    ...Typography.smallInfoLabel,
    marginRight: Spacing.smaller,
  },
});

export default Score;
