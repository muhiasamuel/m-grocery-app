import React, {  useContext, Component } from 'react';
import { View, Text, StyleSheet,Button, Image,  ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Picker, SafeAreaView, FlatList, Alert, Modal } from 'react-native';
import { Entypo, FontAwesome5, AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONTS, SIZES } from '../../../constants/Index';
import "firebase/storage";
import 'firebase/firestore';
import Firebase from '../../../firebaseConfig';
import { AuthenticatedUserContext } from '../../../AuthProvider/AuthProvider';
import PickerCheckBox from 'react-native-picker-checkbox';
import { Colors, Headline,} from 'react-native-paper';

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
      prodVisible:false,
      storeName:'',
      categoryname:'',
      modalVisible:false,
      selectedStore:'',
      qty:null,
      prods:null,
      Stocklevel:''
    }
  }
  componentDidMount() {
    this.getStoreData();
    this.getCatData();
    this.getProductsData();
   
  }
  componentWillUnmount() {
    this.getStoreData();
    this.getCatData();
    this.getProductsData();
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
        const response=Firebase.firestore().collection('Stores')
        .where('uniqie_code', '==', storeCode);
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
//delete prod
 deleteprods = async(key) => {
  const db =  Firebase.firestore().collection("Products");
  await db.doc(key).delete().then(() => {
    alert("item successfully deleted!");
}).catch((error) => {
    console.error("Error removing document: ", error);
});
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
 getProductsData = async () => {
    try{
      const dataArr = [];
    
        const response=Firebase.firestore().collection("Products")
        .orderBy("prodStoreid", "asc");
        const data=await response.get();
        data.docs.forEach(item=>{
          const {prodname, proddetails,prodprice,storeName,stocks,prodqty, imageUrls,productUnit, prodId,proddiscount,prodcatid,prodStoreid} = item.data();
          dataArr.push({
           key: item.id,
            prodname,
            prodqty,
            proddetails,
            prodprice,
            imageUrls,
            storeName,
            proddiscount,
            prodStoreid,
            prodcatid,
            prodId,
            productUnit,
            stocks
          });
          let {setProducts} = this.context;
            setProducts(dataArr)
            this.setState({
              prods:dataArr
            })
                      
            
        })
    }
    catch(e){
      console.log(e);
    }
  }

  handleSelectedStore =() =>{
    let {setProducts} = this.context;
    let prods = this.state.prods.filter(a =>a.prodStoreid == this.state.selectedStore.key)
    if (prods.length > 0) {
      console.log(prods);
        setProducts(prods) 
        this.setState({modalVisible:!this.state.modalVisible})

    }
    return ""
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
          stocks:this.state.Stocklevel,
          prodStoreid:  this.state.store,
          prodcatid:  this.state.category,
          prodprice:productPrice,
          prodqty: this.state.qty,
          productUnit: this.state.selectedValue,
          storeName:this.state.storeName,
          storeCat:this.state.categoryname,
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
        category:d.key,
        categoryname:d.catname
      })
    })
  }
  handleStoreConfirm(SItems){
    SItems.map((d) =>{
      console.log(d.key);
      this.setState({
        store:d.key,
        storeName:d.storeName
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
  renderStoreNames(){
    const { storeData} = this.context;
    const renderItem = ({item}) =>(
            <View>
              <TouchableOpacity
              onPress={() => this.setState({selectedStore:item})}
              style={{flexDirection:'row',alignItems:'center'}}
            >
              {this.state.selectedStore.storeName == item?.storeName ?
              <>
              <MaterialCommunityIcons name="check-circle-outline" size={30} color={Colors.green500} />
              </>
              :
              <>
              <Entypo name="circle" size={28} color="black" />
              
              </>
            }
              
              <Text style={{...FONTS.body4,paddingLeft:SIZES.padding2*2}} >{item?.storeName}</Text>
              </TouchableOpacity>

              
              
            </View>
        )
        return(
          <FlatList
              data={storeData}
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
  
  
 renderModal(){
   
    return(
        <Modal 
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
             <Headline>Filter Products By Store Name</Headline>
             {this.renderStoreNames()}

             <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <TouchableOpacity
                  
                  onPress={() => this.setState({modalVisible:!this.state.modalVisible})}
                >
                  <Text style={{...FONTS.body2, color:Colors.red800}}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  
                  onPress={() => this.handleSelectedStore()}
                >
                  <Text style={{...FONTS.body2, color:Colors.blue400}}>OK</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>   

        </Modal>
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
          placeholderTextColor={Colors.grey500}
          placeholder={"Product Name"}
          onChangeText={(text) => this.setState({prodname:text})}
          autoCapitalize={"none"}
      />
          <TextInput
              multiline={true}
              numberOfLines={8}
          style={styles.input}
          value={this.state.prodDetails}
          placeholderTextColor={Colors.grey500}
          placeholder={"Product Details"}
          onChangeText={(text) => this.setState({prodDetails:text})}
          autoCapitalize={"none"}
      />
      <View style={styles.pricing}>
        <TextInput
          style={[styles.input,{width:SIZES.width*0.4}]}
          value={this.state.Price}
          placeholderTextColor={Colors.grey500}
          placeholder={"product Price"}
          keyboardType={'number-pad'}
          onChangeText={(text) => this.setState({Price:text})}
          autoCapitalize={"none"}
      />
      <Text style={styles.label}>per</Text>
      <TextInput
          style={[styles.input,{width:SIZES.width*0.4}]}
          value={this.state.selectedValue}
          placeholderTextColor={Colors.grey500}
          placeholder={"Unit eg 200g, 1kg"}
          onChangeText={(text) => this.setState({selectedValue:text})}
          autoCapitalize={"none"}
      />
       
      </View>
      <View style={styles.pricing}>
      <TextInput
         style={[styles.input,{width:SIZES.width*0.30}]}
          value={this.state.qty}
          placeholderTextColor={Colors.grey500}
          placeholder={"qty eg 100, 10"}
          keyboardType={'number-pad'}
          onChangeText={(text) => this.setState({qty:text})}
          autoCapitalize={"none"}
      />
            <TextInput
         style={[styles.input,{width:SIZES.width*0.35}]}
          value={this.state.Stocklevel}
          placeholderTextColor={Colors.grey500}
          placeholder={"unit eg kg, pcs "}
          onChangeText={(text) => this.setState({Stocklevel:text})}
          autoCapitalize={"none"}
      />
                <TextInput
         style={[styles.input,{width:SIZES.width*0.30}]}
          value={this.state.discount}
          placeholderTextColor={Colors.grey500}
          placeholder={"Add Discount"}
          keyboardType={'number-pad'}
          onChangeText={(text) => this.setState({discount:text})}
          autoCapitalize={"none"}
      />

      </View>
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
      <View style={[styles.buttonContainer,{backgroundColor:COLORS.white}]}>
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

renderProdsEdit(){
  const { Products, storeid,AuthUserRole } = this.context;
  const { navigation } = this.props;
  const renderItem = ({item}) =>(
          <View style={{
            paddingVertical:2,
            flexDirection:'row',
            justifyContent:'space-around',
            alignItems:'center'}}>
           
            <Text style={[styles.storeName,{color:Colors.grey500}]}>{item?.prodname}</Text>
            {item?.imageUrls && (
              <Image style={styles.bodyphoto} source={{uri: item?.imageUrls[0].url}} />
            )}
            <Text style={[styles.storeName,{color:Colors.grey500, width:SIZES.width*0.3}]}>{item?.storeName}</Text>

                  {AuthUserRole?.role === `Admin`  ||AuthUserRole?.storeid === item?.prodStoreid ?
      
                  <View style ={{flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                    <TouchableOpacity
                     style={[styles.btnUpdateprod,{backgroundColor:Colors.blue400,paddingVertical:7,borderWidth:2,borderColor:Colors.blue900}]}
                    onPress={() => navigation.navigate('editProducts',{
                    item
                  })}
                  >
                <AntDesign name="edit" size={27} color="white" />              
                  </TouchableOpacity>
                  <TouchableOpacity
                  onPress = {() => {this.deleteprods(item?.key)}}
                  style={[styles.btnUpdateprod,{backgroundColor:Colors.red300,paddingVertical:7,borderColor:Colors.red900,borderWidth:2}]}
                  >
                  <MaterialCommunityIcons name="delete-circle" size={28} color="white" />
                  </TouchableOpacity>
                  </View>
                  :
                  <Text style={[styles.btnUpdateprod,{paddingLeft:18,backgroundColor:Colors.red700}]}>Forbidden</Text>
                    }
                  </View>
      )
      return(
        <>
                
        <View style={{
          paddingHorizontal:9,
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center'
            }}>
          <Text style={[styles.storeName,{...FONTS.h5, color:Colors.grey700}]}>ProductName</Text>
          <Text style={[styles.storeName,{...FONTS.h5, color:Colors.grey700}]}>ProdImage</Text>
          <Text style={[styles.storeName,{...FONTS.h5, color:Colors.grey700, width:SIZES.width*0.3}]}>StoreName</Text>          
          <Text style={[styles.storeName,{...FONTS.h5, color:Colors.grey700,padding:8}]}>Actions</Text>
        </View>
       
        <FlatList
            data={Products}
            keyExtractor={item => `${item.key}`}
            renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom:25,
              backgroundColor:COLORS.white
            }}
        />
        </>
      )
      }

  render() {
    const {storeData, catData} = this.context;
    
    if (this.state.isLoading) {
      return (
        <View style={{ backgroundColor:COLORS.darkblue, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={COLORS.darkblue} size='large'/>
          <Text style={{color:COLORS.darkblue}}>Loading Please Wait...</Text>
        </View>
      );
    }
    return (
        <View style={styles.screen}>
{this.state.prodVisible == true?
      <ScrollView>        
      {this.renderCatImage()}
          {this.renderAddCategories(storeData, catData)}
          <View style={{flexDirection:'row', justifyContent:'space-around'}}>
          <TouchableOpacity style ={styles.centered}
          onPress={() => this.handleSubmit()}
          >{this.state.submitting ?
            <ActivityIndicator color={COLORS.white} size='large'/>
            :
            <Text style={styles.btnUpdate}>Submit</Text>
                  }
          
          </TouchableOpacity>
          <TouchableOpacity
          style={{alignItems:'center'}}
            onPress={() => this.setState({prodVisible:!this.state.prodVisible})}
          >
          <Text style={{color:COLORS.darkblue,...FONTS.body3}}>Edit Products Data</Text> 
            <Ionicons name="md-chevron-down-circle-outline" size={28} color={COLORS.darkblue} />
          </TouchableOpacity>
          </View>
      </ScrollView>
    :
    <>
    <View style = {{flexDirection:'row',justifyContent:'space-around',backgroundColor:COLORS.white}}>
      
        
        <TouchableOpacity
          onPress={() => this.setState({modalVisible:!this.state.modalVisible})}
        >
          <Text style={{color:Colors.grey500,...FONTS.body3}}>Filter Products by store </Text>
          <View style={{alignItems:'center'}}>
            <Ionicons name="ios-filter-outline" size={30} color={Colors.grey800} />

          </View>
        </TouchableOpacity>
   
     <TouchableOpacity
        style={{alignItems:'center'}}
        onPress={() => this.setState({prodVisible:!this.state.prodVisible})}>
          <Text style={{color:Colors.grey500,...FONTS.body2}}>Add Products Data</Text> 
          <Ionicons name="md-chevron-up-circle-outline" size={30} color={Colors.grey800} />
    </TouchableOpacity>
    </View>
    {this.renderProdsEdit()}
    {this.renderModal()}
    </>
}
           
       
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
    backgroundColor:COLORS.darkgrey2,
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
    backgroundColor:Colors.lightGreen400,
    padding:SIZES.padding,
    color:COLORS.white,
    borderColor:Colors.teal300,
    borderWidth:2
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
    borderColor:Colors.teal300,
    borderWidth:0.5,
    paddingHorizontal:SIZES.padding2,
    paddingVertical:10,
    borderRadius:10,
    marginBottom: 12,    
    color:Colors.grey600,
    backgroundColor: Colors.grey50,
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
    borderColor:COLORS.white,
    borderWidth:2,
    paddingHorizontal:SIZES.padding2*5,
    paddingVertical:SIZES.padding2,
    color:'#fff',
    ...FONTS.h3,
    backgroundColor:Colors.lightBlue500,
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
  },
  storeName:{
    ...FONTS.body4,color:COLORS.darkgrey3,paddingVertical:SIZES.padding2,
    paddingHorizontal:SIZES.padding,
    
    width:SIZES.width*0.22
  },
  btnUpdateprod:{
    paddingHorizontal:SIZES.padding2,
    paddingVertical:SIZES.padding2,
    marginVertical:5,
    color:'#fff',
    ...FONTS.h5,
    backgroundColor:'skyblue',
    borderRadius:SIZES.radius*0.3
  },
  bodyphoto: {
    width:SIZES.width*0.20,
    height:SIZES.height*0.09,
    borderRadius:10


},
centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
modalView: {
  marginTop:SIZES.height*0.17,
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
button: {
  width:SIZES.width*0.2,
  position:'absolute',
  bottom:-2,
  left:0,
  borderBottomLeftRadius:20,
  borderRadius: 10,
  borderColor:COLORS.blackSecondary,
  borderWidth:1,
  padding: 10,
},
btn: {
  width:SIZES.width*0.2,
  position:'absolute',
  bottom:-2,
  right:0,
  borderBottomRightRadius:20,
  borderRadius: 10,
  borderColor:COLORS.blackSecondary,
  borderWidth:1,
  padding: 10,
},
})
