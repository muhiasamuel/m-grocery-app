import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';
import { point } from '@turf/helpers';
import destination from '@turf/destination';
import * as Location from 'expo-location';
import { AuthenticatedUserContext } from '../AuthProvider/AuthProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS, FONTS, SIZES } from '../constants/Index';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import * as geofire from 'geofire-common';
import store from '../reducers/store';
import Firebase from '../firebaseConfig';
import * as Linking from 'expo-linking';
import firebase from 'firebase/app';
import "firebase/storage";
import 'firebase/firestore';

export default class CutomerDetails extends React.Component {
   static contextType = AuthenticatedUserContext 
  constructor(props) {
   
    super(props);
    this.state = {
      elements: [],
      south: null,
      west: null,
      north: null,
      east: null,
      latitude: null,
      longitude: null,
      CustomerEmail:null,
      CustomerName:null,
      CustomerPhoneNo:null,
      User:null,
      mapVisibility:false,
      customerOrder:[],
      submitting:false,  
    };
  }

  updateState(location) {
    this.setState({
      ...this.state,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }

  async componentDidMount() {
    const {user, AuthUserRole:currentUser} = this.context;
    this.setState({
      User: currentUser,
      CustomerEmail:user.email,
      CustomerPhoneNo:`${currentUser.phonenumber}`,
      CustomerName:currentUser.username,
    })
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
      this.updateState(location);
    } catch (error) {
      console.log(error);
    }
  }

  onRegionChangeComplete = (region) => {
    const center = point([region.longitude, region.latitude]);
    const verticalMeter = (111 * region.latitudeDelta) / 2;
    const horizontalMeter = (111 * region.longitudeDelta) / 2;
    const options = { units: 'kilometers' };
    const south = destination(center, verticalMeter, 180, options);
    const west = destination(center, horizontalMeter, -90, options);
    const north = destination(center, verticalMeter, 0, options);
    const east = destination(center, horizontalMeter, 90, options);
    this.setState({
      south: south.geometry.coordinates[1],
      west: west.geometry.coordinates[0],
      north: north.geometry.coordinates[1],
      east: east.geometry.coordinates[0],
    });
  };

  orderSubmit = async () => {
    this.setState({
      submitting:true,
      mapVisibility:false
    })
    const order = store.getState();
    const long = this.state.longitude;
    const lat = this.state.latitude;
    const hash = geofire.geohashForLocation([lat, long])
    const docId = Firebase.firestore().collection("CustomerOrder").doc().id
    try{
      await await Firebase.firestore().collection("CustomerOrder").doc(docId).set({
        geohash: hash,
        customerEmail: this.state.CustomerEmail,
        customer: this.state.User,
        lat: lat,
        lng: long,
        customerOrder: order,
        createdAt : firebase.firestore.FieldValue.serverTimestamp()
      }).then(() =>{
        this.setState({
          submitting:false
        })
        alert('order Sent!')
      })

    }catch(e){
      console.log(e);
    }
  };
 renderPlaces(){
    return(
      <View style = {styles.userInfoView }>
        <Text style={[styles.textCheckout,{alignSelf:'center'}]}>CUSTOMER DELIVERLY ADDRESS</Text>
       <View style={[styles.rowView,{marginTop:15}]}>
        <TextInput
              placeholderTextColor={COLORS.white}
              style={[styles.input,{width:SIZES.width*0.65,borderTopRightRadius:0, borderBottomRightRadius:0,borderWidth:0.5}]}
              placeholder={"Location Search"}
              autoCapitalize={"none"}
            />
         <TouchableOpacity
         style = {styles.currentLocationBtn}
          onPress={() =>this.setState({mapVisibility:!this.state.mapVisibility})}>
          <Text style={styles.textCheckout}>Use My Current Location</Text>
          </TouchableOpacity> 
          </View>       
       </View>
    )
  }
  renderHeader(){
    const { navigation } = this.props;
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
           }}>
           </TouchableOpacity>     
       </View>
     )}

 renderUserInfo(){
 
    return(
        <View style = {styles.userInfoView }>
          <Text style={{...FONTS.body4, color:COLORS.white}}>Please Confirm Your Contact Info</Text>
            <TextInput
                placeholderTextColor={COLORS.white}
                style={styles.input}
                value={this.state.CustomerName}
                onChangeText={(text) => this.setState({CustomerName:text})}
                autoCapitalize={"none"}
            />
            <View style={[styles.centered,{justifyContent:"space-between"}]}>
                <TextInput
                placeholderTextColor={COLORS.white}
                style={[styles.input,{width:SIZES.width*0.5}]}
                value={this.state.CustomerEmail}
                onChangeText={(text) => this.setState({CustomerEmail:text})}
                autoCapitalize={"none"}
            />
                <TextInput
                placeholder={'Customer PhoneNo'}
                placeholderTextColor={COLORS.white}
                keyboardType='phone-pad'
                style={[styles.input,{width:SIZES.width*0.4}]}
                value={this.state.CustomerPhoneNo}
                onChangeText={(text) => this.setState({CustomerPhoneNo:text})}
                autoCapitalize={"none"}
            />
            </View>
        </View>
    )
      } 
   renderMapview(){
    return (
      <View style={styles.mapcontainer}>
        <MapView
          onRegionChangeComplete={this.onRegionChangeComplete}
          style={styles.mapView}
          showsUserLocation
          initialRegion={{
            latitude: this.state?.latitude,
            longitude: this.state?.longitude,
            latitudeDelta: 0.02, 
            longitudeDelta: 0.02,
          }}>
          {this.state.elements.map((element) => {
            let title = '保育園';
            if (element.tags['name'] !== undefined) {
              title = element.tags['name'];
            }
            return (
              <MapView.Marker
                coordinate={{
                  latitude: element.lat,
                  longitude: element.lon,
                }}
                title={title}
                key={'id_' + element.id}
              />
            );
          })}
        </MapView> 
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.orderSubmit()}
            style={styles.btnCheckout}>
            <Text style={[styles.textCheckout,{...FONTS.h4,fontWeight:'bold', color:'white'}]}>Submit Your Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  render() {
      return(
        <View style={styles.container}>
           {this.renderHeader()}
          <ScrollView >             
              {
               this.state.mapVisibility == true ?
                <>               
                {this.renderUserInfo()}
                {this.renderPlaces()} 
                {this.renderMapview()}
                
                </>
                :
                <>
                {this.renderUserInfo()}
                {this.renderPlaces()} 
                <View>
                  {this.state.submitting && (
                    <>
                  <ActivityIndicator color={COLORS.white} size='large'/>
                  <Text style={{color:COLORS.white, alignSelf:'center'}}>submitting...</Text>
                  </>
                  )}
               </View> 
               <TouchableOpacity
                  onPress={() => Linking.openURL(`google.navigation:q=${this.state.latitude}, ${this.state.longitude}`)}
                  style={styles.btnCheckout}>
                  <Text style={[styles.textCheckout,{...FONTS.h4,fontWeight:'bold', color:'white'}]}>Open Maps</Text>
                </TouchableOpacity> 
                </>
              }
                        
          </ScrollView>
        </View>

      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapcontainer: {
    height:SIZES.height*0.59,
    width:SIZES.width*0.98,
    backgroundColor: '#fff',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },

  mapView: {
 
    ...StyleSheet.absoluteFillObject,
  },

  buttonContainer: {
    marginVertical: 5,
  },

  button: {
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,235,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },

  buttonItem: {
    textAlign: 'center',
  },
  header:{
    top:0,
    width:SIZES.width,
    padding:SIZES.padding2*1.2,
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
borderWidth:0.5,
paddingHorizontal:SIZES.padding2*1.5,
paddingVertical:10,
...FONTS.body4,
borderRadius:5,
marginBottom: 12,

color:COLORS.white,
backgroundColor: COLORS.transparent,
},
userInfoView: {
paddingTop:SIZES.padding*0.5,
paddingHorizontal:SIZES.padding
},
btnCheckout: {
flexDirection:'row',
alignSelf:'center',
justifyContent:'center',
backgroundColor:'rgba(100,180,200,0.7)',
paddingHorizontal:SIZES.padding2*2,
paddingVertical:SIZES.padding2,
borderRadius:10,
borderColor:COLORS.primary,
borderWidth:2
},
textCheckout: {
color:COLORS.white,
...FONTS.body3,
},
maps: {
flex:1
},
rowView: {
flexDirection:'row',
alignItems:'center'
},
currentLocationBtn:{
width:SIZES.width*0.30,
backgroundColor: COLORS.darkgrey,
paddingHorizontal:SIZES.padding2*0.4,
marginTop:-13,
paddingVertical:5.3,
borderBottomRightRadius:7,
borderTopRightRadius:7,
borderWidth:0.5,
borderColor:COLORS.white
}
});
