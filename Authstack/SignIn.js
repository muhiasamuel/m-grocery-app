import React, { FC, ReactElement, useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View,TouchableOpacity, Text, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, ImageBackground, Image } from "react-native";
import "firebase/auth";
import { COLORS, FONTS, images, SIZES } from "../constants/Index";
import { EvilIcons, Feather, FontAwesome5, Fontisto } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable'
import { color } from "react-native-reanimated";
import Firebase from "../firebaseConfig";
import { ScrollView } from "react-native-gesture-handler";
import { render } from "react-dom";

export const SignInScreen = ({navigation}) => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ secureTextEntry, setsecureTextEntry] = useState(true);

  const updateSecureTextEntry = () =>{
    setsecureTextEntry(!secureTextEntry);
}
  const auth = Firebase.auth();

  const SigninUser = async function () {

    const passwordValue = password;
    const EmailValue = userEmail;

    setIsSubmitting(true)
    try {
      if (EmailValue !== '' && passwordValue !== '') {
        await auth.signInWithEmailAndPassword(EmailValue, passwordValue)
        .then(async(user) => {
          Alert.alert('login successiful')
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
      }, 5000);
    return false;
    }
   
  };
  function renderbody() {
    return(
      <Animatable.View      
      animation="fadeInUpBig"
      duration={1900}
      style= {styles.bodyMainView}>         
    
    <View>
       <TextInput
           style={styles.input}
           value={userEmail}
           placeholderTextColor="#fff"
           placeholder={"Email or Username"}
           onChangeText={(text) => setUserEmail(text)}
           autoCapitalize={"none"}
       /> 
    </View>
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
       onPress={() => SigninUser()}>
           {isSubmitting == true ?
           <ActivityIndicator color={COLORS.white} size='large'/> 
           :  
           <Text style={styles.btntext}>Sign In</Text>   
       }
       
    </TouchableOpacity>
    <View style={styles.linkView}>
      <TouchableOpacity
      onPress = {() => navigation.navigate('passwordreset')}
      >
        <Text style={styles.links }>Forgot Password</Text>
      </TouchableOpacity>
       <TouchableOpacity
         onPress = {() => navigation.navigate('register')}
       >
         <View style={styles.linkView}>
           <Text style={[styles.signuplink,{paddingHorizontal:5}]}>Sign Up Here</Text>           
           <EvilIcons name="arrow-right" size={34} color={COLORS.darkgrey2} />
         </View>   
       </TouchableOpacity>
    </View>
    
       <View style={styles.altView}>
         <Text style={styles.leftBorder}></Text>
         <Text style={styles.textor}>OR</Text>
         <Text style={styles.rightBorder}>.</Text>
       </View>
       <Text style={{alignSelf:"center", ...FONTS.h2, color:COLORS.white}}>SIGN IN WITH</Text>
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
     style={styles.container}>
        <ImageBackground 
           source={images.food11}
           resizeMode= 'cover'
            style={styles.image}>
   
   
      <View style={styles.TitleView}>
          <Text style={{color:COLORS.white,...FONTS.h1,  borderBottomWidth:2,
           borderBottomColor:COLORS.white,width:SIZES.width*0.4}}>SIGN IN</Text>
      </View>
     <ScrollView>
       {renderbody()}
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
      alignItems:"center",
      padding:SIZES.padding2*2,
      marginBottom:0,
     
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
    borderColor:COLORS.darkgrey2,
    borderWidth:0.2,
    paddingHorizontal:SIZES.padding2*1.5,
    paddingVertical:10,
    borderRadius:5,
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
    marginTop:40
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
  linkView: {
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems: "center",
    marginVertical:SIZES.padding*1.5,

  },
  links: {
    ...FONTS.h4,
    fontWeight:"bold",
    color: 'rgb(63,159,255)'
  }, 
  signuplink: {
    color:COLORS.white,
    fontWeight:"bold",
    fontSize:18,
  }

});