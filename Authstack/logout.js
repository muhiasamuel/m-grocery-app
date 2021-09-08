import React from 'react';
import { Animated, FlatList, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text,TouchableOpacity, View, Pressable,Alert} from 'react-native'
import { AddProduct, BasketCount, filtredOrderPrds, ProductQty, RemoveAllItem, RemoveProduct, TotalOrder } from '../reducers/Actions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS, SIZES } from '../constants/Index';
export default function customerDetails(){

const homePlace = {
  description: 'Home',
  geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};
const workPlace = {
  description: 'Work',
  geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};

function renderPlaces(){
  return(
    <View style={{ paddingTop:SIZES.padding, flex: 1,height:500, backgroundColor:COLORS.backgroundColor }}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed="auto" // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
            console.log(data);
            console.log(details);
          }}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyCUfR1H5K2DBXaGvXGlezNG5h3wwGFU9fM',
            language: 'en', // language of the results
            types: '(cities)', // default: 'geocode'
          }}
          styles={{
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            types: 'food',
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          predefinedPlaces={[homePlace, workPlace]}
          debounce={200}
        />
      </View>
  )
}
///header
function renderHeader(){
   return ( 
    <View style={styles.header}>
          <TouchableOpacity
          style={{
              width:50,
              paddingLeft: SIZES.padding *2,
              justifyContent: 'center'
          }}
          onPress={() => navigation.goBack()}>
              <Fontisto name='arrow-return-left' size={24} color={COLORS.white}/>
          </TouchableOpacity>
          <TouchableOpacity
          style={{
              width:50,
              paddingLeft: SIZES.padding *2,
              justifyContent: 'center'
          }}
          onPress={() => renderMenu()}>
              <MaterialCommunityIcons name='dots-vertical' size={24} color={COLORS.darkgrey2}/>
          </TouchableOpacity>     
      </View>
    )}


  
    return (
      <SafeAreaView style={styles.container}>
        {renderPlaces()}
        {renderHeader()}
      </SafeAreaView>
    );

}

const styles = StyleSheet.create{(
  
)}
