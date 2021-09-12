import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import DrawerNavigator from '../../AdminStack/navigation/drawerNavigator';

const Stack = createStackNavigator();
const AdminScreens = () => {
 
  return ( 
     <NavigationContainer>
        <DrawerNavigator/>
   </NavigationContainer>
  )

}

export default AdminScreens
