// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
// prettier-ignore
import {
  RefreshControl, View, StyleSheet, Text,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton, Searchbar } from 'react-native-paper';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import LoadingSpinner from '../components/LoadingSpinner';
import { Score as IScore } from '../other/entities';
import { getScores } from '../other/api';
import ScreenError from '../components/ScreenError';
import Score from '../components/Score';
import { Spacing, Typography } from '../styles';
import { formatDate } from '../other/library';

const Scores = () => {
  const [scores, setScores] = useState<IScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isErrorOccured, setIsErrorOccured] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [searchDate, setSearchDate] = useState<Date>();

  const loadScores = async () => {
    setIsErrorOccured(false);
    let loadedScores = await getScores();
    setIsLoading(false);
    if (!loadedScores) {
      setIsErrorOccured(true);
      return;
    }
    loadedScores = loadedScores.map((score) => {
      const validDateScore = { ...score };
      validDateScore.date = new Date(score.date);
      return validDateScore;
    });
    loadedScores = loadedScores.sort(
      (next, previous) => previous.date.getTime() - next.date.getTime(),
    );
    setSearchDate(undefined);
    setScores(loadedScores);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadScores();
    setIsRefreshing(false);
  };

  const onDateTimePickerSelect = (event: Event, selectedDate: Date | undefined) => {
    if (!selectedDate) {
      return;
    }
    if (event.type === 'set') {
      selectedDate.setHours(0, 0, 0, 0);
      setShowDateTimePicker(false);
      setSearchDate(selectedDate);
    }
  };

  const getClearIcon = ({ size, color }: { size: number; color: string }) => (
    <IconButton icon="close" size={size} color={color} onPress={onClearIconPress} />
  );

  const onFocus = () => setShowDateTimePicker(true);

  const onBlur = () => setShowDateTimePicker(false);

  const onClearIconPress = () => setSearchDate(undefined);

  useEffect(() => {
    (async () => loadScores())();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isErrorOccured) {
    return <ScreenError onRefresh={loadScores} />;
  }

  const renderScores = scores.map((score, index) => {
    const currentDateWithoutTime = new Date(score.date);
    currentDateWithoutTime.setHours(0, 0, 0, 0);
    const previousDateWithoutTime = new Date(scores[!index ? index : index - 1].date);
    previousDateWithoutTime.setHours(0, 0, 0, 0);
    return (
      <View key={score.id}>
        {(!searchDate || searchDate.getTime() === currentDateWithoutTime.getTime()) && (
          <View>
            {(!index || previousDateWithoutTime.getTime() !== currentDateWithoutTime.getTime()) && (
              <Text style={styles.dateText}>{formatDate(currentDateWithoutTime)}</Text>
            )}
            <Score score={score} />
          </View>
        )}
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.flexContainer}>
      <Searchbar
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search by date"
        clearIcon={getClearIcon}
        value={searchDate ? formatDate(searchDate) : ''}
      />
      {showDateTimePicker && (
        <DateTimePicker value={new Date()} mode="date" onChange={onDateTimePickerSelect} />
      )}
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {renderScores}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  dateText: {
    ...Typography.smallInfoLabel,
    marginTop: Spacing.small,
  },
});

export default Scores;
