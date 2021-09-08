import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { LogBox, StatusBar, StyleSheet, Text, View } from 'react-native'
import { AuthenticatedUserProvider } from './AuthProvider/AuthProvider';
import RootNavigator from './AppStack/AppStack';


const Stack = createStackNavigator();
const App = () => {

LogBox.ignoreLogs(['Setting a timer']);
  return ( 
      <AuthenticatedUserProvider>
           <StatusBar style = 'auto'/>
           <RootNavigator/>
       
      </AuthenticatedUserProvider>
  )

}

export default App

const styles = StyleSheet.create({})
