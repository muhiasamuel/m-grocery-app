// ./navigation/StackNavigator.js

import React from "react";
import { createStackNavigator } from '@react-navigation/stack'
import Adminhome from "../screens/adminhome";
import Users from "../screens/users";
import { CustomersOrder, EditCat, EditStore, OrderDispatch, OrderView, ProductCategories, Products, Store } from "../screens";
import { COLORS } from "../../constants/Index";
import Ims from "../screens/ims";
import MainScreen from "../screens/Mainscreen";
import EditProds from "../screens/Products/editProducts";

const Stack = createStackNavigator();

const screenOptionStyle = {
        headerShown:true,
  headerStyle: {
    backgroundColor: COLORS.darkblue,
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen options={{title: 'Home',  headerShown:false}} name="adminHome" component={Adminhome} />
      <Stack.Screen options={{title: 'Users'}} name="users" component={Users} />
      <Stack.Screen
          name="editStore"
          component={EditStore}
          options={{
            title: 'Edit Store ',
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
      <Stack.Screen name="Contact" options={{
        headerShown:false,
      }} component={Store} />
    </Stack.Navigator>
  );
}

const StoresStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
       <Stack.Screen name="addStores" component={Store} options={{
        title: "Add Store",
        headerShown:false,
      }}/>
      <Stack.Screen name="editStore" component={EditStore} options={{
        title: "Edit Store",
      }}/>
    </Stack.Navigator>
  );  
}
const ProductsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
       <Stack.Screen name="addProducts" component={Products} options={{
        title: "Add Store",
        headerShown:false,
      }}/>
      <Stack.Screen name="editProducts" component={EditProds} options={{
        title: "Edit Products",
      }}/>
    </Stack.Navigator>
  );  
}

const CategoryStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
       <Stack.Screen name="addCats" component={ProductCategories} options={{
        title: "Add Categories",
        headerShown:false,
      }}/>
      <Stack.Screen name="editCats" component={EditCat} options={{
        title: "Edit Categories",
      }}/>
    </Stack.Navigator>
  );  
}
const OrdersStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
       <Stack.Screen name="Orders" component={CustomersOrder} options={{
        title: "Orders",
        headerShown:false,
      }}/>
         <Stack.Screen name="viewOrder" component={OrderView} options={{
        title: "View Order",
      }}/>
        <Stack.Screen name="dispatchOrder" component={OrderDispatch} options={{
        title: "Dispatch Order",
      }}/>
    </Stack.Navigator>
  );  
}
export { MainStackNavigator, ContactStackNavigator,OrdersStackNavigator, StoresStackNavigator,CategoryStackNavigator,ProductsStackNavigator };