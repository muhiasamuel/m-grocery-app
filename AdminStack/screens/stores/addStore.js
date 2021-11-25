import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert, FlatList } from 'react-native';
import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import "firebase/storage";
import 'firebase/firestore';
import Firebase from '../../../firebaseConfig';
import { AuthenticatedUserContext } from '../../../AuthProvider/AuthProvider';
import { Avatar, Colors, DataTable } from 'react-native-paper';
import { COLORS, FONTS, SIZES  } from '../../../constants/Index';
import * as geofire from 'geofire-common';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
const Store =  ({route, navigation}) => {
  const {storeData, setStoreData,storeid,AuthUserRole} = useContext(AuthenticatedUserContext);
  const [region, setRegion] = useState({});
  const [mapVisibility, setmapVisibility] = useState(false);
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [storeName, setstoreName] = useState('');
  const [storeDetails, setstoreDetails] = useState('');
  const [storeIdNo, setstoreIdNo] = useState('');
  const [location, setStoreLocation] = useState('');
  const [transferred, setTransferred] = useState(0);
  const [catDataVisible,setcatDataVisible] = useState(false);
  const [uploading, setUploading] =useState(null);
  const [submitting, setIsSubmitting] =useState(false);

  const [isLoading, setIsLoading] =React.useState(true);
  const auth = Firebase.auth();
  React.useEffect(() => {
    getStoreData();
    (async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
      updateState(location);
    } catch (error) {
      console.log(error);
    }})();
  }, [])
//set location
function updateState(location) {
  setRegion(location.coords)
}
console.log(region);

  const handleSubmit = async() => {
    setIsSubmitting(true)
    const Storename = storeName
    const StoreDetails = storeDetails
    const StoreLocation = location
    const long = region.longitude;
    const lat = region.latitude;
    const hash = geofire.geohashForLocation([lat, long])
    let imgUrl = await uploadImage();
      const dbh = Firebase.firestore();
      dbh.collection("Stores").add({
        storeId: Date.now().toString(36) + Math.random().toString(36).substr(2),        
        storeName: Storename,
        storeDetails : StoreDetails,
        storeLocation:StoreLocation,
        storeIdNo:storeIdNo,
        storeimage: imgUrl,
        geohash: hash,
        lat: lat,
        lng: long,
        region:region,
        createdAt: Date.now()
      }).then(() => {
        setIsSubmitting(false)
        setstoreDetails('');
        setstoreName('');
        setStoreLocation('');
        setPickedImagePath('');
        Alert.alert('store created successifully');
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
  
      const ref = await Firebase.storage().ref().child(`storeims/${filename}`);
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

  const getStoreData = async () => {
    try{
      const dataArr = [];
        const response=Firebase.firestore().collection('Stores');
        const data= await response.get();
        data.docs.forEach(item=>{
          const {storeName,storeId, storeDetails,storeLocation,uniqie_code, storeimage} = item.data();
          dataArr.push({
            key: item.id,
            storeId,
            uniqie_code,
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
    <SafeAreaView style={styles.container}>       
         <TextInput
          style={styles.input}
          value={storeName}
          placeholderTextColor={Colors.grey800}
          placeholder={"Store Name"}
          onChangeText={(text) => setstoreName(text)}
          autoCapitalize={"none"}
      />
          <TextInput
          multiline={true}
          numberOfLines={8}
          style={[styles.input,{borderRadius:5}]}
          value={storeDetails}
          placeholderTextColor={Colors.grey800}
          placeholder={"StoreDetails"}
          onChangeText={(text) => setstoreDetails(text)}
          autoCapitalize={"none"}
      />
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <TextInput
          style={[styles.input, {width:SIZES.width*0.54}]}
          value={location}
          placeholderTextColor={Colors.grey800}
          placeholder={"Location Adress"}
          onChangeText={(text) => setStoreLocation(text)}
          autoCapitalize={"none"}
      />
            <TextInput
          style={[styles.input,{width:SIZES.width*0.42 }]}
          value={storeIdNo}
          placeholderTextColor={Colors.grey800}
          placeholder={"Store Unique Code"}
          onChangeText={(text) => setstoreIdNo(text)}
          autoCapitalize={"none"}
      />
      </View>
        <View  style ={[styles.centered,{justifyContent:'space-around'}]}>
        {AuthUserRole?.role === `Admin` ?
        
        <TouchableOpacity
        onPress={() => handleSubmit()}
        >{submitting ?
          <ActivityIndicator color={COLORS.white} size='large'/>
          :

          <Text style={styles.btnUpdate}>Add Store</Text>
                }
        
        </TouchableOpacity>
        :
        <Text style={[styles.btnUpdate,{backgroundColor:Colors.red900,...FONTS.h6}]}>Forbidden</Text>
      }

            <TouchableOpacity
              style={{alignItems:'center'}}
              onPress={() => setcatDataVisible(!catDataVisible)}
            >
              <Text style={{color:COLORS.blackSecondary,...FONTS.body3}}>Edit store Data</Text> 
              <Ionicons name="md-chevron-down-circle-outline" size={28} color={COLORS.blackSecondary} />
            </TouchableOpacity> 
            </View>
           
    </SafeAreaView>
  )
}
//Pick Category image
function renderstoreim(){
  return(
    <View>
      <View style={[styles.buttonContainer,{backgroundColor:Colors.grey50}]}>
        <Text style={[styles.label,{color:Colors.grey800}]}>Store Image:</Text>
        <TouchableOpacity
          onPress={showImagePicker}
        >
          <Text style={styles.btbbtn}>Open Gallery</Text>
        </TouchableOpacity>  
        
        <TouchableOpacity
          onPress={openCamera}>
             <FontAwesome5 name='camera' size={38} color={Colors.teal900}/>
          </TouchableOpacity>
        </View>
      <View style={styles.imageContainer}>
        {
          pickedImagePath !== '' && (
            <>
          <Avatar.Image
          size={150}
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
function renderStoreEdit(){
  const renderItem = ({item}) =>(
          <View style={{
            flexDirection:'row',
            justifyContent:'space-around',
            alignItems:'center'}}>
           
            <Text style={[styles.storeName,{color:Colors.grey600}]}>{item?.storeName}</Text>
            <Image style={styles.bodyphoto} source={{uri: item?.storeimage}} />

            {
              storeid ===item.key ?
              <TouchableOpacity
              onPress={() => navigation.navigate('editStore',{
              item})}
            > 
            <Text style={[styles.btnUpdateStore,{paddingHorizontal:28,...FONTS.h3}]}>Edit</Text>              
            </TouchableOpacity>
            :
            <Text style={[styles.btnUpdateStore,{paddingLeft:18,backgroundColor:Colors.red700}]}>Forbidden </Text> 
            }  
            
            
          </View>
      )
      return(
        <>
                
        <View style={{
            flexDirection:'row',
            justifyContent:'space-around',
            alignItems:'center'}}>
          <Text style={[styles.storeName,{...FONTS.h4, color:Colors.grey600}]}>StoreName</Text>
          <Text style={[styles.storeName,{...FONTS.h4, color:Colors.grey600}]}>Cat Image</Text>
          
          <Text style={[styles.storeName,{...FONTS.h4, color:Colors.grey600}]}>Actions</Text>
        </View>
       
        <FlatList
            data={storeData}
            keyExtractor={item => `${item.key}`}
            renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom:25,
              backgroundColor:'#fff'
            }}
        />
        </>
      )
      }

    return (
      <View style={styles.screen}>
      {catDataVisible == true?
      <>
            <ScrollView>
            {renderstoreim()}
            {renderAddStore()}          
           </ScrollView> 
           </>
           :
           <>
            <TouchableOpacity
              style={{alignItems:'center',backgroundColor:Colors.grey50}}
              onPress={() => setcatDataVisible(!catDataVisible)}
            >
              <Text style={{color:COLORS.darkblue,...FONTS.body2,}}>Add store Data</Text> 
              <Ionicons name="md-chevron-up-circle-outline" size={28} color={COLORS.darkblue} />
            </TouchableOpacity>
           {renderStoreEdit()}
           </>
          } 
   
       
    </View>
    )
}

export default Store

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:Colors.grey100,
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
    backgroundColor:Colors.lightGreen400,
    padding:SIZES.padding*0.9,
    color:COLORS.white,
    borderColor:Colors.teal400,
    borderWidth:3
  },
  imageContainer: {
    padding: 10
  },
  image: {
    alignSelf:'center',
    resizeMode: 'cover'
  },
  input: {
    width:SIZES.width*0.95,
    borderColor:Colors.tealA400,
    borderWidth:0.6,
    paddingHorizontal:SIZES.padding2,
    paddingVertical:10,
    borderRadius:10,
    marginBottom: 12,    
    color:COLORS.blackSecondary,
    backgroundColor: COLORS.white,
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
    paddingHorizontal:SIZES.padding2*2.5,
    paddingVertical:SIZES.padding2,
    color:'#fff',
    ...FONTS.h3,
    borderWidth:2,
    borderColor:Colors.teal300,
    backgroundColor:Colors.indigoA200,
    borderRadius:SIZES.radius*0.3
  },
  btnUpdateStore:{
    paddingHorizontal:SIZES.padding2,
    paddingVertical:SIZES.padding2,
    marginVertical:5,
    color:'#fff',
    ...FONTS.h6,
    backgroundColor:'skyblue',
    borderRadius:SIZES.radius*0.3
  },
  editPic: {
    position:'absolute',
    alignSelf:'center',
    justifyContent:'center',
    top:60
  },
  storeName:{
    ...FONTS.body2,color:COLORS.darkgrey3,paddingVertical:SIZES.padding2,
    paddingHorizontal:SIZES.padding,
    width:SIZES.width*0.3
  },
  bodyphoto: {
    width:SIZES.width*0.23,
    height:65,
    borderRadius:25,
    marginVertical:10

}
  
})
