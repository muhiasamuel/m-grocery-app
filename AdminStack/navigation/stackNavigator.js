// ./navigation/StackNavigator.js

import React from "react";
import { createStackNavigator } from '@react-navigation/stack'
import Adminhome from "../screens/adminhome";
import Users from "../screens/users";
import { Store } from "../screens";
import { COLORS } from "../../constants/Index";
import Ims from "../screens/ims";
import MainScreen from "../screens/Mainscreen";

const Stack = createStackNavigator();

const screenOptionStyle = {
        headerShown:true,
  headerStyle: {
    backgroundColor: COLORS.bluelight,
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen options={{title: 'Home'}} name="adminHome" component={Adminhome} />
      <Stack.Screen options={{title: 'Users'}} name="users" component={Users} />
      <Stack.Screen
          name='ImageBrowser'
          component={Ims}
          options={{
            title: 'Selected 0 files',
          }}
        />
         <Stack.Screen
          name='Main'
          component={MainScreen}
          options={{
            title: 'Selected 0 files',
          }}
        />
    </Stack.Navigator>
  );
}

const ContactStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Contact" component={Store} />
    </Stack.Navigator>
  );
}

export { MainStackNavigator, ContactStackNavigator };