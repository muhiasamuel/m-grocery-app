// ./navigation/StackNavigator.js

import React from "react";
import { createStackNavigator } from '@react-navigation/stack'
import Adminhome from "../screens/adminhome";
import Users from "../screens/users";
import { AppUsers, CustomersOrder, EditCat, EditStore, OrderDispatch, OrderView, ProductCategories, Products, Store } from "../screens";
import { COLORS } from "../../constants/Index";
import Ims from "../screens/ims";
import EditProds from "../screens/Products/editProducts";
import Ims2 from "../screens/ims2";

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
    </Stack.Navigator>
  );
}
const ManageUsersNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen options={{title: 'ManageUsers'}} name="manageallusers" component={AppUsers} />    
    </Stack.Navigator>
  );
}

const ContactStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Contact" options={{
        headerShown:true,
      }} component={Store} />
    </Stack.Navigator>
  );
}

const StoresStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
       <Stack.Screen name="addStores" component={Store} options={{
        title: "Add Store",
        headerShown:true,
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
        title: "Add Products",
        headerShown:true,
      }}/>
      <Stack.Screen name="editProducts" component={EditProds} options={{
        title: "Edit Products",
      }}/>
    <Stack.Screen
          name="ImageBrowser"
          component={Ims}
          options={{
            title: 'Selected 0 files',
          }}
        />
         <Stack.Screen
          name="ImageBrowser2"
          component={Ims2}
          options={{
            title: 'Selected 0 files',
          }}
        />
    </Stack.Navigator>
    
  );  
}

const CategoryStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
       <Stack.Screen name="addCats" component={ProductCategories} options={{
        title: "Add Categories",
        headerShown:true,
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
export { MainStackNavigator, ContactStackNavigator,OrdersStackNavigator,ManageUsersNavigator, StoresStackNavigator,CategoryStackNavigator,ProductsStackNavigator };