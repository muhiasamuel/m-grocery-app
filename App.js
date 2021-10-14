import React, { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { LogBox,  StatusBar, Platform } from 'react-native';
import { AuthenticatedUserProvider } from './AuthProvider/AuthProvider';
import RootNavigator from './AppStack/AppStack';
import "firebase/firestore";


const App = () => { 
     const [expoPushToken, setExpoPushToken] = useState('');

     useEffect(() => {
          registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        }, []);
     const registerForPushNotificationsAsync = async() => {
          let token;
          if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
              const { status } = await Notifications.requestPermissionsAsync();
              finalStatus = status;
            }
            if (finalStatus !== 'granted') {
              alert('Failed to get push token for push notification!');
              return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
          } else {
            alert('Must use physical device for Push Notifications');
          }
        
          if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
              name: 'default',
              importance: Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: '#FF231F7C',
            });
          }
        
          return token;
        } 
          LogBox.ignoreLogs(['Setting a timer']);
     return ( 
      <AuthenticatedUserProvider>
           <StatusBar style = 'dark' />
           <RootNavigator/>
      </AuthenticatedUserProvider>
  )

}

export default App
