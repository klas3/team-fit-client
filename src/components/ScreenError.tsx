// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { Text, StyleSheet, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alignments, Typography } from '../styles';

interface IProps {
  onRefresh: () => Promise<void>;
}

const ScreenError = (props: IProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { onRefresh } = props;

  const refresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.textContainer}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
      >
        <Text style={styles.text}>Failed to load data, please try again later</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: Typography.infoText,
  textContainer: Alignments.center,
  container: {
    flex: 1,
  },
});

export default ScreenError;
