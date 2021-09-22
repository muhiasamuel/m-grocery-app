import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { point } from '@turf/helpers';
import destination from '@turf/destination';
import * as Location from 'expo-location';
import { AuthenticatedUserContext } from '../AuthProvider/AuthProvider';
import { ScrollView } from 'react-native-gesture-handler';

export default class App extends React.Component {
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
      customerOrder:[]  
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
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
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

  fetchToilet = async () => {
    const south = this.state.south;
    const west = this.state.west;
    const north = this.state.north;
    const east = this.state.east;
    const body = `
            [out:json];
            (
                node
                [amenity=kindergarten]
                (${south},${west},${north},${east});

            );
            out;
            `;

    const options = {
      method: 'POST',
      body: body,
    };

    try {
      const response = await fetch(
        'https://overpass-api.de/api/interpreter',
        options
      );
      const json = await response.json();
      this.setState({ elements: json.elements });
    } catch (e) {
      console.log(e);
    }
  };
 renderPlaces(){
    return(
      <View style = {styles.userInfoView }>
        <Text style={[styles.textCheckout,{alignSelf:'center'}]}>USER DELIVERLY ADDRESS</Text>
       <View style={[styles.rowView,{marginTop:15}]}>
        <TextInput
              placeholderTextColor={COLORS.white}
              style={[styles.input,{width:SIZES.width*0.65,borderTopRightRadius:0, borderBottomRightRadius:0,borderWidth:0.5}]}
              placeholder={"Location Search"}
              value={CustomerLocation}
              onChangeText={(text) => SetCustomerLocation(text)}
              autoCapitalize={"none"}
            />
         <TouchableOpacity
         style = {styles.currentLocationBtn}
          onPress={() =>renderMapview()}>
          <Text style={styles.textCheckout}>Use Current Location</Text>
          </TouchableOpacity> 
          </View>       
       </View>
    )
  }
  renderHeader(){
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

 renderUserInfo(){
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
                keyboardType='phone-pad'
                style={[styles.input,{width:SIZES.width*0.4}]}
                value={CustomerPhoneNo}
                onChangeText={(text) => setCustomerPhoneNo(text)}
                autoCapitalize={"none"}
            />
            </View>
        </View>
    )
      } 
   renderMapview(){
    return (
      <View style={styles.container}>
        <MapView
          onRegionChangeComplete={this.onRegionChangeComplete}
          style={styles.mapView}
          showsUserLocation
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
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
            onPress={() => this.fetchToilet()}
            style={styles.button}>
            <Text style={styles.buttonItem}>保育園取得</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  render() {
      return(
          <ScrollView>
              {this.renderHeader()}
              {this.renderUserInfo()}
              {this.renderPlaces()}
              {this.renderMapview()}
          </ScrollView>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  mapView: {
    ...StyleSheet.absoluteFillObject,
  },

  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
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
alignSelf:'center',
justifyContent:'center',
backgroundColor:COLORS.primary,
paddingHorizontal:SIZES.padding2*2,
paddingVertical:SIZES.padding2,
borderRadius:10,
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
width:SIZES.width*0.3,
backgroundColor: COLORS.darkgrey,
paddingHorizontal:SIZES.padding2,
marginTop:-12,
paddingVertical:5.3,
borderBottomRightRadius:7,
borderTopRightRadius:7,
borderWidth:0.5,
borderColor:COLORS.white
}
});
