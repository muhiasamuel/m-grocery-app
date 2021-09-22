//import liraries
import React, { Component, useState } from 'react';
import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

import { Animated, FlatList, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text,TouchableOpacity, View, Pressable,Alert} from 'react-native'
import "firebase/storage";
import 'firebase/firestore';
import * as Linking from 'expo-linking';
import Firebase from '../../../firebaseConfig';
import { COLORS, FONTS, SIZES } from '../../../constants/Index';



// create a component
const CustomersOrder = () => {
    const[order, setOrder] = useState('');
    const[orderItems, setOrderItems] = useState('');

    React.useEffect(() =>{
        getOrdersData();
    }, [])

   const getOrdersData = async () => {
        try{
          const dataArr = [];
        
            const response=Firebase.firestore().collection('CustomerOrder');
            await response.onSnapshot((querySnapshot) =>{
                querySnapshot.forEach((doc)=>{
                    const {customerOrder,customer,customerEmail, geohash,lat, lng} = doc.data();
                    dataArr.push({
                      key: doc.id,
                      geohash,
                      customerId:customer.uid,
                      customerName:customer.username,
                      customerEmail,
                      total:customerOrder.total,
                      customerPhoneNo:customer.phonenumber,
                      orderItems: customerOrder.orderItems,
                      basketCount:customerOrder.BasketCount,
                      lat,
                      lng,
                    });
                     setOrder(dataArr)
                  })
            });

        }
        catch(e){
          console.log(e);
        }
      }

      function renderCartItems() {    
        const renderItem = ({ item }) => (
          <View underlayColor='rgb(122, 22, 65)'       
          >
              <View style={styles.bodycontainer}>
                  <View style={{flexDirection:'row'}}>
                    <View style={[styles.ItemsView,{width:SIZES.width*0.4}]}>
                    {
                        item?.orderItems.map((data, index)=>(
                            <View
                            style={[styles.ItemsView,{flexDirection:'row', paddingVertical:10}]}
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
                        <Text style={[styles.btntext,{...FONTS.body2}]}>Customer Details</Text>
                        <Text style={styles.btntext}>Customer name: {item?.customerName}</Text>
                        <Text style={styles.btntext}>Phone No: {item?.customerPhoneNo}</Text>
                        <Text style={styles.btntext}>Email: {item?.customerEmail}</Text>
                    </View>
                  </View>
               

                  <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                <TouchableOpacity
                 onPress={() => Linking.openURL(`google.navigation:q=${item.lat}, ${item.lng}`)}
                        style={[styles.btnContinue,{backgroundColor:'rgb(40,175,255)',}]}>
                        <Text style={styles.btntext}>Customer Location</Text>
                </TouchableOpacity> 
                <TouchableOpacity
                 onPress={() => Linking.openURL(`google.navigation:q=${item.lat}, ${item.lng}`)}
                        style={[styles.btnContinue,{backgroundColor:'rgb(40,135,255)',width:SIZES.width*0.3}]}>
                        <Text style={styles.btntext}>View Order in detail</Text>
                </TouchableOpacity> 
                <TouchableOpacity
                        style={[styles.btnContinue,{backgroundColor:'rgb(50,170,120)',}]}>
                        <Text style={[styles.btntext,{paddingHorizontal:1}]}>Actions on Order</Text>
                </TouchableOpacity>
                
              </View> 
              </View>
             
             
              
               {/*<View style={styles.bodycontainer}>
              <Image style={styles.bodyphoto} source={{uri: item?.image}} />
              <View>
                <Text style={[styles.bodytitle,{color: COLORS.darkgrey4, width:SIZES.width*0.35}]}>{item?.name}</Text>
                
                <Text style={[styles.bodycategory,
                    {color:COLORS.white,padding:5, }]}>
                        ksh {item?.price} / {item?.unit}
                </Text>
                <View style={styles.OrderIncrementView}>
                    <TouchableOpacity
                        style={[styles.OrderIncrement,{borderTopLeftRadius:25,
                        borderBottomLeftRadius:25}]}
                        onPress = {() =>  RemoveOrder(item?.productId,item?.price)} >
                        <Text style={{...FONTS.body1}}>
                            <FontAwesome name='minus-circle' size={20} color={COLORS.black}/>    
                        </Text>
                    </TouchableOpacity>
                   
                        <View 
                        style={styles.OrderIncrement} >
                        <Text style={{...FONTS.h2, fontWeight:'bold'}}>{item?.qty} </Text>
                    </View>
                   
                    
                    <TouchableOpacity  style={[styles.OrderIncrement,{borderTopRightRadius:25,
                            borderBottomRightRadius:25}]}
                            onPress = {() =>  AddOrder(item?.productId,item?.price)} >
                        <Text style={{...FONTS.body1}}>
                            <FontAwesome name='plus-circle' size={20} color={COLORS.black}/>  
                        </Text>                    
                    </TouchableOpacity>
                </View>
              </View>
              <View>
              <Text style={[styles.btntext,]}> Total:</Text>
              <Text style={[styles.btntext,]}> ksh {item.total} </Text>
                <TouchableOpacity
                        style={[styles.btnContinue,{backgroundColor:'rgb(250,170,20)'}]}
                        onPress={() => removeAll(item?.key)}>
                        <Text style={styles.btntext}>Reset</Text>
                  </TouchableOpacity>              

              </View>
          
            
                    </View>*/}
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
          />
        </View>
        )}

    return (
        <View style={styles.container}>
            {renderCartItems()}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
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
        alignItems:'center',
        justifyContent:'space-between'

    },
    ItemsView:{
        width:SIZES.width*0.5
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
        alignItems:'center', 
        justifyContent:'center',
        borderRadius: 10 
    },
    btntext:{
        color:COLORS.white,
        paddingVertical:12,
        ...FONTS.h5,

    },
});

//make this component available to the app
export default CustomersOrder;
