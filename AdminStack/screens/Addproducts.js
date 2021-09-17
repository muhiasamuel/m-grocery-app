import React, {  useContext, Component } from 'react';
import useState from 'react-usestateref'
import { View, Text, StyleSheet,Button, Image,  ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Picker, SafeAreaView, FlatList, Alert } from 'react-native';
import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SIZES } from '../../constants/Index';
import "firebase/storage";
import 'firebase/firestore';
import Firebase from '../../firebaseConfig';
import { AuthenticatedUserContext } from '../../AuthProvider/AuthProvider';
import PickerCheckBox from 'react-native-picker-checkbox';

export default class Products extends Component {
static contextType = AuthenticatedUserContext;

  constructor (props) {
    
    super(props)
    
    this.state = {
      photos: [],
      pickedImagePath: null,
      prodName:'',
      prodDetails:'',
      Price:'',
      category:'',
      store: '',
      discount: '',
      submitting:false,
      selectedValue: '',
      isLoading:false,
    }
  }
  componentDidMount() {
    this.getStoreData();
    this.getCatData();
   
  }
  componentWillUnmount() {
    this.getStoreData();
    this.getCatData();
  }
  componentDidUpdate() {
    const {params} = this.props.route;
    if (params) {
      const {photos} = params;
      if (photos) this.setState({photos});
      delete params.photos;
    }
  }

   getStoreData = async () => {
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
          let {setStoreData} = this.context
          setStoreData(dataArr)
          this.setState({
            isLoading:false
          })
        })
    }
    catch(e){
      console.log(e);
    }
  }


  getCatData = async () => {
    try{
      const catArr = [];
        const response=Firebase.firestore().collection('ProductCategories');
        const data=await response.get();
        data.docs.forEach(item=>{
          const {catdetails, catname,catId, catimage} = item.data();
          catArr.push({
            key: item.id,
            catdetails,
            catId,
            catname,
            catimage,
          });
          let {setCatData} = this.context;
          setCatData(catArr)
          this.setState({
            isLoading:false
          })
        })
    }
    catch(e){
      console.log(e);
    }
  }

 handleSubmit = async() => {
   this.setState({submitting: true})
    const productName = this.state.prodname
    const productDetails =  this.state.prodDetails
    const productPrice=  this.state.Price
    const productDiscount =  this.state.discount
    const docId = Firebase.firestore().collection("Products").doc().id
     
        await Firebase.firestore().collection("Products").doc(docId).set({
          prodId: Date.now().toString(36) + Math.random().toString(36).substr(2), 
          prodname: productName,
          proddetails : productDetails,
          prodStoreid:  this.state.store,
          prodcatid:  this.state.category,
          prodprice:productPrice,
          productUnit: this.state.selectedValue,
          proddiscount:productDiscount,
          createdAt: Date.now()
        }).then(async() => {
          this.uploadImage(docId)
         
          alert('data updated');
        })    
  }    
  handlecatConfirm(CItems){  
    CItems.map((d) =>{
      console.log(d.key);
      this.setState({
        category:d.key
      })
    })
  }
  handleStoreConfirm(SItems){
    SItems.map((d) =>{
      console.log(d.key);
      this.setState({
        store:d.key
      })
    })    
  }

   getPictureBlob = (uri) => {
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



 uploadImage = (docId) => {
    const promises = [];
    let refURL;
    const updatedURL = [];  
    this.state.photos.map( async (file, key) => {
        let blob;
        this.setState({
          uploading:true
        })
        blob = await this.getPictureBlob(file.uri);

       const metadata = {
        contentType: file.type,
      };
        const ref = Firebase.storage().ref().child(`products/${file.name}`);
        const task = await ref.put(blob, metadata);
        promises.push(task)
        try {      
        const url =  await task.ref.getDownloadURL(); 
        let testURL = { url }
        refURL = { ...refURL, testURL, key:key }
        updatedURL.push(testURL) 
        this.setState({
          uploading:false,
            submitting:false
        }) // setPickedImagePath     
        console.log(updatedURL);
        Firebase.firestore().collection('Products').doc(docId).set({
          imageUrls:updatedURL
        }, {merge: true});
        alert("saved successfully");
      } catch (e) {
        alert(e);
        console.log(e);
         this.setState({
          uploading:false,
          submitting:false
        }) 
      }
    })

  };
  
  
 renderHeader(){
   
    return(
        <View style={styles.headerView}>
            <TouchableOpacity
             style={styles.backArrow}
             onPress = {()=> this.uploadImage()}
             >
                <MaterialIcons name='arrow-back' size={24} color={COLORS.white}/>
            </TouchableOpacity>
            <View style={styles.storeMainview}>
              <View style={styles.storeSubview}>
                  <Text style={styles.storeTitle}>Add Products</Text>
              </View>
          </View>
          <TouchableOpacity>                
                <MaterialCommunityIcons name= 'menu-swap-outline' size={27} color={COLORS.white}/>
          </TouchableOpacity>
        </View>
    )
}

 renderAddCategories(storeData, catData){
  return(
    <SafeAreaView style={styles.container}>
       <View style={styles.CheckBox}> 
          <PickerCheckBox
          data={storeData}
          headerComponent={<Text style={{fontSize:25}} >Stores</Text>}
          ConfirmButtonTitle='OK'
          DescriptionField='storeName'
          KeyField='key'
          OnConfirm={(SItems) => this.handleStoreConfirm(SItems)}
          placeholderSelectedItems    
          placeholder='select Store'
          arrowColor='#FFD740'
          arrowSize={10}
          placeholderSelectedItems ='$count selected item(s)'
          /> 
        </View>    
         <TextInput
          style={styles.input}
          value={this.state.prodname}
          placeholderTextColor="#fff"
          placeholder={"Product Name"}
          onChangeText={(text) => this.setState({prodname:text})}
          autoCapitalize={"none"}
      />
          <TextInput
              multiline={true}
              numberOfLines={8}
          style={styles.input}
          value={this.state.prodDetails}
          placeholderTextColor="#fff"
          placeholder={"Product Details"}
          onChangeText={(text) => this.setState({prodDetails:text})}
          autoCapitalize={"none"}
      />
      <View style={styles.pricing}>
        <TextInput
          style={[styles.input,{width:SIZES.width*0.4}]}
          value={this.state.Price}
          placeholderTextColor="#fff"
          placeholder={"product Price"}
          keyboardType={'number-pad'}
          onChangeText={(text) => this.setState({Price:text})}
          autoCapitalize={"none"}
      />
      <Text style={styles.label}>per</Text>
      <TextInput
          style={[styles.input,{width:SIZES.width*0.4}]}
          value={this.state.selectedValue}
          placeholderTextColor="#fff"
          placeholder={"Unit eg 200g, 1kg"}
          onChangeText={(text) => this.setState({selectedValue:text})}
          autoCapitalize={"none"}
      />
       
      </View>
                <TextInput
          style={styles.input}
          value={this.state.discount}
          placeholderTextColor="#fff"
          placeholder={"Add Discount"}
          keyboardType={'number-pad'}
          onChangeText={(text) => this.setState({discount:text})}
          autoCapitalize={"none"}
      />
      <View style={styles.CheckBox}>
        <PickerCheckBox
          data={catData}
          headerComponent={<Text style={{fontSize:25}} >Available Categories</Text>}
          ConfirmButtonTitle='OK'
          DescriptionField='catname'
          KeyField='key'
          OnConfirm={(CItems) => this.handlecatConfirm(CItems)}    
          placeholder='Select Product Category'
          arrowColor='#FFD740'
          arrowSize={15}
          placeholderSelectedItems ='$count selected Category(s)'
          /> 
      </View>           
    </SafeAreaView>
  )
}

 renderImage = ({item}) => (
  
  <Image
   style={styles.image}
    source={{ uri: item.uri }}
   
  />
)

 renderCatImage(){
  const { navigation } = this.props;
  return(
    <>
    
      <View style={{ flex:1}}>
      <View style={styles.buttonContainer}>
         <Text style={[styles.label,{width: SIZES.width*0.35}]}>Add Product Image:</Text>
      <TouchableOpacity
           onPress={() =>navigation.navigate('ImageBrowser')}
        >
          <Text style={styles.btbbtn}>OPEN IMAGE GALLERY</Text>
        </TouchableOpacity>
 
      </View> 
      { this.state.photos !== '' &&(
        <View style={{flexDirection:'row' ,width:SIZES.width*0.98, backgroundColor:COLORS.white}}>
         <FlatList
          horizontal
          showshorizontalScrollIndicator={false}
          data={this.state.photos}
          renderItem={this.renderImage}
          keyExtractor={item => `${item.name}`}         
       
        />
        </View>)} 
      </View>
   
    </>      

  )
}

  render() {
    const {storeData, catData} = this.context;
    
    if (this.state.isLoading) {
      return (
        <View style={{ backgroundColor:COLORS.darkblue, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={COLORS.white} size='large'/>
          <Text style={{color:COLORS.white}}>Loading Please Wait...</Text>
        </View>
      );
    }
    return (
        <View style={styles.screen}>
        {this.renderHeader()} 
  
      
        <ScrollView>        
        {this.renderCatImage()}
            {this.renderAddCategories(storeData, catData)}
            <TouchableOpacity style ={styles.centered}
            onPress={() => this.handleSubmit()}
            >{this.state.submitting ?
              <ActivityIndicator color={COLORS.white} size='large'/>
              :
              <Text style={styles.btnUpdate}>Submit</Text>
                    }
            
            </TouchableOpacity>
        </ScrollView>    
       
      </View>
    )
  }
}
/*
const Products = ({route, navigation}) => {
     
  const [pickedImagePath, setPickedImagePath] = useState([]);
  const [photos, setphotos, photosref] = useState([]);
  const [prodName, setProdName] = useState('');
  const [prodDetails, setProdDetails] = useState('');
  const [Price, setPrice] = useState('');
  const [category, setCategory] = useState([])
  const [store, setStore] = useState([]);
  const [discount, setDiscount] = useState('');
  const [transferred, setTransferred] = useState(0);
  const [uploading, setUploading] =useState(null);
  const [submitting, setIsSubmitting] =useState(false);
  const [selectedValue, setSelectedValue] =  useState('');

  const {storeData, setStoreData, catData, setCatData} = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] =React.useState(true);
  
  React.useEffect(() =>{
    getCatData();
    getStoreData();
    const {params} = route;
    if (params) {
      const {photos} = params;
      if (photos) setphotos(photos);
      delete params.photos}
 
  },[])


  const getStoreData = async () => {
    try{
      const dataArr = [];
        const response=Firebase.firestore().collection('Stores');
        const data=await response.get();
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
          setIsLoading(false)
        })
    }
    catch(e){
      console.log(e);
    }
  }

  const getCatData = async () => {
    try{
      const catArr = [];
        const response=Firebase.firestore().collection('ProductCategories');
        const data=await response.get();
        data.docs.forEach(item=>{
          const {catdetails, catname,catId, catimage} = item.data();
          catArr.push({
            key: catId,
            catdetails,
            catname,
            catimage,
          });
          setCatData(catArr)
          setIsLoading(false)
        })
    }
    catch(e){
      console.log(e);
    }
  }
  const handleSubmit = async() => {
    setIsSubmitting(true)
    const productName = prodName
    const productDetails = prodDetails
    const productPrice= Price
    const productDiscount = discount
    await uploadImage();
      const dbh = Firebase.firestore();
      dbh.collection("Products").add({
        prodId: Date.now().toString(36) + Math.random().toString(36).substr(2) + productName,
        prodname: productName,
        proddetails : productDetails,
        prodStore: store,
        prodcat: category,
        prodprice:productPrice,
        productUnit:selectedValue,
        proddiscount:productDiscount,
        prodimage: pickedImagePath,
        createdAt: Date.now()
      }).then(() => {
        setIsSubmitting(false)
        console.log('data updated');
      }) 

  }


  
  function handlecatConfirm(CItems){  
    const obj = Object.assign({}, CItems);
    setCategory(obj); 
  }
  function handleStoreConfirm(SItems){
    const obj = Object.assign({}, SItems);
    setStore(obj);
    
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
    const promises = [];
    photos.forEach( async (file) => {
        let blob;
      
        setUploading(true);
        blob = await getPictureBlob(file.uri);

       const metadata = {
        contentType: file.type,
      };
      const time = Date.now();
        const ref = await Firebase.storage().ref().child(`products/${file.name}`);
        const task = await ref.put(blob, metadata);
        promises.push(task);
        try {          
        await task;
        const url =  await task.ref.getDownloadURL(); 
        const uri =JSON.parse(JSON.stringify({url}))      
        setTransferred(0)
        setUploading(false); 
        let urlarray=[];       
        setPickedImagePath( urlarray.push(url));
        
       // setPickedImagePath
        alert("saved successfully");
      } catch (e) {
        alert(e);
        console.log(e);
        setUploading(false);
      }
    })
    Promise.all(promises)
    .then(() => alert('All files uploaded'))
    .catch(err => console.log(err.code));

  };
  console.log(pickedImagePath);

  //header
  function renderHeader(){
    return(
        <View style={styles.headerView}>
            <TouchableOpacity
             style={styles.backArrow}
             onPress = {()=> uploadImage()}
             >
                <MaterialIcons name='arrow-back' size={24} color={COLORS.white}/>
            </TouchableOpacity>
            <View style={styles.storeMainview}>
              <View style={styles.storeSubview}>
                  <Text style={styles.storeTitle}>Add Products</Text>
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
              numberOfLines={8}
          style={styles.input}
          value={prodDetails}
          placeholderTextColor="#fff"
          placeholder={"Product Details"}
          onChangeText={(text) => setProdDetails(text)}
          autoCapitalize={"none"}
      />
      <View style={styles.pricing}>
        <TextInput
          style={[styles.input,{width:SIZES.width*0.4}]}
          value={Price}
          placeholderTextColor="#fff"
          placeholder={"product Price"}
          keyboardType={'number-pad'}
          onChangeText={(text) => setPrice(text)}
          autoCapitalize={"none"}
      />
      <Text style={styles.label}>per</Text>
      <TextInput
          style={[styles.input,{width:SIZES.width*0.4}]}
          value={selectedValue}
          placeholderTextColor="#fff"
          placeholder={"Unit eg 200g, 1kg"}
          onChangeText={(text) => setSelectedValue(text)}
          autoCapitalize={"none"}
      />
       
      </View>
                <TextInput
          style={styles.input}
          value={discount}
          placeholderTextColor="#fff"
          placeholder={"Add Discount"}
          keyboardType={'number-pad'}
          onChangeText={(text) => setDiscount(text)}
          autoCapitalize={"none"}
      />
      <View style={styles.CheckBox}>
        <PickerCheckBox
          data={catData}
          headerComponent={<Text style={{fontSize:25}} >Available Categories</Text>}
          ConfirmButtonTitle='OK'
          DescriptionField='catname'
          KeyField='key'
          OnConfirm={(CItems) => handlecatConfirm(CItems)}    
          placeholder='Select Product Category'
          arrowColor='#FFD740'
          arrowSize={15}
          placeholderSelectedItems ='$count selected Category(s)'
          /> 
      </View>           
    </SafeAreaView>
  )
}
const renderImage = ({item}) => (
  
    <Image
     style={styles.image}
      source={{ uri: item.uri }}
     
    />
  )

//Pick Category image
function renderCatImage(){

  return(
    <>
    
      <View style={{ flex:1}}>
      <View style={styles.buttonContainer}>
         <Text style={[styles.label,{width: SIZES.width*0.35}]}>Add Product Image:</Text>
      <TouchableOpacity
           onPress={() =>navigation.navigate('ImageBrowser')}
        >
          <Text style={styles.btbbtn}>OPEN IMAGE GALLERY</Text>
        </TouchableOpacity>
 
      </View> 
      { photos !== '' &&(
        <View style={{flexDirection:'row' ,width:SIZES.width*0.98, backgroundColor:COLORS.white}}>
         <FlatList
          horizontal
          showshorizontalScrollIndicator={false}
          data={photos}
          renderItem={renderImage}
          keyExtractor={item => `${item.name}`}         
       
        />
        </View>)} 
      </View>
   
    </>      

  )
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
      <View style={styles.screen}>
      {renderHeader()} 

    
      <ScrollView>        
      {renderCatImage()}
          {renderAddCategories()}
          <TouchableOpacity style ={styles.centered}
          onPress={() => handleSubmit()}
          >{submitting ?
            <ActivityIndicator color={COLORS.white} size='large'/>
            :
            <Text style={styles.btnUpdate}>Submit</Text>
                  }
          
          </TouchableOpacity>
      </ScrollView>    
     
    </View>
    )
}

export default Products*/

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
    justifyContent:'space-around'
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
    marginHorizontal:SIZES.padding2*0.2,
    marginVertical:SIZES.padding2*0.5,
    borderRadius:10,
    padding:4,
    width: 83,
    height: 80,
    resizeMode: 'cover'
  },
  input: {
    width:SIZES.width*0.95,
    borderColor:COLORS.darkgrey,
    borderWidth:0.5,
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
    borderColor:COLORS.white,
    borderWidth:2,
    paddingHorizontal:SIZES.padding2*5,
    paddingVertical:SIZES.padding2,
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
  },
  pricing: {
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center'
  },
  CheckBox: {
    width: SIZES.width*0.95,
    borderWidth:0.5,
    borderColor:COLORS.darkgrey4,
    borderRadius:10,
    marginVertical:10
  }
  
})
