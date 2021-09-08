import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Picker, SafeAreaView } from 'react-native';
import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { DataContext } from '../../Contexts/dataContext';
import { COLORS, FONTS, SIZES } from '../../constants/Index';
import "firebase/storage";
import 'firebase/firestore';
import Firebase from '../../firebaseConfig';

const Products = ({route, navigation}) => {
    const {Store:storeData, Category:cat} = React.useContext(DataContext);
    
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodDetails, setProdDetails] = useState('');
  const [Price, setPrice] = useState('');
  const [category, setCategory] = useState('')
  const [discount, setDiscount] = useState('');
  const [store, setStore] = useState();
  const [transferred, setTransferred] = useState(0);
  const [uploading, setUploading] =useState(null);
  const [submitting, setIsSubmitting] =useState(false);

 
  const handleSubmit = async() => {
    setIsSubmitting(true)
    const productName = prodName
    const productDetails = prodDetails
    const productPrice= Price
    const productDiscount = discount

    let imgUrl = await uploadImage();
      const dbh = Firebase.firestore();
      dbh.collection("Products").doc(productName).set({
        prodId: Date.now().toString(36) + Math.random().toString(36).substr(2) + productName,
        prodname: productName,
        proddetails : productDetails,
        prodimage: [imgUrl],
        prodprice:productPrice,
        proddiscount:productDiscount,
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
        allowsEditing:true,
        allowsMultipleSelection:true
        
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
      allowsMultipleSelection:true,
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
  
      const ref = await firebase.storage().ref().child(`catImages/${filename}`);
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
             style={styles.backArrow}
             onPress = {()=> navigation.back('prodstore')}
             >
                <MaterialIcons name='arrow-back' size={24} color={COLORS.white}/>
            </TouchableOpacity>
            <View style={styles.storeMainview}>
              <View style={styles.storeSubview}>
                  <Text style={styles.storeTitle}>AddProductCategories</Text>
              </View>
          </View>
          <TouchableOpacity>                
                <MaterialCommunityIcons name= 'menu-swap-outline' size={27} color={COLORS.white}/>
          </TouchableOpacity>
        </View>
    )
}

//add category Data
function renderAddCategories(){
  return(
    <SafeAreaView style={styles.container}> 
         <Picker
          selectedValue={store}
          onValueChange={(value) => setStore(value)}
          style={[styles.input,{backgroundColor:COLORS.white,color:COLORS.black}]}
          mode="dropdown"
          itemStyle={{ color:'red', fontWeight:'900', fontSize: 18, padding:30}}>
          <Picker.Item label="Select Product Store" value="right" />
          {storeData && storeData.map((items) =>{
            return(
              <Picker.Item key={items?.storeId} multiple={true} label={items?.storeName} value={items?.storeId} />
            )
          })}
        </Picker>      
         <TextInput
          style={styles.input}
          value={prodName}
          placeholderTextColor="#fff"
          placeholder={"Product Name"}
          onChangeText={(text) => setProdName(text)}
          autoCapitalize={"none"}
      />
          <TextInput
              multiline={true}
              numberOfLines={4}
          style={styles.input}
          value={prodDetails}
          placeholderTextColor="#fff"
          placeholder={"Product Details"}
          onChangeText={(text) => setProdDetails(text)}
          autoCapitalize={"none"}
      />
                <TextInput
          style={styles.input}
          value={Price}
          placeholderTextColor="#fff"
          placeholder={"product Price"}
          keyboardType={'numbers-and-punctuation'}
          onChangeText={(text) => setPrice(text)}
          autoCapitalize={"none"}
      />
                <TextInput
          style={styles.input}
          value={discount}
          placeholderTextColor="#fff"
          placeholder={"Add Discount"}
          keyboardType={'number-pad'}
          onChangeText={(text) => setDiscount(text)}
          autoCapitalize={"none"}
      />
                 <Picker
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}
          style={[styles.input,{backgroundColor:COLORS.white,color:COLORS.black}]}
          mode="dropdown"
          itemStyle={{ color:'red', fontWeight:'900', fontSize: 18, padding:30}}>
          <Picker.Item label="Select Product Store" value="right" />
          {cat && cat.map((items) =>{
            return(
              <Picker.Item key={items?.catId} multiple={true} label={items?.catname} value={items?.catId} />
            )
          })}
        </Picker>          
    </SafeAreaView>
  )
}
//Pick Category image
function renderCatImage(){
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
      <ScrollView>        
      {renderCatImage()}
      {renderAddCategories()}
        </ScrollView>    
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

export default Products

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
