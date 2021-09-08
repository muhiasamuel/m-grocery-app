import React, { FC, ReactElement, useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View,TouchableOpacity, Text, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, ImageBackground } from "react-native";
import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/firestore";
import { COLORS, FONTS, images, SIZES } from "../constants/Index";
import { EvilIcons, Feather, FontAwesome5, Fontisto } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable'
import Firebase from "../firebaseConfig";

const passReset = ({navigation}) => {
    const[ email, setEmail] = React.useState(''); 
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [successMsg, setSuccessMsg] = React.useState("");



    const auth = Firebase.auth();
  
    const RequestPassReset = async function () {
          // Note that these values come from state variables that we've declared before
        const EmailValue = email;
    
        setIsSubmitting(true)
    
        try{ 
            // Since the passreq method returns a Promise, we need to call it using await
            await  auth.sendPasswordResetEmail(EmailValue)
            .then(() => {      
            setIsSubmitting(false)
            setSuccessMsg(`Please Check ${email} for your password reset link!`)

            setTimeout(() =>{
                setSuccessMsg('')
                navigation.navigate('login')
      
              }, 5000)
            return true;
        })
    
        }   
          catch(error){
            setIsSubmitting(false)
            setErrorMessage(error.message || error.statusText)
            // signUp can fail if any parameter is blank or failed an uniqueness check on the server
            setTimeout(() => {
                setErrorMessage(null)
              }, 7000);
            return false;
        };
    };
    
    return (
        <View
         style={styles.container}>
            <ImageBackground 
                source={images.food11}
                resizeMode= 'cover'
                style={styles.image}>
                         <View style={styles.TitleView}>
                            <TouchableOpacity
                                onPress = {() => navigation.navigate('login')}>
                                <Fontisto name="arrow-left" size={24} color={COLORS.white} />
                            </TouchableOpacity>                            
                            <Text style={{color:COLORS.white,fontSize:26,fontWeight:"bold",paddingHorizontal:SIZES.padding2*1.8}}>Reset Password</Text>
                        </View>
                      
                                              
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
                        <View style={{marginTop:40}}>                            
                            <Text style={styles.label}>UserEmail:</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                placeholderTextColor="#fff"
                                placeholder={"userEmail-Address"}
                                onChangeText={(text) => setEmail(text)}
                                autoCapitalize={"none"}
                            />
                        </View>
                        <View>
                            {errorMessage && (
                            <Text style={{color:'red',fontWeight:'bold',justifyContent:'center',textAlign:'center'}}>{errorMessage}</Text>
                            )}
                        </View> 
                        <TouchableOpacity style={styles.btn}
                            onPress={() => RequestPassReset()}>
                                {isSubmitting == true ?
                                <ActivityIndicator color={COLORS.white} size='large'/> 
                                :  
                                <Text style={styles.btntext}>Request Password Reset</Text>   
                            }
                            
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('login')}
                            style={{paddingVertical:30}}
                        >
                            <Text style={{ color: 'rgb(63,159,255)',fontSize:17,fontStyle:'italic', fontWeight:'bold',justifyContent:'center',textAlign:'center'}}>Go Back To Login</Text>
                        </TouchableOpacity>
                    </Animatable.View>
            </ImageBackground>       
        </View>
    )
}

export default passReset

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
        padding:SIZES.padding2*2,
        marginBottom:0,
         alignItems:"center",
        backgroundColor:'rgba(0,0,0 ,0.8)'       
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
        width:SIZES.width*0.90,
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
    btn: {
        alignSelf:"center",
        justifyContent:"center",
        padding:SIZES.padding*0.7,
        width:SIZES.width*0.8,
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
   sucesstxt: {
    color:COLORS.white ,fontWeight:'bold',justifyContent:'center',textAlign:'center',
    padding:3,
    backgroundColor:COLORS.green,
   }
})
