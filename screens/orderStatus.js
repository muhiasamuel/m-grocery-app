//import liraries
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import React, { Component,useEffect,useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView,TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, images, SIZES } from '../constants/Index'
import "firebase/storage";
import 'firebase/firestore';
import * as Linking from 'expo-linking';
import Firebase from '../firebaseConfig';
import { Badge } from 'react-native-paper';
import { AuthenticatedUserContext } from '../AuthProvider/AuthProvider';

// create a component
const OrderView = ({route, navigation}) => {
    const { user } = React.useContext(AuthenticatedUserContext);
    const[orderItem, setOrderItem] = useState('');
    const[products, setProducts] = useState([]);
    const[submitting, setisSubmitting] = useState(false);
    useEffect(() => {
        getCustomerCurrentOrder();
        setProducts(orderItem.orderItems);
    },[])
    const getCustomerCurrentOrder = async() =>{
        try{
            await Firebase.firestore()
            .collection('CustomerOrder')
            .where('customerEmail', '==', user.email)
            .orderBy("createdAt").limit(3)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) =>{
                console.log(doc.data()); 
                setOrderItem(doc.data());        
              })
            })
          }
          catch(e){
            console.log(e);
          }  
        
    }

    function renderOrdersView() {
   
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
