import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { StatusBar, StyleSheet } from 'react-native'
import { Storeitems, productDetails,  customerDetails } from '../../screens';
import Tabs from '../../Navigation/tabs';
import myOrderList from '../../screens/myOrderList';
import MyComponent from '../../screens/test';
const Stack = createStackNavigator();
const ScreensContainer = () => { 



  return (
     <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName={"home"}>    
          <Stack.Screen name = "ProductDetails" component={productDetails}/>
          <Stack.Screen name = "Storeitems" component={Storeitems}/>
          
          <Stack.Screen name = "home" component={Tabs}/>
          <Stack.Screen name = "myOrderList" component={myOrderList}/>
          <Stack.Screen name = "customerDetails" component={customerDetails}/>
          <Stack.Screen name = "userinfo" component={Tabs}/>
          <Stack.Screen name = "test" component={MyComponent}/>

        </Stack.Navigator>
      </NavigationContainer>
  )

}

export default ScreensContainer
