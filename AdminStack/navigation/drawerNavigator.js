// ./navigation/DrawerNavigator.js

import React from "react";

import { createDrawerNavigator,  DrawerContentScrollView,
    DrawerItem } from "@react-navigation/drawer";
import { ContactStackNavigator, MainStackNavigator } from "./stackNavigator";
import BottomTabNavigator from "./tabNavigator";
import { ProductCategories, Products, Store } from "../screens";
import { COLORS } from "../../constants/Index";
import { StyleSheet, Text } from "react-native";
import { EvilIcons, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Users from "../screens/users";
import CustomersOrder from "../screens/CustomersOrder";
import Stocks from "../screens/Stocks";

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({navigation}) => {
  return (
      <>   
    <Drawer.Navigator
        screenOptions={{
            headerShown:false,
            headerStyle: {
                backgroundColor: COLORS.darkblue
              },
              headerTintColor: "white",
              headerBackTitle: "Back",
              itemStyle: { alignItems:'flex-end' },            
        }}
        style={styles.drawer}
        drawerPosition='right'
       
    >
      <Drawer.Screen
    options={{
        title: 'Home',
        drawerIcon: ({focused, size}) => (
            <Ionicons
                name="md-home"
                size={size}
                color={focused ? '#7cc' : 'skyblue'}
            />
        ),
        }}
       name="home" 
       component={BottomTabNavigator} />
      <Drawer.Screen 
         options={{
            title: 'Contact',
            drawerIcon: ({focused, size}) => (
                <Ionicons
                    name='phone-portrait'
                    size={size}
                    color={focused ? '#7cc' : 'skyblue'}
                />
            ),
            }}
      name="Contact" component={ContactStackNavigator} />
      <Drawer.Screen
       options={{
        title: 'Products',
        drawerIcon: ({focused, size}) => (
            <Ionicons
                name="md-home"
                size={size}
                color={focused ? '#7cc' : 'skyblue'}
            />
        ),
        }}
      name="products" component={Products} />
      <Drawer.Screen 
       options={{
        title: 'Product Categories',
        drawerIcon: ({focused, size}) => (
            <Ionicons
                name='ios-chevron-forward-circle-outline'
                size={size}
                color={focused ? '#7cc' : 'skyblue'}
            />
        ),
        }}
      name="productcategories" component={ProductCategories} />
      <Drawer.Screen 
       options={{
        title: 'Stores',
        drawerIcon: ({focused, size}) => (
            <Feather
                name='smartphone'
                size={size}
                color={focused ? '#7cc' : 'skyblue'}
            />
        ),
        }}
      name="store" component={Store}/>

       <Drawer.Screen 
       options={{
        title: 'Customer Orders',
        drawerIcon: ({focused, size}) => (
            <Feather
            name='shopping-cart'
                size={size}
                color={focused ? '#7cc' : 'skyblue'}
            />
        ),
        }}
      name="orders" component={CustomersOrder}/>

        <Drawer.Screen 
       options={{
        title: 'Stock Levels',
        drawerIcon: ({focused, size}) => (
            <Feather
                name='hexagon'
                size={size}
                color={focused ? '#7cc' : 'skyblue'}
            />
        ),
        }}
      name="stocks" component={Stocks}/>

      <Drawer.Screen
        options={{
            title: 'Users',
            drawerIcon: ({focused, size}) => (
            <EvilIcons
                name='user'
                size={32}
                color={focused ? '#7cc' : 'skyblue'}
            />
        ),
        }}
       name="users" 
       component={Users} /> 
    </Drawer.Navigator>
    </>
    

    
  );
}

export default DrawerNavigator;
const styles = StyleSheet.create({
    drawer: {
        backgroundColor: COLORS.blackSecondary,
        marginTop:50
    }
})