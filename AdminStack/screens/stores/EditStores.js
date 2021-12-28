import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert, FlatList, Modal } from 'react-native';
import { AntDesign, Entypo, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import "firebase/storage";
import 'firebase/firestore';
import Firebase from '../../../firebaseConfig';
import * as geofire from 'geofire-common';
import * as Location from 'expo-location';
import { AuthenticatedUserContext } from '../../../AuthProvider/AuthProvider';
import { COLORS, FONTS, SIZES  } from '../../../constants/Index';
import { Colors, Headline } from 'react-native-paper';

const EditStore =  ({route, navigation}) => {
  const {storeData} = useContext(AuthenticatedUserContext);
  const [region, setRegion] = useState({});
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [storeName, setstoreName] = useState('');
  const [storeIdNo, setstoreIdNo] = useState('');
  const [storeUser, setStoreUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState(null);
  const [storeDetails, setstoreDetails] = useState('');
  const [location, setStoreLocation] = useState('');
  const [transferred, setTransferred] = useState(0);
  const [catDataVisible,setcatDataVisible] = useState(false);
  const [uploading, setUploading] =useState(null);
  const [submitting, setIsSubmitting] =useState(false);
  const [storeimage, setStoreIma] = useState(null);
  const [currentstore, setCurrentStore] =React.useState(null);
  const auth = Firebase.auth();
  React.useEffect(() => {
    let{item} =route.params 
    StoreData(item);
    getusers();
    setCurrentStore(item);
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
  const StoreData = (item) =>{
    setstoreName(item.storeName);
    setStoreUser(item.storeManager)
    setStoreLocation(item.storeLocation);
    setstoreDetails(item.storeDetails)
    setPickedImagePath(item.storeimage)
    setstoreIdNo(item.uniqie_code)
  }
//set location
function updateState(location) {
  setRegion(location.coords)
}
//get user data

const getusers = async() =>{
  try{
    const dataArr = [];
      const response=Firebase.firestore().collection('users')
      .where('role', "==", 'storeAdmin')
      .where('storeid', "==", '')
      const data= await response.get();
      data.docs.forEach(item=>{
        const {username, uid} = item.data();
        dataArr.push({
          key: item.id,
          uid,
          username
        });
        setUsers(dataArr)
      })
  }
  catch(e){
    console.log(e);
  }
}
console.log(users);
const onfocus = () => {
  setModalVisible(!modalVisible)
}
  const handleSubmit = async(key) => {
    setIsSubmitting(true)
    const Storename = storeName
    const StoreDetails = storeDetails
    const StoreLocation = location
    const long = region.longitude;
    const lat = region.latitude;
    const hash = geofire.geohashForLocation([lat, long])

    let imgUrl = await uploadImage();
    const userUpdate=Firebase.firestore().collection('users').doc(storeUser?.key)
    const db = Firebase.firestore().collection("Stores")
    await db.doc(key).update({
        storeId: Date.now().toString(36) + Math.random().toString(36).substr(2),
        storeName: Storename,
        storeDetails : StoreDetails,
        storeLocation:StoreLocation,
        storeimage: imgUrl,
        storeManager:storeUser.username,
        uniqie_code:storeIdNo,
        geohash: hash,
        lat: lat,
        lng: long,
        region:region,
        Updated_At: Date.now()
      }).then(() => {
        userUpdate.update({
          storeid:key
        })
        setIsSubmitting(false)
        setstoreDetails('');
        setstoreName('');
        setStoreLocation('');
        setPickedImagePath('');
        Alert.alert('data updated');
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



 //users
function renderStoreNames(){
  const renderItem = ({item}) =>(
          <View>
            <TouchableOpacity
            onPress={() => setStoreUser(item)}
            style={{flexDirection:'row',alignItems:'center'}}
          >
            {storeUser?.uid == item?.uid ?
            <>
            <MaterialCommunityIcons name="check-circle-outline" size={30} color={Colors.green500} />
            </>
            :
            <>
            <Entypo name="circle" size={28} color="black" />
            
            </>
          }
            
            <Text style={{...FONTS.body4,paddingLeft:SIZES.padding2*2}} >{item?.username}</Text>
            </TouchableOpacity>

            
            
          </View>
      )
      return(
        <FlatList
            data={users}
            keyExtractor={item => `${item.key}`}
            renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
              paddingBottom:25,
              backgroundColor:COLORS.white
            }}
        />
      )
      }

     function renderModal(){
   
        return(
            <Modal 
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                 <Headline>Select Store Admin</Headline>
                 {renderStoreNames()}
    
                 <View style={[styles.btnUpdateStore,{flexDirection:'row',width:100, justifyContent:'center', alignItems:'center'}]}>
                    <TouchableOpacity
                      
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={{...FONTS.body2, color:Colors.red800}}>Ok</Text>
                    </TouchableOpacity>
                  
                  </View>
    
                </View>
              </View>   
    
            </Modal>
        )
    }


//add category Data
function renderAddStore(){
  return(
    <SafeAreaView style={styles.container}>       
         <TextInput
          style={styles.input}
          value={storeName}
          placeholderTextColor={Colors.grey400}
          placeholder={"Store Name"}
          onChangeText={(text) => setstoreName(text)}
          autoCapitalize={"none"}
      />
          <TextInput
          multiline={true}
          numberOfLines={8}
          style={styles.input}
          value={storeDetails}
          placeholderTextColor={Colors.grey400}
          placeholder={"StoreDetails"}
          onChangeText={(text) => setstoreDetails(text)}
          autoCapitalize={"none"}
      />
       
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <TextInput
          style={[styles.input, {width:SIZES.width*0.5}]}
          value={location}
          placeholderTextColor={Colors.grey400}
          placeholder={"Location"}
          onChangeText={(text) => setStoreLocation(text)}
          autoCapitalize={"none"}
      />
            <TextInput
          style={[styles.input,{borderRadius:5,width:SIZES.width*0.42}]}
          value={storeIdNo}
          placeholderTextColor={Colors.grey400}
          placeholder={"Store Id eg 1234"}
          onChangeText={(text) => setstoreIdNo(text)}
          autoCapitalize={"none"}
      />
      </View>
      <TextInput 
          onFocus={onfocus}
          style={[styles.input]}
          value={storeUser?.username}
          placeholderTextColor={Colors.grey800}
          placeholder={"Store Manager"}
          autoCapitalize={"none"}
      />
        <View  style ={[styles.centered,{justifyContent:'space-around'}]}>
            <TouchableOpacity
            onPress={() => handleSubmit(currentstore.key)}
            >{submitting ?
              <ActivityIndicator color={COLORS.darkblue} size='large'/>
              :
              <Text style={styles.btnUpdate}>Update Store</Text>
                    }
            
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
             <FontAwesome name='camera' size={38} color={Colors.teal700}/>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
        {/*/////////////////////////////////////////////////*/}
        {  pickedImagePath !== '' &&(
            <>
          <Image
            source={{ uri: pickedImagePath }}
            style={styles.image}
          />
          <TouchableOpacity
          style={styles.editPic }
          onPress={openCamera}>
             <FontAwesome name='camera' size={35} color={COLORS.white}/>
          </TouchableOpacity></>)}
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
            <ScrollView>
              {renderModal()}
            {renderstoreim()}
            {renderAddStore()}          
           </ScrollView>        
    </View>
    )
}

export default EditStore

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:Colors.grey100,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
modalView: {
  marginTop:SIZES.height*0.2,
  width:SIZES.width*0.95,        
  backgroundColor:'rgb(255, 255, 255)',
  padding: 35,
  shadowColor: "#000",
  borderRadius:5,
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5
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
    backgroundColor:Colors.lightGreen700,
    padding:SIZES.padding*0.9,
    color:COLORS.white,
    borderColor:Colors.teal300,
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
    borderColor:Colors.tealA400,
    borderWidth:0.5,
    paddingHorizontal:SIZES.padding2,
    paddingVertical:10,
    borderRadius:10,
    marginBottom: 12,    
    color:COLORS.blackSecondary,
    backgroundColor: COLORS.white,
  },
  label: {
    color:COLORS.darkblue,
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
    backgroundColor:Colors.lightBlue300,
    borderRadius:SIZES.radius*0.3
  },
  btnUpdateStore:{
    paddingHorizontal:SIZES.padding2,
    paddingVertical:SIZES.padding2,
    marginVertical:5,
    color:'#fff',
    ...FONTS.h3,
    backgroundColor:'skyblue',
    borderRadius:SIZES.radius*0.3
  },
  editPic: {
    position:'absolute',
    alignSelf:'center',
    justifyContent:'center',
    top:40
  },
  storeName:{
    ...FONTS.body2,color:COLORS.darkgrey3,paddingVertical:SIZES.padding2,
    paddingHorizontal:SIZES.padding,
    width:SIZES.width*0.3
  },
  bodyphoto: {
    width:SIZES.width*0.25,
    height:75,
    borderRadius:25,
    marginVertical:8

}
  
})
