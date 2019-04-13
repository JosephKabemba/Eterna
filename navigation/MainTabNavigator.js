import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';


import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyProfileScreen from '../screens/MyProfile'
import BirthdayScreen from '../screens/BirthdayScreen';


const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Profile: ProfileScreen 
  },
  {
    initialRouteName: "Home"
  }
)

HomeStack.navigationOptions = {
  tabBarLabel: 'Contacts',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-contacts'
          : 'md-contacts'
      }
    />
  ),
};

const ProfileStack = createStackNavigator({
  Profile: MyProfileScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'My Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
};

const BirthdayStack = createStackNavigator({
  Settings: BirthdayScreen,
});

BirthdayStack.navigationOptions = {
  tabBarLabel: 'Birthdays',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  ProfileStack,
  BirthdayStack,
});
