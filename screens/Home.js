import { AntDesign, EvilIcons, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useContext, useState } from 'react'
import { Alert, FlatList, Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AuthenticatedUserContext } from '../AuthProvider/AuthProvider'
import { COLORS, FONTS, images, SIZES } from '../constants/Index'
import {restaurantData,
    categoryData,
    initialCurrentLocation}
     from '../constants/mydata'
import Firebase from '../firebaseConfig'
import "firebase/auth"
import 'firebase/firestore';
const Home = ({navigation}) => {
    //DUMMY DATA

const { user } = useContext(AuthenticatedUserContext);
const {storeData,setStoreData} = useContext(AuthenticatedUserContext);
const [restaurantdata,setrestaurantData] = useState(null);
const [modalVisible,setModalVisible] = React.useState(false);
const auth = Firebase.auth();

React.useEffect(() => {
    setrestaurantData(restaurantData)
  getStoreData();
  
}, [])
const getStoreData = async () => {
    try{
      const dataArr = [];
        const response=Firebase.firestore().collection('Stores');
        const data=await response.orderBy("storeName", "asc").get()
        data.docs.forEach(item=>{
          const {storeName, storeDetails,storeLocation, storeimage} = item.data();
          dataArr.push({
            key: item.id,
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
 const LogOutUser = async function() {
    try {
        await auth.signOut();
      } catch (error) {
        console.log(error);
      }
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
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                   <TouchableOpacity
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Ionicons styles={styles.OrderIncrementView} name='menu' size ={20} color={COLORS.white} />
                    </TouchableOpacity> 
                    <TouchableOpacity
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={[styles.textStyle,{color:COLORS.blackSecondary}]}> OK </Text>
                    </TouchableOpacity> 
                    </View>
                  </View>     
            </Modal>
        </View>
    )
}

  function renderHeader() {
      return(
          <View style={styles.headerMainview}>
              <TouchableOpacity
              onPress ={() => setModalVisible(true)}
                style={{                    
                    padding: SIZES.padding*0.5,
                    justifyContent: 'center'
                }}
              >
                  <Ionicons name= 'menu-outline' size={30} color={'white'} />

              </TouchableOpacity>
              <View style={{
                  flex: 1, alignItems:'center',justifyContent:'center' 
              }}>
                  <View style={{
                      padding:SIZES.padding2*0.7,
                      paddingHorizontal: SIZES.padding2,
                      backgroundColor: COLORS.white,
                      alignItems:'center',
                      justifyContent:'center',
                      borderRadius: SIZES.radius
                  }}>
                      <Text style={{...FONTS.h2, color:COLORS.black, fontStyle:'normal'}}>Main Stores</Text>
                  </View>
              </View>
              <TouchableOpacity
                style={{                    
                    padding: SIZES.padding,
                    justifyContent: 'center'
                }}
                onPress = {() => LogOutUser()}
              >
                  <MaterialCommunityIcons name= 'dots-vertical' size={30} color={'white'}/>

              </TouchableOpacity>
              

          </View>
      )
  }
     
     function renderestaurantList(){
        const renderItem = ({item}) =>(
             <TouchableOpacity style={{marginBottom: SIZES.padding* 2}}
             onPress = {() => navigation.navigate("Storeitems", {
                 item
             })} 
             >
                 <View style={{marginBottom:SIZES.padding, alignItems:'center'}}>
                     <Image
                   // source ={item.photo}
                     source={{uri:item.storeimage}}
                     resizeMode="cover"
                     style= {{
                        width:SIZES.width * 0.97,
                        height: 200,
                         borderRadius: SIZES.radius*0.3,                        
                     }}
                     />
                 
                 <View style={{
                     position: 'absolute',
                     bottom: 0,
                     left:0,
                     height: 50,
                     width: SIZES.width * 0.3,
                     backgroundColor: COLORS.darkgrey,
                     borderTopRightRadius: SIZES.radius,
                     borderBottomLeftRadius: SIZES.radius*0.3,
                     alignItems:'center',
                     justifyContent:'center',
                     ...styles.shandow
                     
                 }}>
                 <Text style={
                    { ...FONTS.h4, color:COLORS.white}
                 }>{item.storeLocation}</Text> 
                 </View> 
                 </View>
               <Text style={{...FONTS.body2,color:COLORS.white}}> {item.storeName} </Text>
                
                  <View style={{marginTop:SIZES.padding2,width:SIZES.width, flexDirection:'row', backgroundColor:COLORS.backgroundColor1,padding:SIZES.padding2*2}}>
                    {/*ratin*/}
                    <MaterialCommunityIcons name="star" size={20} color={COLORS.primary}/> 
                    <Text style= {{...FONTS.body3, marginLeft:8,color:COLORS.white}}>{item.storeDetails}</Text>
                    {/*CATEGORIES */}
              
                  </View> 
             </TouchableOpacity>
         )
        return(
            <FlatList
                data={storeData}
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
            <View style={styles.title}>
                <Text style={styles.titletext}>Our Main Stores</Text>
                <Text style={{color:COLORS.darkgrey2, fontWeight:'bold', fontSize:15, width:SIZES.width*0.5}}>Buy from a store near You to reduce freight charges</Text>
            </View>
            {renderestaurantList()}
        </SafeAreaView>
    )
}


export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
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
      flexDirection:"row", padding:SIZES.padding2*0.1,backgroundColor:'rgb(3,3,29)'
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
            top:10,
          width:SIZES.width*0.445, 
          height:SIZES.height,
          left:-100,       
          backgroundColor:  COLORS.white || 'rgb(20, 30, 38)',
          borderRadius: 0,
          padding: 35,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5
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
          buttonClose: {
            backgroundColor: COLORS.darkgrey4,
            color:COLORS.blackSecondary,
          },
          buttonReset: {
            backgroundColor: COLORS.primary,
            color:COLORS.white,
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
            position:'absolute',
            top:-22,
            width: SIZES.width,
            height: 45,
            justifyContent:'center',
            flexDirection:'row'
          },

})
