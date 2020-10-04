// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Text, StyleSheet, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  text: {
    color: 'grey',
    fontSize: 20,
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
});

interface IProps {
  onRefresh(): void;
}

const ScreenError = (props: IProps) => {
  const { onRefresh } = props;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.textContainer}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
      >
        <Text style={styles.text}>Failed to load data, please try again later</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScreenError;
