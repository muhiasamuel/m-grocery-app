import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SIZES } from '../../constants/Index';
import "firebase/storage";
import 'firebase/firestore';
import Firebase from '../../firebaseConfig';

const Store =  ({route, navigation}) => {
    
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [storeName, setstoreName] = useState('');
  const [storeDetails, setstoreDetails] = useState('');
  const [location, setStoreLocation] = useState('');
  const [transferred, setTransferred] = useState(0);
  const [uploading, setUploading] =useState(null);
  const [submitting, setIsSubmitting] =useState(false);

  const handleSubmit = async() => {
    setIsSubmitting(true)
    const StoreName = storeName
    const StoreDetails = storeDetails
    const StoreLocation = location

    let imgUrl = await uploadImage();
      const dbh = Firebase.firestore();
      dbh.collection("Stores").doc(StoreName).set({
        storeId: Date.now().toString(36) + Math.random().toString(36).substr(2) + StoreName,
        storeName: StoreName,
        storeDetails : StoreDetails,
        storeLocation:StoreLocation,
        storeimage: imgUrl,
        createdAt: Date.now()
      }).then(() => {
        setIsSubmitting(false)
        console.log('data updated');
      }) 

  }

    // This function is triggered when the "Select an image" button pressed
    const showImagePicker = async () => {
        // Ask the user for the permission to access the media library 
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your photos!");
        return;
        }

    await ImagePicker.launchImageLibraryAsync({
        Width:300,
        height:300,
        quality:0.7,
        aspect:[4,3],
        base64:false,
        allowsEditing:true
        
        }).then((result) => {
        // Explore the result
        console.log(result);
        if (!result.cancelled) {
            setPickedImagePath(result.uri);
        }
        })
    }

      // This function is triggered when the "Open camera" button pressed
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
  
      const ref = await firebase.storage().ref().child(`storeims/${filename}`);
      const task = await ref.put(blob);

      try {
      await task;
      const url =  await task.ref.getDownloadURL(); 
      console.log(url);
      setTransferred(0)
      setUploading(false);
      alert("saved successfully");  
      return url
    } catch (e) {
      alert("Please Select a Photo First");
      setUploading(false);
    }
  };

  //header
  function renderHeader(){
    return(
        <View style={styles.headerView}>
            <TouchableOpacity
            onPress = {()=> navigation.navigate('prodcats')}
             style={styles.backArrow}>
                <MaterialIcons name='arrow-back' size={24} color={COLORS.white}/>
            </TouchableOpacity>
            <View style={styles.storeMainview}>
              <View style={styles.storeSubview}>
                  <Text style={styles.storeTitle}>Add Stores</Text>
              </View>
          </View>
          <TouchableOpacity>                
                <MaterialCommunityIcons name= 'menu-swap-outline' size={27} color={COLORS.white}/>
          </TouchableOpacity>
        </View>
    )
}

//add category Data
function renderAddStore(){
  return(
    <ScrollView style={styles.container}>       
         <TextInput
          style={styles.input}
          value={storeName}
          placeholderTextColor="#fff"
          placeholder={"Store Name"}
          onChangeText={(text) => setstoreName(text)}
          autoCapitalize={"none"}
      />
          <TextInput
          style={styles.input}
          value={storeDetails}
          placeholderTextColor="#fff"
          placeholder={"StoreDetails"}
          onChangeText={(text) => setstoreDetails(text)}
          autoCapitalize={"none"}
      />
                <TextInput
          style={styles.input}
          value={location}
          placeholderTextColor="#fff"
          placeholder={"Location"}
          onChangeText={(text) => setStoreLocation(text)}
          autoCapitalize={"none"}
      />
    </ScrollView>
  )
}
//Pick Category image
function renderstoreim(){
  return(
    <View>
      <View style={styles.buttonContainer}>
        <Text style={styles.label}>Category Image:</Text>
        <TouchableOpacity
          onPress={showImagePicker}
        >
          <Text style={styles.btbbtn}>Open Gallery</Text>
        </TouchableOpacity>  
        
        <TouchableOpacity
          onPress={openCamera}>
             <Feather name='camera' size={38} color={COLORS.white}/>
          </TouchableOpacity>
        </View>
      <View style={styles.imageContainer}>
        {
          pickedImagePath !== '' && (
            <>
          <Image
            source={{ uri: pickedImagePath }}
            style={styles.image}
          />
          <TouchableOpacity
          style={styles.editPic }
          onPress={openCamera}>
             <FontAwesome name='camera' size={35} color={COLORS.white}/>
          </TouchableOpacity></>)
          
        }
        {uploading && (
        <View>
          <Text style={styles.label}>uploading...</Text>
        </View>
          )}
      </View>
    </View>
  )
}

    return (
      <View style={styles.screen}>
      {renderHeader()}     
      {renderstoreim()}
      {renderAddStore()}
      <TouchableOpacity style ={styles.centered}
      onPress={() => handleSubmit()}
      >{submitting ?
        <ActivityIndicator />
        :
        <Text style={styles.btnUpdate}>Submit</Text>
              }
       
      </TouchableOpacity>
    </View>
    )
}

export default Store

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:COLORS.backgroundColor,
  },
  container: {
    marginVertical:SIZES.padding,
    paddingHorizontal:5,
  },
  headerView: {
    flexDirection:"row", 
    alignItems:'center',
    paddingVertical:SIZES.padding2*0.8,
    paddingHorizontal:SIZES.padding2*0.5,
    backgroundColor:COLORS.darkblue,
    marginBottom:2
},
backArrow: {
    width:50,
    paddingLeft: SIZES.padding *2,
    justifyContent: 'center'
},
storeMainview: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center'
},
storeSubview: {
    padding:SIZES.padding2*0.8,
    backgroundColor: COLORS.white,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: SIZES.radius
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
    height: 150,
    resizeMode: 'cover'
  },
  input: {
    width:SIZES.width*0.95,
    borderColor:COLORS.darkgrey,
    borderWidth:0.1,
    paddingHorizontal:SIZES.padding2,
    paddingVertical:10,
    borderRadius:10,
    marginBottom: 12,    
    color:COLORS.white,
    backgroundColor: COLORS.transparent,
  },
  label: {
    color:COLORS.white,
    ...FONTS.h3,
  },
  centered:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    paddingVertical:SIZES.padding2
  },
  btnUpdate:{
    paddingHorizontal:SIZES.padding2,
    paddingVertical:SIZES.padding2*0.5,
    color:'#fff',
    ...FONTS.h3,
    backgroundColor:COLORS.primary,
    borderRadius:SIZES.radius*0.3
  },
  editPic: {
    position:'absolute',
    alignSelf:'center',
    justifyContent:'center',
    top:60
  }
  
})
