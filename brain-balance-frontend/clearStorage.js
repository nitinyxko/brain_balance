import AsyncStorage from '@react-native-async-storage/async-storage';

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log('Storage successfully cleared!');
  } catch (e) {
    console.error('Error clearing AsyncStorage:', e);
  }
};

clearAll();