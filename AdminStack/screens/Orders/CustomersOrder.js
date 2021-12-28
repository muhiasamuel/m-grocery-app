// @refresh reset
import React, { Component, useState } from 'react';
import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

import { Animated, FlatList, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text,TouchableOpacity, View, Pressable,Alert} from 'react-native'
import "firebase/storage";
import 'firebase/firestore';
import * as Linking from 'expo-linking';
import Firebase from '../../../firebaseConfig';
import { COLORS, FONTS, SIZES } from '../../../constants/Index';
import { ActivityIndicator, Badge,Colors } from 'react-native-paper';
import { AuthenticatedUserContext } from '../../../AuthProvider/AuthProvider';

// create a component
const CustomersOrder = ({navigation,route}) => {
    const[isloading, setIsLoading] = useState(false);
    const[order, setOrder] = React.useState(null);
    const { storeid, AuthUserRole} = React.useContext(AuthenticatedUserContext);
    const [modalVisible,setModalVisible] = React.useState(false);
    const[orderItem, setOrderItem] = useState('');
    const[data, setData] = useState(null);

    React.useEffect(() =>{
      if (AuthUserRole?.role === `Admin`) {
        getOrdersDataForAdmin()
      } else {
        getOrdersData(AuthUserRole?.storeid);  
      }
              
    }, [])

    ///Store Data
    //filter products by category
    
  function handleselectedStatus (status){
    console.log(status);
    setIsLoading(true)
    if (data != null) {
      let orders = data.filter(a =>a.status == status)
      if (orders.length > 0) {
        console.log(orders);
          setOrder(orders) 
          setIsLoading(false);
      } else{
        setOrder(null)
        setTimeout(() => {
          setIsLoading(false);
          Alert.alert(
            "No Data Alert",
            `No ${status} Order Was Found`,
            [
              {
                text: "Cancel",               
              },
            ],
            {
              cancelable: true,
            }
          );
        }, 2000);
      return ( 
        <>   
       <View style={{justifyContent:'center'}}>
        <Text style={{textAlign:'center'}}>   No {status} Order Was Found</Text>
       </View>
      </>
      )
      }
    } else {
   
      return (    
        <View style={{justifyContent:'center'}}>
          <Text style={{textAlign:'center'}}>   No Data Was Found</Text>
        </View>
      )
    }

  }
  const getOrdersDataForAdmin = async () => {
    setIsLoading(true);
       try{
         const dataArr = [];        
         let response=Firebase.firestore().collection('CustomerOrder')
            .orderBy('status', 'asc');
           await response.onSnapshot((querySnapshot) =>{
               querySnapshot.forEach((doc)=>{
                   const {customerOrder,customer,customerEmail,status, geohash,lat, lng} = doc.data();
                   dataArr.push({
                     key: doc.id,
                     geohash,
                     customerId:customer.uid,
                     status,
                     customerName:customer.username,
                     customerEmail,
                     total:customerOrder.total,
                     customerPhoneNo:customer.phonenumber,
                     orderItems: customerOrder.orderItems,
                     basketCount:customerOrder.BasketCount,
                     lat,
                     lng,
                   })
                    setOrder(dataArr)
                    setData(dataArr)
                    setIsLoading(false)
                 })
           });

       }
       catch(e){
         console.log(e);
       }
     }

   const getOrdersData = async (item) => {
     setIsLoading(true);
        try{
          const dataArr = [];        
          let response=Firebase.firestore().collection('CustomerOrder')
             .where('storeId', '==', item)
             .orderBy('status', 'asc');
            await response.onSnapshot((querySnapshot) =>{
                querySnapshot.forEach((doc)=>{
                    const {customerOrder,customer,customerEmail,status, geohash,lat, lng} = doc.data();
                    dataArr.push({
                      key: doc.id,
                      geohash,
                      customerId:customer.uid,
                      status,
                      customerName:customer.username,
                      customerEmail,
                      total:customerOrder.total,
                      customerPhoneNo:customer.phonenumber,
                      orderItems: customerOrder.orderItems,
                      basketCount:customerOrder.BasketCount,
                      lat,
                      lng,
                    })
                     setOrder(dataArr)
                     setData(dataArr)
                     setIsLoading(false)
                  })
            });

        }
        catch(e){
          console.log(e);
        }
      }
      function viewOrder(item) {
       navigation.navigate("viewOrder",{
         item
       })
    }

     


      function  renderOrderModal() {
          return(
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

                        <Text style={[styles.textStyle,{color:COLORS.white}]}> {orderItem?.name} </Text>
                    <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={[styles.textStyle,{color:COLORS.white}]}> OK </Text>
                  </TouchableOpacity>
                    </View>
                   </View>      

              </Modal>
          )
      }
      function renderHeader()     
      {
         return ( <View style={styles.header}>
              <TouchableOpacity
              style={{
                  width:50,
                  paddingLeft: SIZES.padding *2,
                  justifyContent: 'center'
              }}
              onPress={() => navigation.goBack()} 
              >
                  <MaterialIcons name='arrow-back' size={24} color={COLORS.white}/>
  
              </TouchableOpacity>
              <Text 
                  style={{...FONTS.body2,fontSize:25, color:COLORS.white, fontWeight:'bold'}}>
                   Orders
               </Text>
              <TouchableOpacity
              style={{
                  width:50,
                  paddingLeft: SIZES.padding *2,
                  justifyContent: 'center'
              }}
              >
                  <MaterialCommunityIcons name='dots-vertical' size={24} color={COLORS.darkgrey2}/>
  
              </TouchableOpacity>
              
              
          </View>) 
      }
  

      function renderCartItems() {    
        const renderItem = ({ item, index }) => (
          <View underlayColor='rgb(122, 22, 65)'       
          >
              <View style={styles.bodycontainer}>
                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={[styles.ItemsView,{width:SIZES.width*0.4,paddingHorizontal:5, marginVertical:25}]}>
                    <Text style={styles.btntext}>Order Id:{item.key}</Text>
                    {
                        item?.orderItems.map((data, index)=>(
                            <View
                            style={[styles.ItemsView,{flexDirection:'row', paddingVertical:3,}]}
                            key={`orderItems-${index}`}>
                            
                                <Image
                                    source={{uri: data.image}}
                                    resizeMode='cover'
                                    style={styles.bodyphoto}/>
                                    <Text style={[styles.btntext,{paddingHorizontal:5}]}>{data?.name}</Text>
                            </View>   
                        ))
                    }
                    </View>
                    <View style={styles.ItemsView}>
                      <View style={{flexDirection:'row',alignItems:'center', marginVertical:25}}>
                      <Text style={[styles.btntext,{paddingRight:5, ...FONTS.body3}]}>Order Status:</Text>
                      
                      {item?.status ==`New` ? 
                       <Badge size={28} style={{backgroundColor:Colors.redA700}} >{item?.status}</Badge>
                       :
                       <Badge size={28} style={{backgroundColor:Colors.green700,paddingHorizontal:7}} >{item?.status}</Badge>
                      }
                      
                      </View>
                      <>
                      {item?.status ==`Complete` ? 
                      
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                      <Text style={[styles.btntext,{paddingRight:5, ...FONTS.body3}]}>Order Status:</Text>
                       <Badge size={28} style={{backgroundColor:Colors.green700,paddingHorizontal:7}} >{item?.status}</Badge>
                      </View>
                      :
                      <View></View>
                       }
                      </>
                      
                        <Text style={[styles.btntext,{...FONTS.body2}]}>Customer Details</Text>
                        <Text style={styles.btntext}>Customer name: {item?.customerName}</Text>
                        <Text style={styles.btntext}>Phone No: {item?.customerPhoneNo}</Text>
                        <Text style={styles.btntext}>Email: {item?.customerEmail}</Text>
                    </View>
                  </View>
               

                  <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <TouchableOpacity
                 onPress={() => Linking.openURL(`google.navigation:q=${item.lat}, ${item.lng}`)}
                        style={[styles.btnContinue,{backgroundColor:'rgb(40,175,255)',}]}>
                        <Text style={styles.btntext}>Customer Location</Text>
                </TouchableOpacity> 
              
                <TouchableOpacity
                        onPress={() => viewOrder(item)}  
                        style={[styles.btnContinue,{backgroundColor:'rgb(50,170,120)',}]}>
                        <Text style={[styles.btntext,{paddingHorizontal:1}]}>Actions on Order</Text>
                </TouchableOpacity>
                
              </View> 
              </View>
    
          </View>
        )
        return(
          <View style={styles.catBody}>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            data={order}
            renderItem={renderItem}
            keyExtractor={item => `${item?.key}`}
            contentContainerStyle={{
              paddingBottom:130,
            }}
          />
        </View>
        )}



    return (
        <View style={styles.container}>
          {renderHeader()}
         
            <View style={styles.cardrow}>
              <TouchableOpacity
              style={[styles.storeswitchbtn,{backgroundColor:Colors.lightBlue200}]}
              onPress={() => handleselectedStatus('New')}
              >
                <Text style={[styles.textStyle,{fontSize:18}]}>New</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.storeswitchbtn}
              onPress={() => handleselectedStatus('Dispatched')}
              >
                <Text style={[styles.textStyle,{fontSize:18}]}>Dispatched</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={[styles.storeswitchbtn,{backgroundColor:Colors.green300}]}
              onPress={() => handleselectedStatus('Complete')}
              >
                <Text style={[styles.textStyle,{fontSize:18}]}>Complete</Text>
              </TouchableOpacity>
              {
                      AuthUserRole?.role === `Admin`?
                      <TouchableOpacity
                      style={[styles.storeswitchbtn,{backgroundColor:Colors.red300}]}
                      onPress={() => handleselectedStatus('Declined')}
                      >
                        <Text style={[styles.textStyle,{fontSize:18}]}>Declined</Text>
                      </TouchableOpacity>
              :
              <Text></Text>
              }
           </View>
          
        {isloading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', top:40 }}>
          <ActivityIndicator size='large' color={Colors.purple100} />
        </View>:
        <View></View>
        }
            {renderOrderModal()}
            {renderCartItems()}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    header:{
      top:0,
      width:SIZES.width,
      paddingVertical:SIZES.padding*1.5,
      backgroundColor:'rgb(3,3,29)',
      flexDirection: 'row',
      alignItems:'center',
      justifyContent:'space-between'
  },
    OrderIncrement: {
        width:50,
        backgroundColor: COLORS.white,
        alignItems:'center',
        justifyContent:'center',
      },
      bodycontainer: {
        width:SIZES.width,
        marginTop:3,
        backgroundColor:COLORS.blackSecondary,
        padding:SIZES.padding*0.5,
        justifyContent:'space-between'

    },
    ItemsView:{
        width:SIZES.width*0.45
    },
    bodyphoto: {
        width:SIZES.width*0.16,
        height:45,
        borderRadius:15

    }, 
     

    OrderIncrement: {
        width:50,
        backgroundColor: COLORS.white,
        alignItems:'center',
        justifyContent:'center',
      },
      OrderIncrementView: {
         
        bottom:0,
        height: 45,
        justifyContent:'center',
        flexDirection:'row'
      },
    totals: {
        marginTop:70,
        position:'absolute',
        padding:SIZES.padding*1.2,
        bottom:0,
        width:SIZES.width,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        backgroundColor:COLORS.blackSecondary,
    },
    totalCentered:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    btnContinue:{
        backgroundColor:COLORS.primary,
        borderWidth:2,
        borderColor:'#fff',
        paddingHorizontal:8,
        marginHorizontal:10,
        alignItems:'center', 
        justifyContent:'center',
        borderRadius: 10 
    },
    btntext:{
        color:COLORS.white,
        paddingVertical:8,
        ...FONTS.h5,

    },
    centeredView: {
        flex:1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 78,
        },
        modalView: {
          margin: 20,
          width:SIZES.width,        
          backgroundColor:  COLORS.blackSecondary || 'rgb(20, 30, 38)',
          borderRadius: 20,
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
        btnStatus: {
          borderColor:COLORS.white,
          borderWidth:2,
          borderRadius:100,
          padding:SIZES.padding2,
          backgroundColor:'rgb(255,12,13)',
          color:COLORS.white,
          alignSelf:'flex-end'
        },
        cardrow:{
          flexDirection:'row',
          justifyContent:'space-between',
          alignItems:'center',
          padding:5
        },
        storeswitchbtn: {
          backgroundColor:Colors.blue300,
          paddingHorizontal:SIZES.padding2,
          paddingVertical:7,
          borderRadius:5,
          borderColor:Colors.cyan600,
          borderWidth:1
        },
});

//make this component available to the app
export default CustomersOrder;
