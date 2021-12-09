import { AntDesign, Entypo, EvilIcons, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons'
import React, { useContext, useState } from 'react'
import { Alert, FlatList, Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AuthenticatedUserContext } from '../AuthProvider/AuthProvider'
import { COLORS, FONTS, images, SIZES } from '../constants/Index'
import Firebase from '../firebaseConfig'
import "firebase/auth"
import 'firebase/firestore';
import * as Location from 'expo-location';
import * as geofire from 'geofire-common';
import * as Linking from 'expo-linking';
import { Colors, Searchbar } from 'react-native-paper'
const Home = ({navigation}) => {
    //DUMMY DATA

const { user } = useContext(AuthenticatedUserContext);
const {storeData,setStoreData} = useContext(AuthenticatedUserContext);
const [modalVisible,setModalVisible] = React.useState(false);
const [region, setRegion] = useState({});
const [lat, setlat] = useState();
const [long, setlong] = useState();
const [filteredStoreData, setfilteredStoreData] = React.useState('');

const auth = Firebase.auth();

React.useEffect(() => {
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
  getStoreData();
  const prevLat = storeData.lat;
  const prevLong = storeData.lng;

}, [])
function updateState(location) {
  setRegion(location.coords)
}

const getStoreData = async () => {
 
  
    try{
      const dataArr = [];
        const response=Firebase.firestore().collection('Stores')
        .orderBy('geohash');
        const data=await response.get()
        data.docs.forEach(item=>{
          const {storeName,lat,lng, storeDetails,storeLocation, storeimage} = item.data();
          dataArr.push({
            key: item.id,
            storeName,
            lat,
            lng,
            storeDetails,
            storeLocation,
            storeimage
          });
          setStoreData(dataArr);
          setfilteredStoreData(dataArr);
        })
    }
    catch(e){
      console.log(e);
    }
  }
 const LogOutUser = async function() {
    try {
        await auth.signOut();
      } catch (error) {
        console.log(error);
      }
}
function searchStores(query){
  setfilteredStoreData(
    storeData.filter(i=>i.storeName
      .toLowerCase()
      .includes(query
        .toLowerCase()
        )
        ));
}

function handleCheckOrder() {
   navigation.navigate("orderstatus")
   setModalVisible(!modalVisible); 
}
function renderWidget(){
    return(
        <View >
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}>
                   <View styles={styles.OrderIncrementView}>
                    <TouchableOpacity
                    styles={styles.OrderIncrement} 
                        onPress={() => setModalVisible(!modalVisible)}
                      >
                        <Ionicons style={{left: SIZES.width*0.48,top:22}} name='close-outline' size ={32} color={COLORS.white} />
                        
                      </TouchableOpacity>
                    </View>
                <View style={styles.centeredView}>
               
                  <View style={styles.modalView}> 
                  <View style={styles.userImageView}>
                    <Image
                      source={images.user}
                      style={styles.userImage}
                    />
                  </View>
                  <View style={styles.modalContent}>
                 
                    <TouchableOpacity
                      style={[ styles.buttonClose]}
                      onPress = {() =>handleCheckOrder()}         
                    >
                      <Entypo name="eye" size={24} color="white" />
                      <Text style={styles.textModal}>ORDER TRACK</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={[ styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <MaterialIcons name="account-box" size={24} color="white" />
                      <Text style={styles.textModal}> MY ACCOUNT </Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={[ styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Ionicons name="md-notifications-circle-outline" size={28} color="white" />
                      <Text style={styles.textModal}>NOTIFICATIONS </Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={ styles.buttonClose}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Octicons name="history" size={24} color="white" />
                      <Text style={styles.textModal}> ORDER HISTORY  </Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={ styles.buttonClose}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Ionicons name="ios-settings-outline" size={24} color="white" />
                      <Text style={styles.textModal}>SETTINGS</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={ styles.buttonClose}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Entypo name="switch" size={30} color="white" />
                      <Text style={styles.textModal}>THEME </Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={ styles.buttonClose}
                      onPress = {() => LogOutUser()}
                    >
                      <AntDesign name="logout" size={24} color="white" />
                      <Text style={styles.textModal}> LOG OUT </Text>
                    </TouchableOpacity>
                  </View>
                                  
                    
                    </View>
                  </View>     
            </Modal>
        </View>
    )
}

  function renderHeader() {
      return(
          <View style={styles.headerMainview}>
            {modalVisible == true ? 
              <TouchableOpacity
              onPress ={() => setModalVisible(true)}
                style={{                    
                    padding: SIZES.padding*0.5,
                    justifyContent: 'center'
                }}
              >
                  <MaterialIcons name="menu-open" size={30} color="white" />

              </TouchableOpacity>
              :
              <TouchableOpacity
              onPress ={() => setModalVisible(true)}
                style={{                    
                    padding: SIZES.padding*0.5,
                    justifyContent: 'center'
                }}
              >
                  <Ionicons name= 'menu-outline' size={30} color={'white'} />

              </TouchableOpacity>
          }
            
             
                      <Text style={{...FONTS.h2, color:COLORS.white, fontStyle:'normal'}}>Our Main Stores</Text>
                  
              <TouchableOpacity
                style={{                    
                    padding: SIZES.padding,
                    justifyContent: 'center'
                }}
                onPress = {() => LogOutUser()}
              >
                  <FontAwesome name='sign-out' size={30} color={'white'}/>

              </TouchableOpacity>
              

          </View>
      )
  }
     
     function renderestaurantList(){
        const renderItem = ({item}) =>(
             <TouchableOpacity style={{marginBottom: SIZES.padding* 2,backgroundColor:COLORS.backgroundColor1,}}
             onPress = {() => navigation.navigate("Storeitems", {
                 item
             })} 
             >
                 <View style={{marginBottom:SIZES.padding, marginTop:10,alignItems:'center'}}>
                     <Image
                   // source ={item.photo}
                     source={{uri:item.storeimage}}
                     resizeMode="cover"
                     style= {{
                       backgroundColor:Colors.grey300,
                        width:SIZES.width * 0.97,
                        height: 220,
                         borderRadius: SIZES.radius*0.3,                        
                     }}
                     />
                 <View style={{
                   flexDirection:'row',
                   justifyContent:'space-between',
                   position: 'absolute',
                   width:SIZES.width*0.97,
                   bottom: -1,
                   }}>
                 <View style={{
                     left:0,
                     padding:SIZES.padding*0.5,
                     paddingVertical:SIZES.padding2*1.2,
                     backgroundColor: COLORS.backgroundColor1,
                     borderTopRightRadius: SIZES.radius*0.5,
                     borderBottomLeftRadius: SIZES.radius*0.3,
                     alignItems:'center',
                     justifyContent:'center',
                     ...styles.shandow
                     
                 }}>
                   
                 <Text style={
                    { ...FONTS.h4, color:COLORS.white}
                 }>{item.storeLocation}</Text>
                
                </View>
                <TouchableOpacity style={{
                     right:0,
                     bottom:0,
                     paddingHorizontal:SIZES.padding*1.5,
                     paddingVertical:SIZES.padding2*1,
                     backgroundColor: COLORS.backgroundColor1,
                     borderTopLeftRadius: SIZES.radius*0.5,
                     borderBottomRightRadius: SIZES.radius*0.3,
                     alignItems:'center',
                     justifyContent:'center',
                     ...styles.shandow
                     
                 }}
                  onPress={() => Linking.openURL(`google.navigation:q=${item.lat}, ${item.lng}`)}>
                    <Octicons name="location" size={14} color={Colors.teal300}  />
                    <Text style={{...FONTS.h6,color:Colors.teal100}}>View On Maps</Text>
                </TouchableOpacity> 
                 </View> 
                 </View>
                 <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:SIZES.padding2}}>
                    <Text style={{...FONTS.body2,color:COLORS.white}}> {item.storeName} </Text>
                    <View style={{flexDirection:'row'}}>
                       <MaterialCommunityIcons name="star" size={20} color={COLORS.primary}/> 
                       <MaterialCommunityIcons name="star" size={20} color={COLORS.primary}/>
                       <MaterialCommunityIcons name="star" size={20} color={COLORS.primary}/>
                       <MaterialCommunityIcons name="star" size={20} color={COLORS.darkgrey}/>
                       <MaterialCommunityIcons name="star" size={20} color={COLORS.darkgrey}/>
                    </View>
               </View>
                  <View style={{marginTop:SIZES.padding2*0.5,width:SIZES.width, flexDirection:'row', padding:SIZES.padding2*2}}>
                    {/*ratin*/}
                    
                    <Text style= {{...FONTS.body3,color:Colors.grey400}}>{item.storeDetails}</Text>
                    {/*CATEGORIES */}
              
                  </View> 
             </TouchableOpacity>
         )
        return(
            <FlatList
                data={filteredStoreData}
                keyExtractor={item => `${item.key}`}
                 renderItem={renderItem}
                 showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                 paddingBottom:25,
                }}
            />
        )
    }
    
    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderWidget()}
            <View style={[{backgroundColor:COLORS.backgroundColor1,marginBottom:5,padding:SIZES.padding*0.5}]}>
            <Searchbar
              style={{backgroundColor:Colors.grey50,height:SIZES.height*0.06,borderRadius:5}}
              placeholder="Search For Store"
              onChangeText={query => searchStores(query)}
            />
            </View>
            {renderestaurantList()}
        </SafeAreaView>
    )
}


export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundColor,
        color:COLORS.white
    },
    shandow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity : 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    headerMainview: {
      flexDirection:"row",
       padding:SIZES.padding2*0.1,
       backgroundColor:'rgb(3,3,29)',
       justifyContent:'space-between',
       alignItems:'center',
       width:SIZES.width
    },

    title:{
        backgroundColor:COLORS.backgroundColor1,
        paddingHorizontal:3,
        color:COLORS.white,
        flexDirection:'row',
        padding:SIZES.padding2,
        justifyContent:'space-between',
        textAlign:'center',

    },
    titletext:{
        color:COLORS.darkgrey4,
        fontWeight:'bold',
        lineHeight:24,
        fontSize:24,
    },
    widjet: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 78,
    },
    centeredView: {
        flex:1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 78,
        },
        modalView: {
          top:-3,
          width:SIZES.width*0.59, 
          height:SIZES.height,
          left:-100,  
          alignItems:'center',     
          backgroundColor:  'rgb(20, 30, 38)',
          borderRadius: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5
        },
    
          buttonClose: {
            flexDirection:'row',
            alignItems:'center',
            paddingVertical:SIZES.padding2,
            marginLeft:10,
            color:COLORS.blackSecondary,
          },
         
          textStyle: {
            color:COLORS.white,
            fontWeight: "bold",
            textAlign: "center"
          },
          modalText: {
            marginBottom: 15,
            textAlign: "center",
            color:COLORS.white,
          },
          OrderIncrementView: {
            top:30,
            width:SIZES.width*0.445, 
            height:SIZES.height,
            left:-100, 
            position:'absolute',
            width: SIZES.width*0.5,
            justifyContent:'center',
            flexDirection:'row'
          },
          OrderIncrement: {
            width:20,
            backgroundColor: COLORS.white,
            alignItems:'center',
            justifyContent:'center',
          },
          userImage: {
            width:130,
            height:130,
            backgroundColor:COLORS.backgroundColor1,
            borderRadius:100,
           
          },
          userImageView:{
            width:'100%',
            alignItems:'center',
            paddingVertical:SIZES.padding2*1.5,
            backgroundColor:COLORS.backgroundColor1,
          },
          textModal:{
            ...FONTS.h5,
            color:COLORS.white,
            marginLeft:15,
          },
          modalContent:{
            marginTop:SIZES.padding2*2,
          }

})
