import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Home, OrderDeliverly, Restaurant, userInfo } from '../screens';
import { AntDesign, FontAwesome, FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS } from '../constants/Index';
import Svg, {Path, Circle, Rect } from 'react-native-svg';


const Tab = createBottomTabNavigator();

const TabBarCustomButton = ({ accessibilityState, children,onPress}) =>{
    var isSelected = accessibilityState.selected
    if (isSelected) {
        return(
         <View style={{flex: 1, alignItems:'center'}}>
             <View style={{flexDirection:'row', position: 'absolute', top:0}}>
                 <View style={{flex:1, backgroundColor:COLORS.white}}></View>
                <Svg height={75} width={60} viewBox="0 0 75 60">
                    <Path 
                        d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
                        fill={COLORS.white}
                    />
                </Svg>
                <View style= {{flex:1, backgroundColor: COLORS.white}}></View>
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
                backgroundColor:COLORS.white
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
            }
        }}
       >
           <Tab.Screen
           name="Home"
           component={Home}
           options={{
            headerShown:false,
               tabBarIcon: ({focused}) =>(
                 <MaterialCommunityIcons name ="home-circle" size={28} color ={focused ?COLORS.primary: COLORS.black }/>
               ),
               tabBarButton: (props) => (
                   <TabBarCustomButton
                     {...props}
                   />
               )
           }}/>
     
               <Tab.Screen
           name="heart"
           component={Home}
           options={{
            headerShown:false,
               tabBarIcon: ({focused}) =>(
                 <FontAwesome name = "heart" size={25} color ={focused ?COLORS.primary: COLORS.black }/>
               ),
               tabBarButton: (props) => (
                <TabBarCustomButton
                  {...props}
                />
            )
           }}/>
               <Tab.Screen
           name="user"
           component={userInfo}
           options={{
               headerShown:false,
               tabBarIcon: ({focused}) =>(
                 <AntDesign name = "user" size={25} color ={focused ?COLORS.primary: COLORS.black }/>
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
