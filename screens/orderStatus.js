//import liraries
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { Component,useEffect,useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView,TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { COLORS, FONTS, images, SIZES } from '../constants/Index'
import "firebase/storage";
import 'firebase/firestore';
import * as Linking from 'expo-linking';
import Firebase from '../firebaseConfig';
import { Badge, Card, Colors, Divider, Paragraph, Title } from 'react-native-paper';
import { AuthenticatedUserContext } from '../AuthProvider/AuthProvider';

// create a component
const OrderView = ({route, navigation}) => {
    const { user } = React.useContext(AuthenticatedUserContext);
    const[orderItem, setOrderItem] = useState('');
    const[products, setProducts] = useState([]);
    const[submitting, setisSubmitting] = useState(false);
    useEffect(() => {
        getCustomerCurrentOrder();
        setProducts(orderItem.customerOrder);
    },[])
    const getCustomerCurrentOrder = async() =>{
        
          try{
            const dataArr = [];       
             const response=Firebase.firestore()
               .collection('CustomerOrder')
               .where('customerEmail', '==', user.email)
               .orderBy('createdAt', 'desc').limit(3);
               const data=await response.get()
               data.docs.forEach((doc)=>{
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
                      setOrderItem(dataArr)
                    })
          }
          catch(e){
            console.log(e);
          } 
        
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
            onPress={() => navigation.navigate('home')} 
            >
                <MaterialIcons name='arrow-back' size={24} color={COLORS.white}/>

            </TouchableOpacity>
            <Text 
                style={{...FONTS.body2,fontSize:25, color:COLORS.white, fontWeight:'bold'}}>
                 My Order Status
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

   
    function renderOrdersView() {    
        const renderItem = ({ item, index }) => (
            <View >
                <Card style={styles.bodycontainer}>
                    {
                        index == 0 ?
                        
                        <Text style={{backgroundColor:Colors.teal400,color:Colors.lightBlue50, width:SIZES.width*0.35,borderRadius:10, padding:SIZES.padding,...FONTS.body3}}>Current Order</Text>
                        :
                        <Text></Text>
                       
                    }
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <View style={[styles.ItemsView,{width:SIZES.width*0.4,paddingHorizontal:5, marginVertical:25}]}>
                      <Text style={styles.btntext}>Order Id:{item.key}</Text>
                      {
                          item?.orderItems.map((data, index)=>(
                              <View>
                              <View
                              style={[styles.ItemsView,{flexDirection:'row', paddingVertical:9,}]}
                              key={`orderItems-${index}`}>
                              
                                  <Image
                                      source={{uri: data.image}}
                                      resizeMode='cover'
                                      style={[styles.bodyphoto,{backgroundColor:Colors.grey600}]}/>
                                      <Text style={[styles.btntext,{paddingHorizontal:5,width:SIZES.width*0.25}]}>{data?.name}</Text>
                                      <Text style={[styles.btntext,{paddingHorizontal:5,width:SIZES.width*0.25}]}>{data?.unit } * {data?.qty}</Text>
                                      <Text style={[styles.btntext,{...FONTS.h4,width:SIZES.width*0.32}]}>Ksh {data.total}.00</Text>
                              </View> 
                              <Divider style={{color:Colors.lime700}}/>
                              </View>
                               
                          ))
                      }
                       <View style={[styles.centered,{paddingVertical:SIZES.padding2}]}>
                        <Text style={[styles.btntext,{...FONTS.h4,width:SIZES.width*0.30}]}>All Items: {item?.basketCount}</Text>
                        <Text style={[styles.btntext,{...FONTS.h4,width:SIZES.width*0.65}]}>Total For Items: Ksh {item?.total}.00</Text>
                    </View>
                    <Divider/>
                    <View style={[styles.centered,{paddingVertical:SIZES.padding2,justifyContent:'space-between'}]}>
                        <Text style={[styles.btntext,{...FONTS.h5,width:SIZES.width*0.45}]}>Shipment Charges Ksh 150.00</Text>
                        <Text style={[styles.btntext,{...FONTS.h4,width:SIZES.width*0.50,backgroundColor:Colors.yellow500, padding:SIZES.padding2}]}>Total + Shipment: Ksh {(item?.total + 150)}.00</Text>
                    </View>
                      </View>
                      <View style={[styles.ItemsView,{justifyContent:'space-between'}]}>
                        <View style={{flexDirection:'row',alignItems:'center', marginVertical:25, }}>
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
                        <Text style={[styles.btntext,{paddingRight:5, ...FONTS.body3,}]}>Order Status:</Text>
                         <Badge size={28} style={{backgroundColor:Colors.green700,paddingHorizontal:17}} >{item?.status}</Badge>
                        </View>
                        :
                        <View></View>
                         }
                        </>
                        
                      </View>
                    </View>
                 
  
                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              
                  
                </View> 
                </Card>
      
            </View>
          )
          return(
            <View style={styles.catBody}>
            <FlatList
              vertical
              showsVerticalScrollIndicator={false}
              data={orderItem}
              renderItem={renderItem}
              keyExtractor={item => `${item?.key}`}
              contentContainerStyle={{
                paddingBottom:40,
              }}
            />
          </View>
          )}
    return (
        <View style={styles.container}>
            {renderHeader()}
              {renderOrdersView()}
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
    bodycontainer: {
        width:SIZES.width,
        marginTop:3,
        padding:SIZES.padding*0.2,
        justifyContent:'space-between'

    },
    ItemsView:{
        width:SIZES.width*0.45
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
        paddingHorizontal:10,
        color:COLORS.white,
        ...FONTS.body3,
        position:'absolute',
        top:-5,
        left:40
    },
    orderStatus:{
        flexDirection:'column',
        alignItems:'center'
    }
});

//make this component available to the app
export default OrderView;
