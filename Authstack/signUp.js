import React, { FC, ReactElement, useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View,TouchableOpacity, Text, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, ImageBackground, Image } from "react-native";
import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/firestore";
import { COLORS, FONTS, images, SIZES } from "../constants/Index";
import { Feather, FontAwesome5, Fontisto, Ionicons } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable'
import { color } from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import Firebase from "../firebaseConfig";

export const SignUpScreen =  ({navigation})  => {
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [UserPhoneNo, setUserPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ secureTextEntry, setsecureTextEntry] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const updateSecureTextEntry = () =>{
    setsecureTextEntry(!secureTextEntry);
}

const Auth = Firebase.auth();

  const doUserRegistration = async function () {

     

    const usernameValue = username;
    const passwordValue = password;
    const Customerrole = "customer";
    const EmailValue = userEmail;
    const PhoneNoValue = Number(UserPhoneNo);

    setIsSubmitting(true)
    try {
      if (EmailValue !== '' && passwordValue !== '') {
        await Auth.createUserWithEmailAndPassword (EmailValue, passwordValue)
        .then(async(user) => {
          Firebase.firestore().collection('users').add({
            uid: user.user.uid,
            username:usernameValue,
            role: Customerrole,
            phonenumber:PhoneNoValue
          })
          setSuccessMsg('user created')
          setIsSubmitting(false)         
          return true;
        })
      }
    } catch (error) {
      setIsSubmitting(false)
      setErrorMessage(error.message || error.statusText)
    // signin can fail if any parameter is blank or failed an uniqueness check on the server
      setTimeout(() => {
        setErrorMessage(null)
      }, 3600);
    return false;
    }
  };
  function renderBody() {
    return(
      <Animatable.View      
      animation="fadeInUpBig"
      duration={1900}
       style= {styles.bodyMainView}>
           {successMsg !== '' ?
      <View style={styles.centredView}>
            <Text style={styles.sucesstxt}>{successMsg}</Text>                                                            
      </View>:
      <View></View>
      }  
     <View>   

        {/*<Text style={styles.label}>UserName:</Text>*/}
        <TextInput
            style={styles.input}
            value={username}
            placeholderTextColor="#fff"
            placeholder={"Username"}
            onChangeText={(text) => setUsername(text)}
            autoCapitalize={"none"}
        /> 
     </View>
     <View>
     {/*<Text style={styles.label}>Email Address:</Text>*/}
        <TextInput
            style={styles.input}
            value={userEmail}            
            keyboardType="email-address"
            placeholderTextColor="#fff"
            placeholder={"Email"}
            onChangeText={(text) => setUserEmail(text)}
            autoCapitalize={"none"}
        /> 
     </View>
     <View>
     {/*<Text style={styles.label}>PhoneNumber:</Text>*/}
        <TextInput
            style={styles.input}
            value={UserPhoneNo}
            keyboardType='phone-pad'
            keyboardAppearance='light'            
            placeholderTextColor="#fff"
            placeholder={"phone Number"}
            onChangeText={(text) => setUserPhoneNo(text)}
            autoCapitalize={"none"}
        /> 
     </View>
     {/*<Text style={styles.label}>Password:</Text>*/}
     <View style={styles.centredView}>
        <TextInput
            style={styles.input}
            value={password}
            placeholderTextColor="#fff"
            placeholder={"Password"}
            secureTextEntry={secureTextEntry? true: false}
            onChangeText={(text) => setPassword(text)}
        /> 
            <TouchableOpacity
                onPress={updateSecureTextEntry}
            >
                {secureTextEntry?
            <Feather
            style={styles.eyeIcon}
            name= "eye-off"
            color={COLORS.darkgrey4}
            size={24}/> :
            <Feather
            style={styles.eyeIcon}
            name= "eye"
            color={COLORS.darkgrey4}
            size={24}/> }
            
            </TouchableOpacity>

     </View>  
       <View>
            {errorMessage && (
            <Text style={{color:'red',fontWeight:'bold',justifyContent:'center',textAlign:'center'}}>{errorMessage}</Text>
            )}
       </View> 
     <TouchableOpacity style={styles.btn}
        onPress={() => doUserRegistration()}>
            {isSubmitting == true ?
            <ActivityIndicator color={COLORS.white} size='large'/> 
            :  
            <Text style={styles.btntext}>Sign Up</Text>   
        }
        
     </TouchableOpacity>
        <View style={styles.altView}>
          <Text style={styles.leftBorder}></Text>
          <Text style={styles.textor}>OR</Text>
          <Text style={styles.rightBorder}>.</Text>
        </View>
        <Text style={{alignSelf:"center", ...FONTS.h2, color:COLORS.white}}>SIGN UP WITH</Text>
        <View style={[styles.altView,{paddingHorizontal:SIZES.padding2*1.5}]}>
         <TouchableOpacity
           onPress={() =>Alert.alert("sign in With google")}
         >
             <Image style={styles.google} source={images.google} />
         </TouchableOpacity>
         <TouchableOpacity
         onPress={() =>Alert.alert("sign in With facobook")}
         >
            <Fontisto style={[styles.social,{paddingHorizontal:22}]} name="facebook" size={30} color={COLORS.white}/>
         </TouchableOpacity>
         <TouchableOpacity
           onPress={() =>Alert.alert("sign in With twitter")}
         >
            <Fontisto style={styles.social} name="twitter" size={30} color={COLORS.white}/>
         </TouchableOpacity>
       </View>
      </Animatable.View>
    )
  }

  return (
    <View
    behavior="padding"
     style={styles.container}>
        <ImageBackground 
           source={images.food11}
           resizeMode= 'cover'
            style={styles.image}>
              <View style={styles.TitleView}>
                <TouchableOpacity
                  onPress = {() => navigation.navigate('login')}
                >
                <Ionicons name="md-arrow-back-circle-outline" size={27} color="white" />
                </TouchableOpacity>
                
                  <Text style={{color:COLORS.white,fontSize:26,fontWeight:"bold",paddingHorizontal:SIZES.padding2*1.8}}>SIGN UP</Text>
              </View>
              <ScrollView>
                {renderBody()}
               
              </ScrollView>
 
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
      height:SIZES.height,
      backgroundColor:COLORS.darkblue,
      
    },
    image: {
      width:SIZES.width,
      height:SIZES.height,
    },
    TitleView: {
      flexDirection:"row",
      padding:SIZES.padding2*1.3,
      marginBottom:0,
     alignItems:"center",
      backgroundColor:'rgba(0,0,0 ,0.8)'
     
    },
    social: {
      backgroundColor:"rgb(28,161,255)",
      paddingHorizontal:SIZES.padding2,
      paddingVertical:SIZES.padding2*1.2,
      borderRadius: 50,
      borderWidth:1,
      borderColor:COLORS.white
    },
    google:{
      width:60,
      height:60,
      borderRadius:50
    },
    bodyMainView:{
      backgroundColor:'rgba(0,0,0,0.6)',
      padding:SIZES.padding2*2,
      height:SIZES.height*0.95,
      borderTopLeftRadius:5,
      borderTopRightRadius:5
    },
    label: {
      paddingLeft:10,
      color:COLORS.white,
      padding:2,
      fontSize:20,
      fontWeight:"bold"
    },
  input: {
    
    width:SIZES.width*0.84,
    borderColor:COLORS.darkgrey,
    borderWidth:0.5,
    paddingHorizontal:SIZES.padding2*1.5,
    paddingVertical:10,
    borderRadius:15,
    marginBottom: 12,
  
    color:COLORS.white,
    backgroundColor: COLORS.transparent,
  },
  centredView:{
      flexDirection:"row",
      alignItems:"center",
      justifyContent:'space-between'
  },
  eyeIcon: {
      right:12,
      alignSelf:"center",
      bottom:4,
  },
  btn: {
       alignSelf:"center",
       justifyContent:"center",
       padding:SIZES.padding*0.7,
       width:SIZES.width*0.5,
       backgroundColor:COLORS.primary,
       borderRadius:10, 
       borderColor:COLORS.white,
       borderWidth:1,
       marginTop:10

  },
  btntext: {
      padding:SIZES.padding*0.5,
      alignSelf:"center",
      color:COLORS.white,
      ...FONTS.h2
  },
  altView:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginTop:30
  },
  rightBorder: {
    width:SIZES.width*0.4,
    top:8,
    borderTopWidth:3,
    borderTopColor:COLORS.white,
  },
  textor: {
    color:COLORS.white,
    fontWeight:"bold",
    fontSize:20,
    padding:5,
    borderColor:COLORS.white,
    borderWidth:1,
    borderRadius:20
  },
  leftBorder: {
    width:SIZES.width*0.4,
    top:8,
    borderTopWidth:3,
    borderTopColor:COLORS.white,
  },
  sucesstxt: {
    color:COLORS.white ,fontWeight:'bold',justifyContent:'center',textAlign:'center',
    padding:3,
    backgroundColor:COLORS.green,
   }

});