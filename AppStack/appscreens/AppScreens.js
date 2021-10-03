import React, { useContext } from 'react'
import AdminScreens from './Adminscreens';
import "firebase/firestore";
import { AuthenticatedUserContext } from '../../AuthProvider/AuthProvider';
import ScreensContainer from './screensContainer';
import Firebase from '../../firebaseConfig';
import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../constants/Index';

const Appscreens = () => {
    const {AuthUserRole, setAuthUserRole, user} = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] =React.useState(true);
  
    React.useEffect(() =>{
      getAuthUserRole();
    }, [])
  
    const getAuthUserRole =async()=>{
      try{
        await Firebase.firestore()
        .collection('users')
        .where('uid', '==', user.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) =>{
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
