import React from 'react';
import { Animated, FlatList, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text,TouchableOpacity, View, Pressable,Alert, TextInput} from 'react-native'
import {  BasketCount,  TotalOrder } from '../reducers/Actions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import store from '../reducers/store';
import { COLORS, FONTS, SIZES } from '../constants/Index';

const customerDetails = () => {

  const { user} = React.useContext(AuthenticatedUserContext);
  const [CustomerEmail, setCustomerEmail] = React.useState(Email);
  const [CustomerName, setCustomerName] = React.useState(name);
  const [CustomerPhoneNo, setCustomerPhoneNo] = React.useState('');
  //const [CustomerLocation, SetCustomerLocation] =React.useState('')

  React.useEffect(() => {
    const OrderState = store.getState(); 

  }, [])


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
      <View style={{paddingHorizontal:SIZES.padding2*0.5, paddingTop:SIZES.padding, backgroundColor:COLORS.darkblue,flex:0.8  }}>
        <Text style={{alignSelf:'center', ...FONTS.h5,fontWeight:'bold',paddingVertical:SIZES.padding, color:COLORS.white }}>Your deliverly Address Here</Text>
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
                backgroundColor:COLORS.transparent
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
            debounce={300}
          />
        </View>
    )
  }
  ///header
  function renderHeader(){
     return ( 
      <View style={styles.header}>
        <View style={styles.centered}>
         
            <TouchableOpacity
              style={{
                  width:50,
                  paddingLeft: SIZES.padding*0.5 ,
                  justifyContent: 'center'
              }}
              onPress={() => navigation.goBack()}>
                <Fontisto name='arrow-return-left' size={24} color={COLORS.white}/>
            </TouchableOpacity>
            <Text style={styles.PageTitle}>Customer Deliverly Info</Text>
        </View>
          
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
     //user infor form

  function renderUserInfo(){
    return(
      <View style = {styles.userInfoView }>
            <TextInput
              placeholderTextColor={COLORS.white}
              style={styles.input}
              value={CustomerName}
              onChangeText={(text) => setCustomerName(text)}
              autoCapitalize={"none"}
            />
            <View style={[styles.centered,{justifyContent:"space-between"}]}>
             <TextInput
              placeholderTextColor={COLORS.white}
              style={[styles.input,{width:SIZES.width*0.5}]}
              value={CustomerEmail}
              onChangeText={(text) => setCustomerEmail(text)}
              autoCapitalize={"none"}
            />
             <TextInput
              placeholder={'Customer PhoneNo'}
              placeholderTextColor={COLORS.white}
              style={[styles.input,{width:SIZES.width*0.4}]}
              value={CustomerPhoneNo}
              onChangeText={(text) => setCustomerPhoneNo(text)}
              autoCapitalize={"none"}
            />
            </View>
      </View>
    )
  }   
  return (
    <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderUserInfo()}
        {renderPlaces()}
        <TouchableOpacity
          style={styles.btnCheckout}
        >
          <Text style={styles.textCheckout} >CheckOut</Text>
        </TouchableOpacity>
   
      </SafeAreaView>
  )
}

export default customerDetails

const styles = StyleSheet.create({
  container: {
    backgroundColor:COLORS.backgroundColor,
    flex: 1,        
  },
  header:{
      top:0,
      padding:SIZES.padding2*1.5,
      backgroundColor:COLORS.darkblue,
      flexDirection: 'row',
      alignItems:'center',
      justifyContent:'space-between'
  },
  centered: {
    flexDirection: 'row',
    alignItems:'center',
  },
  PageTitle:{
    ...FONTS.h4,
    color:COLORS.white
  },
  label: {
    paddingLeft:10,
    color:COLORS.white,
    padding:2,
    fontSize:20,
    fontWeight:"bold"
  },
input: {
  
  width:SIZES.width*0.93,
  borderColor:COLORS.darkgrey2,
  borderWidth:0.2,
  paddingHorizontal:SIZES.padding2*1.5,
  paddingVertical:10,
  ...FONTS.body4,
  borderRadius:5,
  marginBottom: 12,

  color:COLORS.white,
  backgroundColor: COLORS.transparent,
},
userInfoView: {
  paddingVertical:SIZES.padding2,
  paddingHorizontal:SIZES.padding
},
btnCheckout: {
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'center',
  backgroundColor:COLORS.primary,
  padding:SIZES.padding*0.5,
  borderRadius:SIZES.radius*0.4,
},
textCheckout: {
  color:COLORS.white,
  ...FONTS.body3,
}
})
