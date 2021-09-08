import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { passReset, SignInScreen, SignUpScreen } from '../Authstack';
const Stack = createStackNavigator();
const AuthContainer = () => {
 
  return (  <NavigationContainer>
     <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName={"login"}
  >
    <Stack.Screen name = "passwordreset" component={passReset}/>
    <Stack.Screen name = "login" component={SignInScreen}/>
    <Stack.Screen name = "register" component={SignUpScreen}/>
    </Stack.Navigator>
      </NavigationContainer>
  )

}

export default AuthContainer
