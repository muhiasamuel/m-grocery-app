import React, { useContext, useState, useEffect, } from 'react'
import AdminScreens from './Adminscreens';
import "firebase/firestore";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { AuthenticatedUserContext } from '../../AuthProvider/AuthProvider';
import ScreensContainer from './screensContainer';
import Firebase from '../../firebaseConfig';
import { ActivityIndicator, Platform , View } from 'react-native';
import { COLORS, SIZES } from '../../constants/Index';

const Appscreens = () => {
    const {AuthUserRole, setAuthUserRole, user} = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] =useState(true);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [docId, setdocId] = useState('');
  
    useEffect(() =>{
      getAuthUserRole();
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
      (async () => {
        try{
         const doc = Firebase.firestore().collection('users')
         await doc.doc(docId).update({
           ExpoToken:expoPushToken
         })
        }catch(e){
          console.log(e);
        }
      })();
    }, [])
console.log(docId);
    const getAuthUserRole =async()=>{
      try{
        await Firebase.firestore()
        .collection('users')
        .where('uid', '==', user.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) =>{
            setdocId(doc.id)
              setAuthUserRole(doc.data()) 
              console.log(doc.data());
              setIsLoading(false)          
          })
        })
      }
      catch(e){
        console.log(e);
      }       
    }
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
    console.log(user.uid); 
    if (isLoading) {
    return(
      <View style={{flex: 1,width:SIZES.width, alignSelf:'center', justifyContent:'center',backgroundColor:COLORS.darkblue}}>
        <ActivityIndicator color={COLORS.white} size='large'/>
      </View>
    )   }
    return (
        <>
        {AuthUserRole?.role !== `Admin`?  <ScreensContainer/>: <AdminScreens/> }
           
        </>
    )
}

export default Appscreens
