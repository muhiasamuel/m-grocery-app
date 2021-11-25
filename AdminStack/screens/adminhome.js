import React from 'react'
import { StyleSheet, ScrollView, View,TouchableOpacity, Text, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, ImageBackground, Image, TextInput, TouchableNativeFeedback,Modal } from "react-native";
import firebase from 'firebase/app'
import "firebase/firestore";
import { COLORS, FONTS,  SIZES } from "../../constants/Index";
import { Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Firebase from "../../firebaseConfig";
import { AuthenticatedUserContext } from "../../AuthProvider/AuthProvider";
import { Avatar, Colors, Title,Badge,Headline,  } from "react-native-paper";

const Adminhome = ({navigation}) => {
  const {setstoreid} = React.useContext(AuthenticatedUserContext);
  const [storeCode, setStoreCode] = React.useState(null);
  const [isLoading, setIsLoading] =React.useState(false);
  const [item, setitem] = React.useState(null)
  const [modalVisible, setModalVisible] = React.useState(false);
  const auth = Firebase.auth();

  const LogOutUser = async function() {
    try {
        await auth.signOut();
      } catch (error) {
        console.log(error);
      }
}
React.useEffect(() =>{
  setTimeout(()=>{
    setModalVisible(!modalVisible);
  }, 3000)
},[])

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
        querySnapshot.forEach((doc) =>{ 
          if (!doc.empty) {
            setstoreid(doc.id);
            setIsLoading(false) 
            setModalVisible(!modalVisible)
        }else{
            // doc.data() will be undefined in this case           
            setstoreid(null);
            setIsLoading(false) 
            alert("Your Code is Incorrect!!");
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
  if (storeCode === null) {
    setModalVisible(!modalVisible);
  } else {
    navigation.navigate("CustomersOrders")
  }
}
function handleClose() {
  if (storeCode === null) {
    alert(`Add storeCode to close this Modal`)
  } else {
    setModalVisible(!modalVisible);
  }
}
//store data
function renderModal(){
  return(
          <Modal 
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
               <Headline>Enter Store Unique Code To Continue!!</Headline>
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
          <TouchableOpacity style ={[styles.pannels, {backgroundColor:Colors.teal600}]}
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
          <TouchableOpacity style ={[styles.pannels, {backgroundColor:Colors.blue900}]}
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
          <TouchableOpacity style ={[styles.pannels, {backgroundColor:Colors.lightBlue600}]}
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
          <TouchableOpacity style ={[styles.pannels, {backgroundColor:Colors.green700}]}
                    onPress={()=> navigation.navigate("users")}

          >
            <Title style={styles.titleText}>Deliverly</Title>
            <View style={styles.card}>
               <Text style={styles.text}>Delivery Persons</Text>
               <Badge>18</Badge>               
            </View>
            <MaterialCommunityIcons name="truck-delivery" size={30} color={Colors.grey700} />
            <View style={styles.card}>
                <Text>see More Here</Text>
                <Ionicons name='arrow-forward-circle' size={26} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.cardrow}>
          <TouchableOpacity style ={[styles.pannels, {backgroundColor:Colors.deepOrange300}]}
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
          <TouchableOpacity style ={[styles.pannels, {backgroundColor:Colors.orange900}]}
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
          <TouchableOpacity style ={styles.pannels}
             onPress={()=> navigation.navigate("stocks")}

          >
            <Title style={styles.titleText}>Stock Levels</Title>
            <Ionicons name="md-shield-checkmark-sharp" size={28} color="black" />
          </TouchableOpacity>
          <View style ={styles.pannels}>
            <Title style={styles.titleText}>dddddddddd</Title>
          </View>
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
        ...FONTS.h4,
        color:Colors.grey100
      },
      text:{
        color:Colors.grey300,
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
          bottom:SIZES.height*0.3,
          width:SIZES.width*0.9,
             height:SIZES.height*0.25,     
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
      }
})
