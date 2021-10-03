import React from 'react';
import 'expo-firestore-offline-persistence'
import { LogBox,  StatusBar,  StyleSheet, Text, View } from 'react-native'
import { AuthenticatedUserProvider } from './AuthProvider/AuthProvider';
import RootNavigator from './AppStack/AppStack';
import "firebase/firestore";


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
