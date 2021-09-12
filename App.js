import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { LogBox,  StatusBar,  StyleSheet, Text, View } from 'react-native'
import { AuthenticatedUserProvider } from './AuthProvider/AuthProvider';
import RootNavigator from './AppStack/AppStack';
import DrawerNavigator from './AdminStack/navigation/drawerNavigator';
import AdminScreens from './AppStack/appscreens/Adminscreens';
import Ims from './AdminStack/screens/ims';


const Stack = createStackNavigator();
const App = () => {


LogBox.ignoreLogs(['Setting a timer']);
 return ( 
      <AuthenticatedUserProvider>
           <StatusBar style = 'dark' />
           <RootNavigator/>
      </AuthenticatedUserProvider>
  )

}

export default App
