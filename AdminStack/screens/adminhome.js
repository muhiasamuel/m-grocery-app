import React from 'react'
import { StyleSheet, ScrollView, View,TouchableOpacity, Text, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, ImageBackground, Image } from "react-native";
import firebase from 'firebase/app'
import "firebase/firestore";
import { COLORS, FONTS, images, SIZES } from "../../constants/Index";
import { Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Firebase from "../../firebaseConfig";
import { AuthenticatedUserContext } from "../../AuthProvider/AuthProvider";
import { Avatar, Colors, Title,Badge } from "react-native-paper";

const Adminhome = ({navigation}) => {

  function renderCards(){
    return(
      <View style={styles.cardView}>
        <Title style={[styles.titleText,{...FONTS.h2,color: COLORS.white}]}>Admin Home</Title>
        <View style={styles.cardrow}>
          <TouchableOpacity style ={styles.pannels}
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
          <TouchableOpacity style ={styles.pannels}
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
          <TouchableOpacity style ={styles.pannels}
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
          <TouchableOpacity style ={styles.pannels}
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
          <TouchableOpacity style ={styles.pannels}
            onPress={()=> navigation.navigate("CustomersOrders")}

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
          <TouchableOpacity style ={styles.pannels}
            onPress={()=> navigation.navigate("CustomersOrders")}
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
        <ScrollView style={styles.center}>
          {renderCards()}
        <Text>This is the home screen</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('users')}
        >
            <Text>press me</Text>
        </TouchableOpacity>
      </ScrollView>
    )
}

export default Adminhome

const styles = StyleSheet.create({
    center: {
        flex: 1,
        backgroundColor:COLORS.backgroundColor
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
        color:Colors.blueGrey800
      },
      text:{
        color:COLORS.darkblue,
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
      }
})
