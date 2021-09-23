//import liraries
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import React, { Component,useEffect,useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView,TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../../constants/Index';
import "firebase/storage";
import 'firebase/firestore';
import * as Linking from 'expo-linking';
import Firebase from '../../../firebaseConfig';

// create a component
const OrderView = ({route, navigation}) => {
    const[orderItem, setOrderItem] = useState('');
    const[products, setProducts] = useState([]);
    const[submitting, setisSubmitting] = useState(false);
    useEffect(() => {
        let {item} = route.params;
        setOrderItem(item)
        setProducts(item.orderItems);
       
    }, [])
    const updateStatusDecline = async(key) => {
        try{
            setisSubmitting(true)
            const db = Firebase.firestore().collection("CustomerOrder")
            await db.doc(key).update({
                status:"Declined"
            }).then(() =>{
                setisSubmitting(false)
                alert('updated')
            })
        }catch(e){
            console.log(e);
        }
    }
   const handledispatch = (item) => {
    navigation.navigate("dispatchOrder",{
        item
      })
    }
    function renderOrdersView() {
         return(
             <View >
                <View style={styles.bodycontainer}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>                
                        <View style={styles.ItemsView}>
                            <Text style={[styles.btntext,{...FONTS.body1}]}>Customer Details</Text>
                            <Text style={styles.btntext}>Customer name: {orderItem?.customerName}</Text>
                            <Text style={styles.btntext}>Phone No: {orderItem?.customerPhoneNo}</Text>
                            <Text style={styles.btntext}>Email: {orderItem?.customerEmail}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => Linking.openURL(`google.navigation:q=${orderItem.lat}, ${orderItem.lng}`)}
                            style={{alignItems:'center',marginTop:5,width:SIZES.width*0.35}}
                        >
                            <Text style={[styles.btntext,{...FONTS.h3}]}>View Customer Location</Text>
                            <Ionicons name="ios-location-outline" size={39} color="blue" />

                        </TouchableOpacity>
                        
                    </View>
                    
                    <View style={{backgroundColor:COLORS.darkgrey2,paddingVertical:SIZES.padding2*2}}>
                        <Text style={[styles.btntext,{...FONTS.body1}]}>Ordered Items Details</Text>
                        <View style={[styles.centered,{ paddingVertical:10,paddingHorizontal:5}]}>
                            <Text style={[styles.btntext,{...FONTS.h4,width:SIZES.width*0.20}]}>Image</Text>
                            <Text style={[styles.btntext,{...FONTS.h4,width:SIZES.width*0.20}]}>Prod Name</Text>
                            <Text style={[styles.btntext,{...FONTS.h4,width:SIZES.width*0.20}]}>Unit</Text>
                            <Text style={[styles.btntext,{...FONTS.h4,width:SIZES.width*0.21}]}>Total Price</Text>
                        </View>
                        {
                            products?.map((data, index)=>(
                                <View
                                style={[styles.centered,{paddingVertical:10,paddingHorizontal:5}]}
                                key={`orderItems-${index}`}>
                                    <View style={{width:SIZES.width*0.20}}>
                                    <Image
                                        source={{uri: data.image}}
                                        resizeMode='cover'
                                        style={styles.bodyphoto}/>
                                        <Text style={styles.qty}>{data?.qty}</Text>
                                    </View>    
                                        <Text style={[styles.btntext,{...FONTS.h4,width:SIZES.width*0.22}]}>{data.name}</Text>
                                        <Text style={[styles.btntext,{...FONTS.h4,width:SIZES.width*0.28}]}>{data.unit} * {data?.qty}</Text>
                                        <Text style={[styles.btntext,{...FONTS.h4,width:SIZES.width*0.20}]}>Ksh {data.total}.00</Text>
                                </View>   
                            ))
                        }
                    </View>
                    <View style={[styles.centered,{paddingVertical:SIZES.padding2}]}>
                        <Text style={[styles.btntext,{...FONTS.h3,width:SIZES.width*0.30}]}>All Items: {orderItem?.basketCount}</Text>
                        <Text style={[styles.btntext,{...FONTS.h3,width:SIZES.width*0.65}]}>Total Payable: Ksh {orderItem?.total}.00</Text>
                    </View>
                    <Text style={[styles.btntext,{...FONTS.body1}]}>Order Status:</Text>
                    <View style={[styles.centered,{paddingHorizontal:SIZES.padding2}]}> 
                        <View style={styles.orderStatus}>
                            <Text style={[styles.btntext,{...FONTS.h4}]}>New</Text> 
                            {
                              orderItem?.status ==`New` ? 
                              <AntDesign name="checkcircleo" size={29} color='rgb(15,105,245)'/>
                              :
                              <Entypo name="circle" size={29} color={COLORS.green}/>
   
                            }
                        </View>
                        <View style={styles.orderStatus}>
                            <Text style={[styles.btntext,{...FONTS.h4}]}>Dispatched</Text>
                            {
                              orderItem?.status ==`Dispatched` ? 
                              <AntDesign name="checkcircleo" size={29} color='rgb(15,225,145)'/>
                              :
                              <Entypo name="circle" size={29} color='rgb(15,225,45)'/>
   
                            }
                        </View>
                        <View style={styles.orderStatus}>
                            <Text style={[styles.btntext,{...FONTS.h4}]}>Comlete</Text>
                            {
                              orderItem?.status ==`Complete` ? 
                              <AntDesign name="checkcircleo" size={29} color='rgb(15,105,245)'/>
                              :
                              <Entypo name="circle" size={29} color='rgb(15,105,245)'/>
   
                            }
                        </View>  
                        <View style={styles.orderStatus}>
                            <Text style={[styles.btntext,{...FONTS.h4}]}>Declined</Text>
                            {
                              orderItem?.status ==`Declined` ? 
                              <AntDesign name="checkcircleo" size={29} color='rgb(255,10,20)'/>
                              :
                              <Entypo name="circle" size={29} color='rgb(255,10,20)'/>
   
                            }
                        </View>   
                    </View>
                    <Text style={[styles.btntext,{...FONTS.body1}]}>Actions:</Text>
                    <View style={[styles.centered,{paddingHorizontal:SIZES.padding2}]}> 
                    <TouchableOpacity
                    onPress={() => handledispatch(orderItem)}
                     style={styles.btnContinue}
                     
                    >
                      <Text style={[styles.btntext,{...FONTS.h4,color:COLORS.white}]}>Dispatch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => updateStatusDecline(orderItem?.key)}
                     style={[styles.btnContinue,{backgroundColor:'rgb(255,15,20)'}]}
                    >
                       {submitting ?
                       <ActivityIndicator color={COLORS.white} size='large'/>
                       :
                       <Text style={[styles.btntext,{...FONTS.h4,color:COLORS.white}]}>Decline Order</Text>
                    } 
                      
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <ScrollView>
              {renderOrdersView()}
            </ScrollView>
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
    bodycontainer: {
        width:SIZES.width,
        marginTop:3,
        backgroundColor:COLORS.darkgrey4,
        padding:SIZES.padding*0.2,
        justifyContent:'space-between'

    },
    ItemsView:{
        width:SIZES.width*0.6
    },
    btnContinue:{
        backgroundColor:COLORS.primary,
        borderWidth:2,
        borderColor:'#fff',
        paddingVertical:SIZES.padding2*0.5,
        paddingHorizontal:SIZES.padding2,
        alignItems:'center', 
        justifyContent:'center',
        borderRadius: 10 
    },
    btntext:{
        color:COLORS.darkblue,
        fontWeight:'bold',
        paddingVertical:4,
        ...FONTS.h4,

    },
    centered:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    bodyphoto: {
        width:SIZES.width*0.16,
        height:45,
        borderRadius:15

    }, 
    qty: {
        backgroundColor:"rgb(200,35,150)",
        borderRadius:100,
        paddingHorizontal:10,
        color:COLORS.white,
        ...FONTS.body3,
        paddingVertical:5,
        position:'absolute',
        top:-10,
        left:50
    },
    orderStatus:{
        flexDirection:'column',
        alignItems:'center'
    }
});

//make this component available to the app
export default OrderView;
