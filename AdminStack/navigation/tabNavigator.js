// ./navigation/TabNavigator.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ContactStackNavigator, MainStackNavigator } from "./stackNavigator";
import { Store } from "../screens";


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions = {{
        headerShown:false
    }}
    >
      <Tab.Screen name="mainStack" component={MainStackNavigator}/>
      <Tab.Screen name="search" component={Store}/>
      <Tab.Screen name="Contacts" component={ContactStackNavigator} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;