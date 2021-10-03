//import liraries
import React, { Component,useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import "firebase/storage";
import 'firebase/firestore';
import * as Linking from 'expo-linking';
import Firebase from '../../../firebaseConfig';
import { AuthenticatedUserContext } from '../../../AuthProvider/AuthProvider';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, Avatar,Colors, Divider } from 'react-native-paper';
import { COLORS, FONTS, SIZES } from '../../../constants/Index';
import CustomersOrder from './CustomersOrder';

// create a component
const OrderDispatch = ({route, navigation}) => {
    const [order, setorder] = useState()
    const [deliverlyPesrson, setdeliverlyPesrson] = useState()
    const [isSubmitting, setIsSubmitting] = useState(false)
    useEffect(() => {
        let{item} = route.params
        setorder(item)
        getAuthUserRole()
    }, [])
    
      const getAuthUserRole = async () => {
         
        try{
           const dataArr = [];
          await Firebase.firestore()
          .collection('Deliverly Persons')
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) =>{
                const{username,userimage, role,phonenumber,Status,storeName,Email,storeId,uid} = doc.data()
                dataArr.push({
                    key: doc.id,
                    username,
                    role,
                    phonenumber,
                    uid,
                    Status,
                    storeName,Email,storeId,
                    userimage
                })
             setdeliverlyPesrson(dataArr)
            })
          })
        }
        catch(e){
          console.log(e);
        }
      }
      const assignOrder=async(key)=>{
        setIsSubmitting(true)
        const orders = order 
        const status = order.status
        try{
          const orderDb = await Firebase.firestore().collection("CustomerOrder").doc(order?.key);
         const DB = await Firebase.firestore().collection("Deliverly Persons").doc(key);
         await DB.collection("my Deliveries").add({
           orders,
           status:"Dispatched"
         }).then(()=>{
           DB.update({
             Status:"Assigned"
           });
           orderDb.update({
            status:"Dispatched"
           })           
           setIsSubmitting(false)
          Alert.alert(`data sent`)
          navigation.goBack();
         })
        }catch(e){
          console.log(e);
        }
      }
      console.log(order);
      function renderdeliverlyPersons() {    
        const renderItem = ({ item, index }) => (
          <>
          <View style={styles.card}>
            <Avatar.Image
            style={{width:SIZES.width*0.2}}
              size={74}
              source={{
                uri: item?.userimage,
              }}        
             />
             <View style={{width:SIZES.width*0.38}}>
                <Text style={styles.text}>Name: {item?.username}</Text>
                <Text style={styles.text}>Contacts: {item?.phonenumber}</Text>
                <Text style={styles.text}>Store: {item?.storeName}</Text>
                <Text style={styles.text}>{item?.username}</Text>
             </View>
             <View style={{width:SIZES.width*0.28}}>
               <Text style={styles.text}>{item?.Status}</Text>
               {item?.Status ===`Accepting Orders`?
               <TouchableOpacity
               onPress={() =>assignOrder(item.key)}
                style={styles.assign}
               >
                {isSubmitting ? 
                  <ActivityIndicator animating={true} color={Colors.red800} />
                :
                 <Text style={styles.text}>Assign Me</Text>
                }
               </TouchableOpacity>
               :
               <View></View>
              }
             </View>
             
          </View>
          <Divider/>
          </>
        )
        return(
          <View style={styles.catBody}>
            <Text style={styles.titleText}> Assign This Order: Deliverly Persons</Text>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            data={deliverlyPesrson}
            renderItem={renderItem}
            keyExtractor={item => `${item?.key}`}
          />
        </View>
        )}
    return (
        <View style={styles.container}>
            {renderdeliverlyPersons()}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
    },
    card:{
      flexDirection:'row',
      paddingTop:SIZES.padding2*1.5,
      justifyContent:'space-between',
      alignItems:'center',
      padding:SIZES.padding2,
      backgroundColor:Colors.blueGrey900
    },
    titleText:{
      paddingVertical:SIZES.padding2,
      ...FONTS.h2,
      color:COLORS.white,
      alignSelf:'center',
      fontWeight:'bold'

    },
    text:{
      ...FONTS.h5,
      color:Colors.grey300
    },
    assign: {
      paddingVertical:SIZES.padding,
      paddingHorizontal:SIZES.padding2,
      backgroundColor:Colors.blue900,
      borderColor:Colors.grey200,
      borderWidth:2,
      borderRadius:10
    }
});

//make this component available to the app
export default OrderDispatch;
