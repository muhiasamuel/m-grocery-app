import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SIZES } from '../../../constants/Index';
import "firebase/storage";
import 'firebase/firestore';
import Firebase from '../../../firebaseConfig';
import { AuthenticatedUserContext } from '../../../AuthProvider/AuthProvider';
import { FlatList } from 'react-native-gesture-handler';
import { Colors } from 'react-native-paper';

const ProductCategories = ({route, navigation}) => {
  const {catData, setCatData} = React.useContext(AuthenticatedUserContext);

  const [pickedImagePath, setPickedImagePath] = useState('');
  const [catName, setCatName] = useState('');
  const [catDetails, setCatDetails] = useState('');
  const [transferred, setTransferred] = useState(0);
  const [catProdDataVisible,setcatProdDataVisible] = useState(false);
  const [uploading, setUploading] =useState(null);
  const [submitting, setIsSubmitting] =useState(false);
  const [catToEdit, setCatToEdit] =React.useState('');



  React.useEffect(() => {
      let{item} = route.params
      setCatToEdit(item.key)
      getCatData(item);
  }, [])

  const getCatData = (item) => {
      setCatName(item.catname);
      setCatDetails(item.catdetails);
      setPickedImagePath(item.catimage)
  }

  const handleSubmit = async() => {
    setIsSubmitting(true)
    const CategoryName = catName
    const CategoryDetails = catDetails

    let imgUrl = await uploadImage();
      const dbh = Firebase.firestore().collection("ProductCategories");
      await dbh.doc(catToEdit).update({
        catId: Date.now().toString(36) + Math.random().toString(36).substr(2),
        catname: CategoryName,
        catdetails : CategoryDetails,
        catimage: imgUrl,
        createdAt: Date.now()
      }).then(() => {
        setIsSubmitting(false)
        setCatDetails('')
        setCatName('')
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
  
      const ref = await Firebase.storage().ref().child(`catImages/${filename}`);
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


//add category Data
function renderAddCategories(){
  return(
    <SafeAreaView style={styles.container}>       
         <TextInput
          style={styles.input}
          value={catName}
          placeholderTextColor={Colors.grey400}
          placeholder={"Category Name"}
          onChangeText={(text) => setCatName(text)}
          autoCapitalize={"none"}
      />
          <TextInput
          multiline={true}
          numberOfLines={6}
          style={styles.input}
          value={catDetails}
          placeholderTextColor={Colors.grey400}
          placeholder={"CategoryDetails"}
          onChangeText={(text) => setCatDetails(text)}
          autoCapitalize={"none"}
      />
              <View  style ={[styles.centered,{justifyContent:'space-around'}]}>
            <TouchableOpacity
            onPress={() => handleSubmit()}
            >{submitting ?
              <ActivityIndicator color={COLORS.darkblue} size='large'/>
              :
              <Text style={styles.btnUpdate}>UPDATE</Text>
                    }
            
            </TouchableOpacity>
            </View>
    </SafeAreaView>
  )
}

//Pick Category image
function renderCatImage(){
  return(
    <View>
      <View style={[styles.buttonContainer,{backgroundColor:Colors.grey50}]}>
        <Text style={[styles.label,{color:Colors.grey800}]}>Category Image:</Text>
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
          <ScrollView>
          {renderCatImage()}
          {renderAddCategories()}
         
        </ScrollView> 
    
    </View>
    )
}

export default ProductCategories

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
    color:COLORS.blackSecondary, 
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
    paddingHorizontal:SIZES.padding2*2,
    paddingVertical:SIZES.padding,
    color:'#fff',
    ...FONTS.h3,
    backgroundColor:Colors.lightBlue300,
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
  btnUpdateprod:{
    paddingHorizontal:SIZES.padding2,
    paddingVertical:SIZES.padding2,
    marginVertical:5,
    color:'#fff',
    ...FONTS.h4,
    backgroundColor:'skyblue',
    borderRadius:SIZES.radius*0.3
  },
  bodyphoto: {
    width:SIZES.width*0.25,
    height:75,
    borderRadius:25,
    marginVertical:8

}
  
})
