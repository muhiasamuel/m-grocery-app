import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Animated, FlatList, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Pressable,Alert } from 'react-native'

import { COLORS, FONTS, images, SIZES } from '../constants/Index'
import Categories from './categories'
const Restaurant = ({route, navigation}) => {

    const scrollX = new Animated.Value(0);
    const [Restaurant,SetRestaurant] = React.useState(null)
    const [currentLocation, SetCurrentLocation ] = React.useState(null)
    const [orderItems, setOrderItems] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    React.useEffect(() =>{
        let{item, currentLocation} = route.params;

        SetRestaurant(item)
        SetCurrentLocation(currentLocation)
    })
     function editOrder(action, menuId, price,name) {
        
        let orderList = orderItems.slice()
        let item = orderList.filter(a => a.menuId == menuId)
        if (action == "+") {
          if (item.length > 0) {
              let newQty = item[0].qty + 1
              item[0].qty = newQty
              item[0].total = item[0].qty * price
          } else {
              const newItem = {
                  name: name,
                  menuId: menuId,
                  qty: 1,
                  price: price,
                  total: price
              }
              orderList.push(newItem)
          } 
          setOrderItems(orderList )  
        } else {
            if (item.length > 0) {
               if (item[0]?.qty > 0) {
                   let newQty = item[0].qty - 1
                   item[0].qty = newQty
                   item[0].total = newQty * price 
               } 
            }
            setOrderItems(orderList)
        }
    }
    function getOrderQty(menuId) {
        let orderItem = orderItems.filter(a => a.menuId == menuId)
        if (orderItem.length>0) {
            return orderItem[0].qty
        }
        return 0
    }
    function getBasketCount() {
        let itemCount = orderItems.reduce((a, b) =>a + (b.qty || 0),0)
        return itemCount
    }
    function sumOrder() {
        let total = orderItems.reduce((a,b) => a + (b.total || 0), 0)
        return total.toFixed(2)
    }
    function ShowOrderItems(){
            navigation.navigate('myOrderList', navigation.setOptions={
                orderItems,
                sumOrder
           
                
            })
      
         
    }
    function renderHeader(){
        return(
            <View style={{flexDirection:"row", height:50,backgroundColor:'rgb(2, 2, 28)',marginBottom:6}}>
                <TouchableOpacity
                 style={{
                     width:50,
                     paddingLeft: SIZES.padding *2,
                     justifyContent: 'center'
                 }}
                 onPress={() => navigation.goBack()} 
                >
                    <MaterialIcons name='arrow-back' size={24} color={COLORS.white}/>

                </TouchableOpacity>
                <View style={{
                  flex: 1, alignItems:'center',justifyContent:'center' 
              }}>
                  <View style={{
                      padding:SIZES.padding2*0.9,
                      backgroundColor: COLORS.white,
                      alignItems:'center',
                      justifyContent:'center',
                      borderRadius: SIZES.radius
                  }}>
                      <Text style={{...FONTS.h4, color:COLORS.black, fontStyle:'italic'}}>{Restaurant?.name} stores</Text>
                  </View>
              </View>
              <TouchableOpacity
                style={{
                    width:60,
                    padding: SIZES.padding,
                    justifyContent: 'center',
                    right: 6,
                    top:-5
                }}
                onPress = {() => ShowOrderItems()}
              >
                  {getBasketCount() > 0 ? 
                     <Text style=
                     {{backgroundColor:'red',
                     width:'70%',
                      height:'60%',
                      color:COLORS.white,
                       borderRadius:50,
                       top:6, 
                       left:20, 
                       justifyContent:'center',
                       textAlign:'center'}}>
                           {getBasketCount()}
                      </Text>:
                     <Text></Text>   
                }
                  
                  <MaterialCommunityIcons name= 'cart-outline' size={27} color={COLORS.white}/>
              </TouchableOpacity>
            </View>
        )
    }
    function renderFoodInfo(){
        return(
           <Animated.ScrollView
               pagingEnabled
               scrollEventThrottle={16}
               snapToAlignment="center"
               showsHorizontalScrollIndicator={false}
               onScroll={Animated.event([
                   {nativeEvent: {contentOffset:{x : scrollX}}}
               ], {useNativeDriver: false})}
               style={{
                  
               }}       
           >
               {
                   Restaurant?.menu.map((item, index) =>(
                       <View
                        key={`menu-${index}`}
                        style={{alignItems:'center'}}
                       >
                             <View
                     style={{
                         height: SIZES.height * 0.35
                     }}
                    >
                        <Image
                         source={item.photo}
                         resizeMode='cover'
                         style={{
                             top: 20,
                             borderRadius:15,
                             width:SIZES.width * 0.99,
                             height: '90%'
                         }}
                        />
                        {/**Quantity */}
                        <View
                            style={
                                {
                                    position:'absolute',
                                    bottom:-28,
                                    width: SIZES.width,
                                    height: 45,
                                    justifyContent:'center',
                                    flexDirection:'row'
                                }
                            }
                         >
                            <TouchableOpacity
                                style={{
                                    width:50,
                                    backgroundColor: COLORS.white,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    borderTopLeftRadius:25,
                                    borderBottomLeftRadius:25
                                }}
                                onPress = {() => editOrder("-", item.menuId, item.price, item.name)}
                            >
                                <Text style={{...FONTS.body1}}>
                                <FontAwesome name='minus-circle' size={20} color={COLORS.black}/>    
                                </Text>
                            </TouchableOpacity>
                            <View 
                                style={{
                                    width:50,
                                    backgroundColor: COLORS.white,
                                    alignItems:'center',
                                    justifyContent:'center'
                                }}
                            >
                                <Text style={{...FONTS.h2, fontWeight:'bold'}}> {getOrderQty(item.menuId)} </Text>
                            </View>
                            <TouchableOpacity  style={{
                                    width:50,
                                    backgroundColor: COLORS.white,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    borderTopRightRadius:25,
                                    borderBottomRightRadius:25
                                }}
                                onPress = {() => editOrder("+", item.menuId, item.price, item.name)}
                            >
                                <Text style={{...FONTS.body1}}>
                                  <FontAwesome name='plus-circle' size={20} color={COLORS.black}/>  
                                </Text>
                           
                        </TouchableOpacity>
                        </View>
                      
                    </View>
                    <View 
                        style={{
                            width: SIZES.width,
                            alignItems: 'center',
                            marginTop: 25,
                            paddingHorizontal:SIZES.padding *2
                        }}
                    >
                        <Text style={{marginVertical:20, textAlign:'center', ...FONTS.h3}}> {item.name} - {item.price.toFixed(2)} ksh </Text>
                        <Text style={{...FONTS.body3}}> {item.description} </Text>
                    </View>
                    {/**calories */}
                    <View 
                     style={{
                         flexDirection: 'row',
                         marginTop: 10,
                     }}
                    >
                        <MaterialCommunityIcons name='fire' color={'orange'} size={22}/>
                        <Text
                            style={{
                                ...FONTS.body3,
                                color:COLORS.darkgrey
                            }}
                        >
                            {item.calories.toFixed(2)}cal
                        </Text>

                    </View>

                </View>
                  
        ))
               }
           </Animated.ScrollView> 
        )
    }
    function renderDots() {
        const dotsPosition = Animated.divide(scrollX, SIZES.width)
        return(
            <View style={{height:30}}>
                <View 
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: SIZES.padding 
                    }}
                >
                    {
                        Restaurant?.menu.map((item, index) =>{
                          const opacity = dotsPosition.interpolate({
                              inputRange:[index-1, index, index+1],
                              outputRange:[0.3, 1, 0.3],
                              extrapolate:'clamp'
                          }) 
                          const dotSize = dotsPosition.interpolate({
                            inputRange:[index-1, index, index+1],
                            outputRange:[SIZES.base* 0.8, 10, SIZES.base * 0.8],
                            extrapolate:'clamp'
                        }) 
                        const dotColor = dotsPosition.interpolate({
                            inputRange:[index-1, index, index+1],
                            outputRange:[COLORS.darkgrey, COLORS.primary, COLORS.darkgrey],
                            extrapolate:'clamp'
                        }) 
                        return(
                            <Animated.View
                                key={`dot-${index}`}
                                opacity={opacity}
                                style={{
                                    borderRadius: SIZES.radius,
                                    marginHorizontal:6,
                                    width:dotSize,
                                    height:dotSize,
                                    backgroundColor:dotColor
                                }}
                            >

                            </Animated.View>     
                        ) 
                        })
                    }

                </View>
            </View>
        )
    }
    function renderOrder() {
        return(
            <View>
                 {renderDots()}
                 <View style={{
                     backgroundColor: COLORS.darkgrey4,
                     borderTopLeftRadius:40,
                     borderTopRightRadius:40
                 }}>
                     
                     <View
                     style={{
                        flexDirection:'row',
                        justifyContent: 'space-between',
                        paddingVertical: SIZES.padding * 1.5,
                        paddingHorizontal: SIZES.padding * 3,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.transparent

                    }}
                     >
                         <View style={{flexDirection: 'row'}}>
                         <EvilIcons name='location' size={25} color={COLORS.green}/>
                         <Text style={{marginLeft:SIZES.padding, ...FONTS.h4}}>Location</Text>
                         </View>
                         <View style={{flexDirection:'row'}}>
                             <Fontisto name= 'mastercard' size={20} color={COLORS.green} />
                             <Text style={{marginLeft:SIZES.padding,...FONTS.h4}}>888</Text>
                         </View>
                        
                     </View>

                     {/**Order Button*/}
                     <View 
                        style={{
                            borderWidth:0,
                            padding:SIZES.padding * 1.3,
                            alignItems:'center',
                            justifyContent:'center'
                        }}
                     >
                       

                     </View>
                 </View>
            </View>
           
        )
    }
    return (
        <SafeAreaView style={styles.Container}>
            {renderHeader()}
            
            <Categories/>
            <ScrollView>
            {renderFoodInfo()}
            
            {renderOrder()}
            </ScrollView>
            <View style={{
                         flexDirection:'row',
                         justifyContent: 'space-between',
                         paddingVertical: SIZES.padding * 1,
                         paddingHorizontal: SIZES.padding * 3,
                    

                     }}>
                         <Text style={{...FONTS.h4}}> {getBasketCount()} Items in Cart</Text>
                         <Text style={{...FONTS.h4}}>ksh{sumOrder()} </Text>

                     </View>
                     <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'transparent',}}>
            <TouchableOpacity
                            style={{
                                width:SIZES.width*0.6,
                                padding:SIZES.padding*0.6,
                                backgroundColor: COLORS.primary,
                                alignItems: 'center',
                                justifyContent:'center',
                                borderRadius: SIZES.radius
                            }}
                            onPress = {() => navigation.navigate('myOrderList',{
                                    orderItems,
                                    sumOrder,
                               Restaurant: Restaurant,
                               currentLocation: currentLocation }
                            )}
                         >
                             <Text style={{color:COLORS.white,...FONTS.h1}}>Order</Text>
                         </TouchableOpacity>
                         <View>
                             <Text></Text>
                         </View>
                         </View>
        </SafeAreaView>
    )
}

export default Restaurant

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: COLORS.darkgrey2
    },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
})
