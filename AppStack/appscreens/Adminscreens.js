import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { ProductCategories, Products,Store } from '../../AdminStack/screens';

const Stack = createStackNavigator();
const AdminScreens = () => {
 
  return (  <NavigationContainer>
     <StatusBar style = 'auto'/>
     <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName={"prodcats"}
  >
    <Stack.Screen name = "prodcats" component={ProductCategories}/>
    <Stack.Screen name = "prodstore" component={Store}/>
    <Stack.Screen name = "prods" component={Products}/>
    </Stack.Navigator>
   </NavigationContainer>
  )

}

export default AdminScreens
