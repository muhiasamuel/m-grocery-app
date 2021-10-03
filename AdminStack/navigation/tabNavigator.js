import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { AntDesign, FontAwesome, FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons'
import Svg, {Path, Circle, Rect } from 'react-native-svg';
import { COLORS } from '../../constants/Index';
import Adminhome from '../screens/adminhome';
import Users from '../screens/users';


const Tab = createBottomTabNavigator();

const TabBarCustomButton = ({ accessibilityState, children,onPress}) =>{
    var isSelected = accessibilityState.selected
    if (isSelected) {
        return(
         <View style={{flex: 1, alignItems:'center'}}>
             <View style={{flexDirection:'row', position: 'absolute', top:0}}>
                 <View style={{flex:1, backgroundColor:COLORS.backgroundColor1}}></View>
                <Svg height={80} width={80} viewBox="0 0 75 50">
                    <Path 
                        d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
                        fill={COLORS.backgroundColor1}
                    />
                </Svg>
                <View style= {{flex:1, backgroundColor: COLORS.backgroundColor1}}></View>
             </View>
                 <TouchableOpacity
                    style={{
                        top:-22.5,
                        justifyContent:'center',
                        alignItems:'center',
                        width:50,
                        height:50,
                        borderRadius:25,
                        backgroundColor:COLORS.white
                    }} 
                    onPress={onPress}>
                     {children}   
                  </TouchableOpacity>  
      
         </View>  
       )
        
    } else{
        return(
            <TouchableOpacity
            style={{
                flex:1,
                height:60,
                backgroundColor:COLORS.backgroundColor1
            }}
            activeOpacity={1} 
            onPress={onPress}>
             {children}   
          </TouchableOpacity>  
        )
    }
}
const tabs = () => { 
    return (
       <Tab.Navigator
        screenOptions={{
            showLabel: false,
            style: {
                borderTopWidth: 0,
                backgroundColor:COLORS.transparent,
                elevation:0
            },
            headerTintColor: "white",
            headerBackTitle: "Back",
        }}
       >
           <Tab.Screen
           name="Home"
           component={Adminhome}
           options={{
            headerShown:true,
            headerStyle: {
                backgroundColor: COLORS.darkblue,
              },
               tabBarIcon: ({focused}) =>(
                 <MaterialCommunityIcons name ="home-circle" size={28} color ={focused ?COLORS.primary: COLORS.darkgrey4 }/>
               ),
               tabBarButton: (props) => (
                   <TabBarCustomButton
                     {...props}
                   />
               )
           }}/>
     
               <Tab.Screen
           name="Favorites"
           component={Adminhome}
           options={{
            headerShown:true,
            headerStyle: {
                backgroundColor: COLORS.darkblue,
              },
               tabBarIcon: ({focused}) =>(
                 <FontAwesome name = "heart" size={25} color ={focused ?COLORS.primary: COLORS.darkgrey4 }/>
               ),
               tabBarButton: (props) => (
                <TabBarCustomButton
                  {...props}
                />
            )
           }}/>
               <Tab.Screen
           name="user"
           component={Users}
           options={{
               headerShown:true,
               headerStyle: {
                backgroundColor: COLORS.darkblue,
              },
               tabBarIcon: ({focused}) =>(
                 <AntDesign name = "user" size={25} color ={focused ?COLORS.primary: COLORS.darkgrey4 }/>
               ),
               tabBarButton: (props) => (
                <TabBarCustomButton
                  {...props}
                />
            )
           }}/>
       </Tab.Navigator> 
    )
}

export default tabs

const styles = StyleSheet.create({})
