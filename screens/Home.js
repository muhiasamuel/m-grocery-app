import { AntDesign, EvilIcons, FontAwesome, FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useContext } from 'react'
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AuthenticatedUserContext } from '../AuthProvider/AuthProvider'
import { COLORS, FONTS, images, SIZES } from '../constants/Index'
import {restaurantData,
    categoryData,
    initialCurrentLocation}
     from '../constants/mydata'
import Firebase from '../firebaseConfig'
import "firebase/auth"
const Home = ({navigation}) => {
    //DUMMY DATA
const [ restaurant, setRestaurant] = React.useState(restaurantData)
const [currentlocation, setCurrentLocation] = React.useState(initialCurrentLocation)

const { user } = useContext(AuthenticatedUserContext);

const auth = Firebase.auth();

 function getCategoryById(id) {
     let category = categoryData.filter(a =>a.id == id)
     if (category.length > 0) {
       return category[0].name  
     }
     return ""
 }
 const LogOutUser = async function() {
    try {
        await auth.signOut();
      } catch (error) {
        console.log(error);
      }
}

  function renderHeader() {
      return(
          <View style={{flexDirection:"row", height:70,backgroundColor:'rgb(3,3,29)'}}>
              <TouchableOpacity
                style={{
                    width: 50,
                    padding: SIZES.padding,
                    justifyContent: 'center'
                }}
              >
                  <EvilIcons name='chevron-down' size={30} color={'white'} />

              </TouchableOpacity>
              <View style={{
                  flex: 1, alignItems:'center',justifyContent:'center' 
              }}>
                  <View style={{
                      width:'70%',
                      height: '60%',
                      backgroundColor: COLORS.white,
                      alignItems:'center',
                      justifyContent:'center',
                      borderRadius: SIZES.radius
                  }}>
                      <Text style={{...FONTS.h2, color:COLORS.black, fontStyle:'normal'}}>Main Stores</Text>
                  </View>
              </View>
              <TouchableOpacity
                style={{
                    width: 50,
                    padding: SIZES.padding ,
                    justifyContent: 'center'
                }}
                onPress = {() => LogOutUser()}
              >
                  <MaterialCommunityIcons name= 'dots-vertical' size={30} color={'white'}/>

              </TouchableOpacity>
              

          </View>
      )
  }
     
     function renderestaurantList(){
        const renderItem = ({item}) =>(
             <TouchableOpacity style={{marginBottom: SIZES.padding* 2}}
             onPress = {() => navigation.navigate("Storeitems", {
                 item,
             })} 
             >
                 <View style={{marginBottom:SIZES.padding}}>
                     <Image
                     source={item.photo}
                     resizeMode="cover"
                     style= {{
                        width:SIZES.width * 0.97,
                        height: 200,
                         borderRadius: SIZES.radius*0.3,

                        
                     }}
                     />
                 
                 <View style={{
                     position: 'absolute',
                     bottom: 0,
                     height: 50,
                     width: SIZES.width * 0.3,
                     backgroundColor: COLORS.darkgrey,
                     borderTopRightRadius: SIZES.radius,
                     borderBottomLeftRadius: SIZES.radius*0.3,
                     alignItems:'center',
                     justifyContent:'center',
                     ...styles.shandow
                     
                 }}>
                 <Text style={
                    { ...FONTS.h4, color:COLORS.white}
                 }>{item.duration}</Text> 
                 </View> 
                 </View>
               <Text style={{...FONTS.body2,color:COLORS.white}}> {item.name} </Text>
                  <View style={{marginTop:SIZES.padding2, flexDirection:'row'}}>
                    {/*ratin*/}
                    <MaterialCommunityIcons name="star" size={20} color={COLORS.primary}/> 
                    <Text style= {{...FONTS.body3, marginLeft:8,color:COLORS.white}}>{item.rating}</Text>
                    {/*CATEGORIES */}
                    <View
                    style={{
                        flexDirection: 'row',
                        marginLeft: 10, 
                    }}
                    >
                        {item.categories.map((data) =>{
                            
                            return(
                                
                                <View
                                 style={{flexDirection:'row'}}
                                 key={data}
                                 
                                >
                                    <Text style={{...FONTS.body3, color:COLORS.white}}>{getCategoryById(data)}</Text>
                                    
                                    <Text style={{...FONTS.h3,color:COLORS.white}}> . </Text>
                                </View>
                            )
                        })}
                        {
                            [1,2,3].map((priceRating)=>(
                                <Text
                                    key={priceRating}
                                    style={{
                                        ...FONTS.body3,    
                                        color:(priceRating <= item.priceRating) ?COLORS.black: COLORS.darkgrey}}
                                >
                                   $ 
                                </Text>
        ))
                        }
                    
                    
                    </View>  
                  </View> 
             </TouchableOpacity>
         )
        return(
            <FlatList
                data={restaurant}
                keyExtractor={item => `${item.id}`}
                 renderItem={renderItem}
                 showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding*0.5,
                    paddingBottom:25,
                }}
            />
        )
    }
    
    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <View style={styles.title}>
                <Text style={styles.titletext}>Our Main Stores</Text>
                <Text style={{color:COLORS.white}}>Buy from a store near You </Text>
            </View>
            {renderestaurantList()}
        </SafeAreaView>
    )
}


export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
        color:COLORS.white
    },
    shandow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity : 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    title:{
        color:COLORS.white,
        flexDirection:'row',
        padding:SIZES.padding2,
        flexDirection:'column',
        justifyContent:'center',
        textAlign:'center',

    },
    titletext:{
        color:COLORS.white,
        fontWeight:'bold',
        lineHeight:24,
        fontSize:24,
    }

})
