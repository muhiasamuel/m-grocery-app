import React, { useContext } from 'react'
import AdminScreens from './Adminscreens';
import "firebase/firestore";
import { AuthenticatedUserContext } from '../../AuthProvider/AuthProvider';
import ScreensContainer from './screensContainer';
import Firebase from '../../firebaseConfig';
import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS } from '../../constants/Index';

const Appscreens = () => {
    const {AuthUserRole, setAuthUserRole} = useContext(AuthenticatedUserContext);
    const { user, } = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] =React.useState(true);
  
    console.log(user.email);
    
    React.useEffect(() =>{
      getAuthUserRole();
    }, [])
  
    const getAuthUserRole = async () => {
      try{
        await Firebase.firestore()
        .collection('users')
        .where('uid', '==', user.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) =>{
           console.log(doc.data());
           setAuthUserRole(doc.data())
           setIsLoading(false);
          })
        })
      }
      catch(e){
        console.log(e);
      }
    }
    if (isLoading) {
      return (
        <View style={{ backgroundColor:COLORS.darkblue, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={COLORS.white} size='large'/>
          <Text style={{color:COLORS.white}}>Loading Please Wait...</Text>
        </View>
      );
    }
    return (
        <>
        {AuthUserRole?.role == "Admin" ? <AdminScreens/> :  <ScreensContainer/>}
           
        </>
    )
}

export default Appscreens
