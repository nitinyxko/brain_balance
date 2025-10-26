import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import VerificationScreen from '../screens/onboarding/VerificationScreen';
import LoginScreen from '../screens/onboarding/LoginScreen';
import RegisterScreen from '../screens/onboarding/RegisterScreen';

// Import screens (to be created)
import HomeScreen from '../screens/HomeScreen';
import CommunitiesScreen from '../screens/CommunitiesScreen';
import SpacesScreen from '../screens/SpacesScreen';
import BrainGymScreen from '../screens/BrainGymScreen';
import JournalScreen from '../screens/JournalScreen';

// Move all screen files to their correct locations
import { Platform } from 'react-native';
if (Platform.OS === 'web') {
  console.warn('Please ensure all screen components are in their correct locations');
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Communities':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Spaces':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Brain Gym':
              iconName = focused ? 'fitness' : 'fitness-outline';
              break;
            case 'Journal':
              iconName = focused ? 'journal' : 'journal-outline';
              break;
            default:
              iconName = 'alert';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Communities" component={CommunitiesScreen} />
      <Tab.Screen name="Spaces" component={SpacesScreen} />
      <Tab.Screen name="Brain Gym" component={BrainGymScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
    </Tab.Navigator>
  );
};

import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

const AppStack = createNativeStackNavigator();

import LoadingScreen from '../components/LoadingScreen';

const AppNavigator = () => {
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          // Onboarding Flow
          <AppStack.Group>
            <AppStack.Screen name="Onboarding" component={OnboardingScreen} />
            <AppStack.Screen name="Verification" component={VerificationScreen} />
            <AppStack.Screen name="Login" component={LoginScreen} />
            <AppStack.Screen name="Register" component={RegisterScreen} />
          </AppStack.Group>
        ) : !isAuthenticated ? (
          // Auth Flow
          <AppStack.Group>
            <AppStack.Screen name="Login" component={LoginScreen} />
            <AppStack.Screen name="Register" component={RegisterScreen} />
          </AppStack.Group>
        ) : (
          // Main App Flow
          <AppStack.Screen name="MainApp" component={MainTabs} />
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;