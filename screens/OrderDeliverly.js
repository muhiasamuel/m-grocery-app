import * as React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import {MaterialCommunityIcons, MaterialIcons  } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/Index';
import MapViewDirections from 'react-native-maps-directions';




const OrderDeliverly = ({route, navigation})=> {
  const [myorderItems, setmyItems] = React.useState([]);
  const[PriceTotal, setPriceTotal ] = React.useState()
  const [Restaurant,SetRestaurant] = React.useState(null)
  const [currentLocation, SetCurrentLocation ] = React.useState(null) 
  const origin = {latitude: -3.64206, longitude: 39.84593};
const destination = {latitude: -3.14206, longitude: 39.14593};
const GOOGLE_MAPS_APIKEY = 'AIzaSyCUfR1H5K2DBXaGvXGlezNG5h3wwGFU9fM';
  React.useEffect(() =>{
      let{ Restaurant, currentLocation} = route.params;         
          SetRestaurant(Restaurant)
          SetCurrentLocation(currentLocation)

  
  })
  function renderheader() {
    return(
      <View style={styles.header}>
      <TouchableOpacity
      style={{
          width:50,
          paddingLeft: SIZES.padding *2,
          justifyContent: 'center'
      }}
      onPress={() => navigation.goBack()} 
     >
         <MaterialIcons name='arrow-back' size={24} color={COLORS.black}/>
  
     </TouchableOpacity>
     <TouchableOpacity
      style={{
          width:50,
          paddingLeft: SIZES.padding *2,
          justifyContent: 'center'
      }}
      onPress={() => renderMenu()} 
     >
         <MaterialCommunityIcons name='dots-vertical' size={24} color={COLORS.black}/>
  
     </TouchableOpacity>
     
     
  </View>
    )
   
  }
    return (

        <View style={styles.container}>
         {renderheader()}
        <MapView style={styles.map}
        
          provider={PROVIDER_GOOGLE}
          currentLocation={true}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
         >
            <MapViewDirections
              origin={origin}
              apikey={GOOGLE_MAPS_APIKEY}
              destination={destination}
              strokeWidth={3}
              strokeColor="red"
            />
           
         </MapView>
        
      </View>
    )
}

export default OrderDeliverly

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.999-100,
      },
      header:{
        position:'absolute',
        width:'100%',
        top:10,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
})
