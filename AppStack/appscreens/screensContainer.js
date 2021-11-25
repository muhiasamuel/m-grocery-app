import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Storeitems, productDetails,  customerDetails, myProfile } from '../../screens';
import Tabs from '../../Navigation/tabs';
import myOrderList from '../../screens/myOrderList';
import orderStatus from '../../screens/orderStatus';
import { COLORS } from '../../constants/themes';
const Stack = createStackNavigator();
const ScreensContainer = () => { 



  return (
     <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
              headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.darkblue,
              },
              headerTintColor: "white",
              headerBackTitle: "Back",
            }}
            initialRouteName = {"home"}>    
          <Stack.Screen name = "ProductDetails" component={productDetails}/>
          <Stack.Screen name = "Storeitems" component={Storeitems}/>
          <Stack.Screen name = "orderstatus" 
            options={{
              headerShown:true,
              title: 'YOUR ORDER STATUS ',
            }}
          component={orderStatus}/>
          <Stack.Screen name = "myProfile" component={myProfile}/>
          <Stack.Screen name = "home" component={Tabs}/>
          <Stack.Screen name = "myOrderList" component={myOrderList}/>
          <Stack.Screen name = "customerDetails" component={customerDetails}/>
          <Stack.Screen name = "userinfo" component={Tabs}/>

        </Stack.Navigator>
      </NavigationContainer>
  )

}

export default ScreensContainer
