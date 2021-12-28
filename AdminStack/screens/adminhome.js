import React from 'react'
import { StyleSheet, ScrollView, View,TouchableOpacity, Text, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, ImageBackground, Image, TextInput, TouchableNativeFeedback,Modal, FlatList } from "react-native";
import firebase from 'firebase/app'
import "firebase/firestore";
import { COLORS, FONTS,  SIZES } from "../../constants/Index";
import { Entypo, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Firebase from "../../firebaseConfig";
import { AuthenticatedUserContext } from "../../AuthProvider/AuthProvider";
import { Avatar, Colors, Title,Badge,Headline,  } from "react-native-paper";

const Adminhome = ({navigation}) => {
  const {setstoreid,storeid, AuthUserRole,setStoreData, storeData} = React.useContext(AuthenticatedUserContext);
  const [storeCode, setStoreCode] = React.useState(null);
  const [isLoading, setIsLoading] =React.useState(false);
  const [item, setitem] = React.useState(null)
  const [selectedStore ,setSelectedStore] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [storeModalVisible, setStoreModalVisible] = React.useState(false);
  const auth = Firebase.auth();

  const LogOutUser = async function() {
    try {
        await auth.signOut();
      } catch (error) {
        console.log(error);
      }
}
React.useEffect(() =>{
  getStoreData();
},[])

//fetching store data from firestore
const getStoreData = async () => {
  try{
    const dataArr = [];
      const response=Firebase.firestore().collection('Stores');
      const data= await response.get();
      data.docs.forEach(item=>{
        const {storeName,uniqie_code } = item.data();
        dataArr.push({
          key: item.id,
          uniqie_code,
          storeName,
        });
        setStoreData(dataArr)
      })
  }
  catch(e){
    console.log(e);
  }
}

//
const handlestore =()=>{
  setstoreid(selectedStore?.key);
  setStoreCode(selectedStore?.uniqie_code);
  setStoreModalVisible(!storeModalVisible)
}

const handleSelectedStore = async() =>{
  setIsLoading(true) 
  if (storeCode === null) {
    alert('You need to enter a value to continue')
  }else{
    try{
      const itemsArr = [];
      await Firebase.firestore()
      .collection('Stores')
      .where('uniqie_code', '==', storeCode)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(doc =>{ 
          if (!doc.empty) {          
            setstoreid(doc.id);
            setIsLoading(false) 
            setModalVisible(!modalVisible)
        }else{
            // doc.data() will be undefined in this case           
            setstoreid(null);
            setStoreCode(null);
            setIsLoading(false) 
            alert("Your Code is Incorrect!! Store does not exist");
        }
                  
        })
      })
    }
    catch(e){
      console.log(e);
    }  
  }
}
//navigate to customer orders if store code is not empty
const navigateToOrders = () =>{  
    navigation.navigate("CustomersOrders")  
}
function handleClose() {
  if (storeCode === null) {
    alert(`Add storeCode to close this Modal`)
  } else {
    if (storeid == null) {
      alert(`Add a correct store code first `)
      setIsLoading(false)
    } else {
      setModalVisible(!modalVisible);
    }
    
  }
}
//store data
//Store Code For User admin
function viewStore() {
  if (storeData === null) {
    getStoreData()
  } else { 
    setStoreModalVisible(!storeModalVisible);
  }
}
function renderModal(){
  return(
          <Modal 
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
               <Headline style={{marginVertical:10,paddingHorizontal:15, textAlign:'center'}}>Enter Store Unique Code To Continue!!</Headline>
               <TextInput
                  style={styles.input}
                  value={storeCode}
                  placeholderTextColor={Colors.grey500}
                  placeholder={"Store Unique Code"}
                  onChangeText={(text) => setStoreCode(text)}
                  autoCapitalize={"none"}
              />
               <View style={{flexDirection:'row', justifyContent:'space-between',
               paddingHorizontal:30, alignItems:'center'}}>
                  <TouchableOpacity
                    
                    onPress={() =>handleClose()}
                  >
                    <Text style={{...FONTS.body2, color:Colors.red300,fontWeight:'bold'}}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSelectedStore()}
                  >
                    {isLoading?
                    
                    <ActivityIndicator color={COLORS.darkblue} size='large'/>
                  :
                  <Text style={{...FONTS.body2, color:Colors.blue300,fontWeight:'bold'}}>Continue</Text>
                  }
                  
                  </TouchableOpacity>
                </View>
  
              </View>
            </View>   
  
          </Modal>
      )
  }
  
  //store modal
  function renderStoreModal(){   
    return(
        <Modal 
        animationType="fade"
        transparent={true}
        visible={storeModalVisible}
        >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, {height:SIZES.height*0.4}]}>
             <Headline  style={{marginVertical:10,paddingHorizontal:15, textAlign:'center'}}>Check to Switch Store</Headline>
             {renderStore()}

             <View style={{flexDirection:'row', justifyContent:'space-between',
               paddingHorizontal:30, alignItems:'center'}}>
                <TouchableOpacity
                  
                  onPress={() => setStoreModalVisible(!storeModalVisible)}
                >
                  <Text style={{...FONTS.body2, color:Colors.red800}}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  
                  onPress={() => handlestore()}
                >
                  <Text style={{...FONTS.body2, color:Colors.blue400}}>OK</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>   

        </Modal>
    )
}
//selected store
function renderStore(){
  const renderItem = ({item}) =>(
          <View >
            <TouchableOpacity
            onPress={() => setSelectedStore(item)}
            style={{flexDirection:'row',alignItems:'center', justifyContent:'space-evenly'}}
          >
            <View style={{width:SIZES.width*0.1}}>
            {selectedStore?.storeName  == item?.storeName  ?
            <>
            <MaterialCommunityIcons name="check-circle-outline" size={30} color={Colors.green500} />
            </>
            :
            <>
            <Entypo name="circle" size={28} color="black" />
            
            </>
          }
          </View>
            
            <Text style={{...FONTS.body4,paddingLeft:SIZES.padding2*2, width:SIZES.width*0.5}} >{item?.storeName}</Text>
            <Text style={{...FONTS.body4,paddingLeft:SIZES.padding2*2, width:SIZES.width*0.3}} >{item?.uniqie_code}</Text>
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

  function renderHeader(){
    return(
        <View style={styles.headerView}>
            <View style={styles.storeMainview}>
              <View style={styles.storeSubview}>
                  <Text style={styles.storeTitle}>Home</Text>
              </View>
          </View>
          <TouchableOpacity
          onPress={() =>LogOutUser()}
            style={{paddingRight:SIZES.padding}}

          >                 
          <FontAwesome5 name="sign-out-alt" size={24} color="white" /> 
         </TouchableOpacity>
        </View>
    )
}

  function renderCards(){
    return(
      <View style={styles.cardView}>
        <View style={styles.cardrow}>
          <TouchableOpacity
          style={styles.storeswitchbtn}
            onPress = {() => {setModalVisible(!modalVisible); setIsLoading(false)}}
          >
            <Text style={[styles.textStyle,{fontSize:18}]}>switch to another store</Text>
          </TouchableOpacity>
          {
                  AuthUserRole?.role === `Admin`?
                  <TouchableOpacity
                  style={styles.storeswitchbtn}
                    onPress = {() => viewStore()}
                  >
                    <Text style={[styles.textStyle,{fontSize:20}]}>Store Codes</Text>
                  </TouchableOpacity>
          :
          <Text></Text>
          }
        </View>
        <View style={styles.cardrow}>
          <TouchableOpacity style ={[styles.pannels, {backgroundColor:Colors.teal200}]}
            onPress={()=> navigation.navigate("store")}
          >
            <Title style={styles.titleText}>  Stores</Title>
            <View style={styles.card}>
               <Text style={styles.text}>All stores</Text>
               <Badge>7</Badge>
            </View>
            <Fontisto name="shopping-store" size={28} color="black" />
            <View style={styles.card}>
                <Text>see More Here</Text>
                <Ionicons name='arrow-forward-circle' size={26} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style ={[styles.pannels, {backgroundColor:Colors.yellow800}]}
          onPress={()=> navigation.navigate("Categories")}
          >
            <Title style={styles.titleText}>Product Categories</Title>
            <View style={styles.card}>
               <Text style={styles.text}>Categories</Text>
               <Badge>15</Badge>
            </View>
            <MaterialIcons name="category" size={28} color="black" />
            <View style={styles.card}>
                <Text>see More Here</Text>
                <Ionicons name='arrow-forward-circle' size={26} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.cardrow}>
          <TouchableOpacity style ={[styles.pannels, {backgroundColor:Colors.lightBlue200}]}
          onPress={()=> navigation.navigate("products")}
          >
            <Title style={styles.titleText}>Products</Title>
            <View style={styles.card}>
               <Text style={styles.text}>All Products</Text>
               <Badge>63</Badge>
            </View>
            <FontAwesome name="product-hunt" size={28} color={Colors.pink900} />
            <View style={styles.card}>
                <Text>see More Here</Text>
                <Ionicons name='arrow-forward-circle' size={26} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style ={[styles.pannels, {backgroundColor:Colors.green200}]}
                    onPress={()=> navigation.navigate("users")}

          >
            <Title style={styles.titleText}>Deliverly</Title>
            <View style={styles.card}>
               <Text style={styles.text}>Delivery Persons</Text>
               <Badge>18</Badge>               
            </View>
            <MaterialCommunityIcons name="truck-delivery" size={30} color={Colors.grey900} />
            <View style={styles.card}>
                <Text>see More Here</Text>
                <Ionicons name='arrow-forward-circle' size={26} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.cardrow}>
          <TouchableOpacity style ={[styles.pannels, {backgroundColor:Colors.cyan500}]}
            onPress={() => navigateToOrders()}

          >
            <Title style={styles.titleText}>new Orders</Title>
            <View style={styles.card}>
               <Text style={styles.text}>New Orders</Text>
               <Badge>3</Badge>
            </View>
            <View style={styles.card}>
            <Foundation name="burst-new" size={35} color="blue" />
            <MaterialIcons name="local-grocery-store" size={28} color="black" />
            </View>
            
            <View style={styles.card}>
                <Text>see More Here</Text>
                <Ionicons name='arrow-forward-circle' size={26} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style ={[styles.pannels, {backgroundColor:Colors.orange300}]}
            onPress={() => navigateToOrders()}
          >
            <Title style={styles.titleText}>Completed Orders</Title>
            <View style={styles.card}>
               <Text style={styles.text}>Delivered Orders</Text>
               <Badge>37</Badge>
               
            </View>
            <View style={styles.card}>
            <Ionicons name="checkmark-done-circle-outline" size={28} color="black" />
            <MaterialIcons name="local-grocery-store" size={28} color="green" />
            </View>
            <View style={styles.cardrow}>
                <Text>see More Here</Text>
                <Ionicons name='arrow-forward-circle' size={26} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <TouchableOpacity style ={[styles.pannels,{backgroundColor:Colors.orange300}]}
             onPress={()=> navigation.navigate("stocks")}

          >
            <Title style={styles.titleText}>Stock Levels</Title>
            <Ionicons name="md-shield-checkmark-sharp" size={28} color="black" />
          </TouchableOpacity>
          
        </View>
        
      </View>
    )

  }

    return (
      <View style={styles.center}>       
        {renderHeader()}        
        <ScrollView>        
          {renderCards()}          
      </ScrollView>
      {renderModal()}
      {renderStoreModal()}

      </View>
    )
}

export default Adminhome

const styles = StyleSheet.create({
    center: {
        flex: 1,
        backgroundColor:COLORS.backgroundColor
      },
      headerView: {
        padding:SIZES.padding*0.5,
        flexDirection:"row", 
        backgroundColor:COLORS.darkblue,
        marginBottom:2
    },
    storeMainview: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center'
    },
    storeSubview: {
        marginBottom:9,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: SIZES.radius
    },
    storeTitle: {
        ...FONTS.h2, 
        fontWeight:'bold',
        color:COLORS.white, 
        fontStyle:'normal'
    },
      cardView:{
        paddingVertical:SIZES.padding*0.1,
        width:SIZES.width*0.99,
        borderColor:Colors.grey500,
        borderWidth:0.1
      },
      titleText: {
        alignSelf:'center',
        ...FONTS.body3,
        fontWeight:'bold',
        fontSize:18,
        color:Colors.grey50
      },
      text:{
        color:Colors.grey50,
        fontWeight:'bold',
        ...FONTS.body4
      },
      pannels:{
        width:SIZES.width*0.46,
        paddingVertical:SIZES.padding2*2,
        paddingHorizontal:SIZES.padding,
        borderColor:Colors.grey400,
        borderWidth:1,
        backgroundColor:Colors.grey300

        
      },
      cardrow:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:5
      },
      card:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:5,
        padding:3
      },
      centeredView: {
        flex:1,
          alignItems: "center",
          justifyContent:'flex-end'

        },
        modalView: {
          bottom:SIZES.height*0.1,
          width:SIZES.width*0.99,
             height:SIZES.height*0.30,     
          backgroundColor:  'rgb(250, 255, 255)',
          borderRadius: 0,
          padding: 3,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5
        },
        input: {
          alignSelf:'center',
          width:SIZES.width*0.80,
          borderColor:Colors.teal300,
          borderWidth:0.5,
          paddingHorizontal:SIZES.padding2,
          paddingVertical:10,
          borderRadius:10,
          margin: 12,    
          color:Colors.grey600,
          backgroundColor: Colors.grey300,
        },
        label: {
          color:COLORS.darkblue,
          ...FONTS.h3,
        },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      storeswitchbtn: {
        backgroundColor:Colors.blue300,
        paddingHorizontal:SIZES.padding2,
        paddingVertical:7,
        borderRadius:5,
        borderColor:Colors.cyan600,
        borderWidth:1
      },

})
