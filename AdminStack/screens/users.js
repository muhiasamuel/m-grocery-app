import React, { FC, ReactElement, useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View,TouchableOpacity, Text, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, ImageBackground, Image } from "react-native";
import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/firestore";
import { COLORS, FONTS, images, SIZES } from "../../constants/Index";
import { Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable'
import PickerCheckBox from 'react-native-picker-checkbox';
import { ScrollView } from "react-native-gesture-handler";
import Firebase from "../../firebaseConfig";
import * as ImagePicker from 'expo-image-picker';
import { AuthenticatedUserContext } from "../../AuthProvider/AuthProvider";
import { Avatar, Colors, Title } from "react-native-paper";
export default function Users() {
  const Auth = Firebase.auth();
  const {storeData, setStoreData} = React.useContext(AuthenticatedUserContext);
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [UserPhoneNo, setUserPhoneNo] = useState("");
  const [UserIdNo, setUserIdNo] = useState("");
  const [VehRegNo, setVehRegNo] = useState("");
  const [storeId, setStoreId] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [uploading, setUploading] =useState(null);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ secureTextEntry, setsecureTextEntry] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  React.useEffect(() => {
    getStoreData();
  }, [])

  const updateSecureTextEntry = () =>{
    setsecureTextEntry(!secureTextEntry);

  }

    
  const doUserRegistration = async function () {
    setIsSubmitting(true)
    const usernameValue = username;
    const passwordValue = password;
    const Customerrole = "Deliverly Person";
    const EmailValue = userEmail;
    const PhoneNoValue = Number(UserPhoneNo);
    let imgUrl = await uploadImage();  

    
    try {
      if (EmailValue !== '' && UserIdNo !== ''  && PhoneNoValue !== ''  && VehRegNo !== ''  && StoreName !== '') {
        
          const docId =await Firebase.firestore().collection("Deliverly Persons").doc().id
          Firebase.firestore().collection('Deliverly Persons').doc(docId).set({
            key:docId,
            uid: user.user.uid,
            Email:EmailValue,
            storeId:storeId,
            storeName:StoreName,
            IdNo:UserIdNo,
            vehRegNo:VehRegNo,
            Status:"Active",
            username:usernameValue,
            role: Customerrole,
            userimage: imgUrl,
            phonenumber:PhoneNoValue
            
          }).then(async() => {
          setSuccessMsg('Deliverly Person created')
          setIsSubmitting(false)         
          return true;
        })
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false)
      setErrorMessage(error.message || error.statusText)
    // signin can fail if any parameter is blank or failed an uniqueness check on the server
      setTimeout(() => {
        setErrorMessage(null)
      }, 3600);
    return false;
    }
  };
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    await ImagePicker.launchCameraAsync({      
      allowsEditing:true,
      quality:0.5,
      base64:false,
      mediaTypes:ImagePicker.MediaTypeOptions.All,
      aspect:[4,3]
      
      
    }).then((result) => {
      console.log(result);
      if (!result.cancelled) {
        setPickedImagePath(result.uri);
      }
    })

    // Explore the result
   
  }
const getPictureBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
};

// here I am uploading the image to firebase storage
const uploadImage = async () => {
  let blob;
  
  
    setUploading(true);
    blob = await getPictureBlob(pickedImagePath);

    const uploaduri = pickedImagePath;  
    let filename = uploaduri.substring(uploaduri.lastIndexOf('/') + 1);

    //add timestamp
    const extension = filename.split('.').pop();
    const name = filename.split('/').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    const ref = await Firebase.storage().ref().child(`deliverlyPerson/${filename}`);
    const task = await ref.put(blob);

    try {
    await task;
    const url =  await task.ref.getDownloadURL(); 
    console.log(url);
    setUploading(false);
    alert("saved successfully");  
    return url
  } catch (e) {
    console.log(e);
    alert("Please Select a Photo First");
    setUploading(false);
  }
};
const getStoreData = async () => {
  try{
    const dataArr = [];
      const response=Firebase.firestore().collection('Stores');
      const data= await response.get();
      data.docs.forEach(item=>{
        const {storeName,storeId, storeDetails,storeLocation, storeimage} = item.data();
        dataArr.push({
          key: item.id,
          storeId,
          storeName,
          storeDetails,
          storeLocation,
          storeimage
        });
        setStoreData(dataArr)
      })
  }
  catch(e){
    console.log(e);
  }
}
const handleStoreConfirm =(SItems) =>{
  SItems.map((d) =>{
    console.log(d.key);
    setStoreId(d.key);
    setStoreName(d.storeName)
  })    
}


function renderdelivPersim(){
  return(
    <View>
      <View style={{flexDirection:"row"}}>
       <Title style={{alignSelf:"center", width:SIZES.width*0.35, color:Colors.grey300}}>Deliverly Persons Image</Title>
        
      <View style={styles.imageContainer}>
        
        {
          pickedImagePath !== '' ?(
            <>
          <Avatar.Image
            source={{ uri: pickedImagePath }}
            size={150}
          />
          <TouchableOpacity
          style={styles.editPic }
          onPress={openCamera}>
             <FontAwesome name='camera' size={35} color={COLORS.white}/>
          </TouchableOpacity></>)
          :
          <View style={styles.userImageView}>
          <Avatar.Image
          color={Colors.red100}
            size={150}
          />
          <TouchableOpacity
          style={styles.editPic }
          onPress={openCamera}>
            <Text style={{color:COLORS.white,alignSelf:"center"}}>user Image</Text>
             <FontAwesome style={{alignSelf:"center"}} name='camera' size={28} color={COLORS.white}/>
          </TouchableOpacity>
        </View>
        
          
          
        }
        {uploading && (
        <View>
          <Text style={styles.label}>uploading...</Text>
        </View>
          )}
      </View>
    </View>
    </View>
    
  )
}
function renderBody() {
  return(
    <Animatable.View      
    animation="fadeInUpBig"
    duration={1900}
     style= {styles.bodyMainView}>
       {renderdelivPersim()}
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
          placeholder={"Deliverly person Name"}
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
   <View style={{flexDirection:"row",justifyContent:"space-around"}}>
   {/*<Text style={styles.label}>PhoneNumber:</Text>*/}
   <TextInput
          style={[styles.input,{width:SIZES.width*0.54}]}
          value={UserPhoneNo}
          keyboardType='phone-pad'
          keyboardAppearance='light'            
          placeholderTextColor="#fff"
          placeholder={"phone Number"}
          onChangeText={(text) => setUserPhoneNo(text)}
          autoCapitalize={"none"}
      />
       <TextInput
          style={[styles.input,{width:SIZES.width*0.40}]}
          value={UserIdNo}
          keyboardType='phone-pad'
          keyboardAppearance='light'            
          placeholderTextColor="#fff"
          placeholder={"ID Number"}
          onChangeText={(text) => setUserIdNo(text)}
          autoCapitalize={"none"}
      />
   </View>
   <View style={styles.CheckBox}>
   <PickerCheckBox
          data={storeData}
          headerComponent={<Text style={{fontSize:25}} >Stores</Text>}
          ConfirmButtonTitle='OK'
          DescriptionField='storeName'
          KeyField='key'
          OnConfirm={(SItems) => handleStoreConfirm(SItems)}
          placeholderSelectedItems    
          placeholder='select Store'
          arrowColor='#FFD740'
          arrowSize={10}
          placeholderSelectedItems ='$count selected item(s)'
          /> 
   </View>
   <View>
   {/*<Text style={styles.label}>Email Address:</Text>*/}
      <TextInput
          style={styles.input}
          value={VehRegNo}            
          placeholderTextColor="#fff"
          placeholder={"Vehicle/Bike reg No."}
          onChangeText={(text) => setVehRegNo(text)}
          autoCapitalize={"none"}
      /> 
     
   </View>
   {/*<Text style={styles.label}>Password:</Text>*/}
   <View style={styles.centredView}>
      <TextInput
          style={[styles.input,{width:SIZES.width*0.8}]}
          value={password}
          placeholderTextColor="#fff"
          placeholder={"Password"}
          secureTextEntry={secureTextEntry? true: false}
          onChangeText={(text) => setPassword(text)}
      /> 
          <TouchableOpacity
          style={styles.passeye}
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
          <Text style={styles.btntext}>Submit</Text>   
      }
      
   </TouchableOpacity>
    </Animatable.View>
  )
}


    return (
      <View style={styles.container}>
        <ScrollView >
          <View style={{marginVertical:20}}>
            <Title style={{ paddingHorizontal:12,color:COLORS.white}}>Create Deliverly Persons:</Title>
          </View>
         {renderBody()}
        </ScrollView>
      </View>
        
    )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:'rgba(0,0,0,0.6)',
    
    
  },
  image: {
    width:SIZES.width,
    height:SIZES.height,
  },
 

  bodyMainView:{
    alignItems:"center",
    paddingVertical:SIZES.padding2,
  },
  label: {
    paddingLeft:10,
    color:COLORS.white,
    padding:2,
    fontSize:20,
    fontWeight:"bold"
  },
input: {
  
  width:SIZES.width*0.96,
  borderColor:COLORS.darkgrey,
  borderWidth:1,
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
 },
 passeye: {
  width:SIZES.width*0.15,
  borderColor:COLORS.darkgrey,
  borderWidth:0.9,
  paddingHorizontal:SIZES.padding2,
  paddingVertical:10,
  borderRadius:15,
  marginBottom: 12,
  color:COLORS.white,
  backgroundColor: COLORS.transparent,
 },
 storeTitle: {
  ...FONTS.h4, 
  color:COLORS.black, 
  fontStyle:'normal'
},
buttonContainer: {
  width: SIZES.width,
  flexDirection: 'row',
  paddingVertical: SIZES.padding2,
  paddingHorizontal:SIZES.padding2,
  justifyContent:'space-between'
},
btbbtn: {
  borderRadius:10,
  backgroundColor:COLORS.darkblue,
  padding:SIZES.padding,
  color:COLORS.white,
  borderColor:COLORS.darkgrey,
  borderWidth:3
},
imageContainer: {
  padding: 10
},
image: {
  alignSelf:'center',
  borderRadius:100,
  width: 180,
  height: 180,
  resizeMode: 'cover'
},
editPic: {
  position:'absolute',
  alignSelf:'center',
  justifyContent:'center',
  top:50
},
CheckBox: {
  width: SIZES.width*0.95,
  borderWidth:0.5,
  borderColor:COLORS.darkgrey4,
  borderRadius:10,
  marginVertical:10
},

});
