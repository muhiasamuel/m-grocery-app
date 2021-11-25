//import liraries
import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Animated, FlatList, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text,TouchableOpacity, View, Pressable,Alert} from 'react-native'
import { AddProduct, BasketCount, filtredOrderPrds, ProductQty, RemoveAllItem, RemoveProduct, TotalOrder } from '../reducers/Actions';
import { COLORS, FONTS,SIZES } from '../constants/Index'
import store from '../reducers/store';
import { useTheme } from 'react-native-paper';
// create a component
const productDetails =  ({route, navigation}) => {
    const scrollX = new Animated.Value(0);
    const [product,SetProduct] = React.useState(null);
    const [modalVisible,setModalVisible] = React.useState(false);
    const [basketCount,setBasketCount] = React.useState(store.getState().BasketCount);
    const [productCount,setProductCount] = React.useState();
    const [basketItem,setBasketItem] = React.useState();
    const [PriceTotal,SetPriceTotal] = React.useState();

    React.useEffect(() =>{
        let{item} = route.params;
        SetProduct(item);
    })

    function getOrderProductId(id){
      let myOrderProducts = store.getState().orderItems;
      console.log(myOrderProducts);
    }
   // store.dispatch(AddProduct(1, 500))   
    //store.dispatch(TotalOrder())
    //store.dispatch(ProductQty(1))
    //const state = store.getState()
    function AddOrder(id, price, name,image,unit,prodStoreid) {
      store.dispatch(AddProduct(id, price,name,image,unit,prodStoreid))
      store.dispatch(filtredOrderPrds(id))      
      store.dispatch(ProductQty(id))
      store.dispatch(TotalOrder())
      store.dispatch(BasketCount())
      setBasketItem(store.getState().filteredOrder)
      setBasketCount(store.getState().BasketCount)
      SetPriceTotal(store.getState().total)
      setProductCount(store.getState().itemCount)
      console.log(store.getState());
      console.log(basketItem);

    }
    function RemoveOrder(id, price) {
      store.dispatch(RemoveProduct(id, price))
      store.dispatch(filtredOrderPrds(id)) 
      store.dispatch(ProductQty(id))
      store.dispatch(BasketCount())
      store.dispatch(TotalOrder())
      setBasketItem(store.getState().filteredOrder)
      setBasketCount(store.getState().BasketCount)
      SetPriceTotal(store.getState().total)
      setProductCount(store.getState().itemCount)
      console.log(store.getState());
      console.log(basketItem);
    
    }
    function goBack(){      
      navigation.goBack()
      store.dispatch(BasketCount())
    } 
    function removeAll(id){
      store.dispatch(RemoveAllItem(id))
      store.dispatch(filtredOrderPrds(id)) 
      store.dispatch(ProductQty(id))
      store.dispatch(BasketCount())
      store.dispatch(TotalOrder())
      setBasketItem(store.getState().filteredOrder)
      SetPriceTotal(store.getState().total)
      setBasketCount(store.getState().BasketCount)
      setProductCount(0)
      console.log(store.getState());
      console.log(basketItem);


    }
    function renderContinue () {
      if (basketCount > 0) {
          navigation.navigate("myOrderList"
           )
      } else {
          Alert.alert(
              "Alert!",
              "First Add Items In The Cart To Continue",
          [
              {text: "Cancel",
               onPress:()=> console.log('ok'),
               style:"cancel"
              },
              {text: "Ok",
               onPress:() => setModalVisible(true)}
          ]) 
      }
  }
     
    function renderHeader(){
        return(
            <View style={styles.headerView}>
                <TouchableOpacity
                 style={styles.backArrow}
                 onPress={() =>goBack()}>
                    <MaterialIcons name='arrow-back' size={24} color={COLORS.white}/>
                </TouchableOpacity>
                <View style={styles.storeMainview}>
                  <View style={styles.storeSubview}>
                      <Text style={styles.storeTitle}>{product?.prodname}</Text>
                  </View>
              </View>
              <TouchableOpacity
                style={styles.cartCount}
                onPress = {() => renderContinue()}> 
                {basketCount > 0 ? 
                     <Text style={styles.getBasketCount}>
                          {basketCount}
                      </Text>:
                     <Text></Text>   
                }                
                                
                    <MaterialCommunityIcons name= 'cart-outline' size={27} color={COLORS.white}/>
              </TouchableOpacity>
            </View>
        )
    }
    function renderModal() {
        return(
            <View style={styles.centeredView}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <Text style={[styles.Titles,{marginBottom:10,alignSelf:'center'}]}>Cart Details:</Text>
                  <Text style={styles.modalText}>Quantity Variation: {product?.prodprice}</Text>
                  <View style={styles.centered} >                    
                       <Text style={styles.textStyle}>Unit Price: ksh {basketItem?.price}</Text>
                      <Text style={styles.textStyle}style={styles.textStyle}>Total Price: Ksh {basketItem?.total}</Text>
                      <Text style={styles.textStyle}>Items: {basketItem?.qty}</Text>
                  </View>
                  <Text style={[styles.SmallText,{margin:15,marginLeft:-8, color:COLORS.darkgrey4}]}>Total Price For All Items In Cart: ksh {PriceTotal}</Text>
                      {/**Quantity */}
                      <View style={styles.OrderIncrementView}>
                            <TouchableOpacity
                                style={[styles.OrderIncrement,{borderTopLeftRadius:25,
                                  borderBottomLeftRadius:25}]}
                                onPress = {() =>  RemoveOrder(product?.key,product?.prodprice)}
                            >
                                <Text style={{...FONTS.body1}}>
                                <FontAwesome name='minus-circle' size={20} color={COLORS.black}/>    
                                </Text>
                            </TouchableOpacity>
                            <View 
                                style={styles.OrderIncrement} >
                                <Text style={{...FONTS.h2, fontWeight:'bold'}}> {productCount}</Text>
                            </View>
                            <TouchableOpacity  style={[styles.OrderIncrement,{borderTopRightRadius:25,
                                    borderBottomRightRadius:25}]}
                                onPress = {() =>  AddOrder(product?.key,product?.prodprice,product?.prodname, product?.imageUrls[0].url,product?.productUnit,product?.prodStoreid)}
                            >
                                <Text style={{...FONTS.body1}}>
                                  <FontAwesome name='plus-circle' size={20} color={COLORS.black}/>  
                                </Text>
                           
                             </TouchableOpacity>
                        </View>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={[styles.textStyle,{color:COLORS.blackSecondary}]}> OK </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, styles.buttonReset]}
                    onPress={() => removeAll(product?.key)}
                  >
                    <Text style={styles.textStyle}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )
    }
    //scrollable product images 
    function renderProductInfo() {
        return(
         <View>   
            <Animated.ScrollView
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            snapToAlignment="center"
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([
                {nativeEvent: {contentOffset:{x : scrollX}}}
            ], {useNativeDriver: false})}>
                {
                product?.imageUrls.map((item, index) =>(
                  
                    <View                    
                        key={`imageUrls-${index}`}
                        style={{alignItems:'center'}}>
                        <View style={{
                            height: SIZES.height * 0.35,
                            backgroundColor:'rgb(13,12,9)'
                            }}>
                            <Image
                        source={{uri: item.url}}
                        resizeMode='cover'
                        style={styles.productIMGS}/>
                        </View>
                    </View>    
                ))
                }
         
            </Animated.ScrollView>
            {renderDots()}
            <View style={styles.productInfoView}>
                    <Text style={styles.productName}> {product?.prodname}</Text>
                    <View style={styles.productPricingView}>
                    <Text style={styles.Titles}>Product Pricing</Text>
                            <View
                            style={styles.centered}>
                                    <Text style={[styles.SmallText, {flexDirection:'row'}]}>Ksh {product?.prodprice} / {product?.productUnit} </Text>   
                            </View>
                     
                    
                    </View>
                    <Text style={[styles.Titles,{marginTop:15,}]}>Product Specifications</Text>
                    <View style={styles.prodDescriptionView}>                  
                        <Text style={[styles.SmallText,{...FONTS.body4,fontWeight:'normal'}]}> {product?.proddetails} </Text>   
                    </View>
                </View>
               
            </View>
            
        )
    }
    function renderDots() {
        const dotsPosition = Animated.divide(scrollX, SIZES.width)
        return(
            <View style={styles.DotmainView}>
                <View style={styles.DotsView}>
                    {
                        product?.imageUrls.map((item, index) =>{
                          const opacity = dotsPosition.interpolate({
                              inputRange:[index-1, index, index+1],
                              outputRange:[0.9, 1, 0.9],
                              extrapolate:'clamp'
                          }) 
                          const dotSize = dotsPosition.interpolate({
                            inputRange:[index-1, index, index+1],
                            outputRange:[SIZES.base* 0.99, 12, SIZES.base * 0.99],
                            extrapolate:'clamp'
                        }) 
                        const dotColor = dotsPosition.interpolate({
                            inputRange:[index-1, index, index+1],
                            outputRange:[COLORS.white, COLORS.primary, COLORS.white],
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
    function renderProductUserReviews() {
        return(
            <View>
                <View style={styles.userReviews}>
                    <View style={styles.centered}>
                        <MaterialCommunityIcons name="star" size={20} color={COLORS.primary}/>
                        <MaterialCommunityIcons name="star" size={20} color={COLORS.primary}/>
                        <MaterialCommunityIcons name="star" size={20} color={COLORS.darkgrey}/>
                        <MaterialCommunityIcons name="star" size={20} color={COLORS.darkgrey}/>
                        <MaterialCommunityIcons name="star" size={20} color={COLORS.darkgrey}/>   
                    </View>   
                    <View style={styles.centered}>
                        <Text style={{color:COLORS.white}}>0 reviews |</Text>
                        <Text style={{color:COLORS.white}}> Orders |</Text>
                        <Text style={{color:COLORS.white}}> Wish</Text> 
                    </View>
                    <TouchableOpacity style={styles.shareBtn} >
                        <Fontisto name="share" size={20} color={COLORS.primary}/>
                    </TouchableOpacity>       
                    
                </View>
                <Text style={[styles.Titles, {marginTop:10, alignSelf:'center'}]}> Reviews</Text> 
                <View style={styles.productReviewCount}>
                    <Text style={styles.SmallText}>0 Reviews</Text>             
                </View>
                <Text style={[styles.Titles, {marginTop:10, alignSelf:'center'}]}>Similar Products</Text>
                <View style={styles.similarProductsView}>
                    <Text style={styles.SmallText}>No Similar Products Yet</Text>
                </View>
            </View>
        )
        
    }
    function renderOrder() {
        return(
            <View style={styles.OrderMainView}>
              <View   style={styles.cartCountBottom}>
              
              <TouchableOpacity              
                onPress = {() => ShowOrderItems()}>
                <MaterialCommunityIcons name= 'cart-outline' size={39} color={COLORS.white}/> 
                {productCount > 0 ? 
                     <Text style={styles.getItemCount}>
                          {productCount}
                      </Text>:
                     <Text style={styles.NoItemCount}></Text>   
                }              
                                
                    
              </TouchableOpacity>
              </View>
               
                    <TouchableOpacity 
                    style={[styles.btnContinue,{backgroundColor:COLORS.white,marginLeft:-40}]}
                    onPress = {() => renderContinue()}>
                        <Text style={{...FONTS.h4,fontWeight:'bold', color:COLORS.black,}}>
                           Order Now
                        </Text>
                    </TouchableOpacity>                 
                 <TouchableOpacity 
                    style={styles.btnContinue}
                    onPress={() => setModalVisible(true)}
                    >
                    <Text style={{...FONTS.h3,fontWeight:'bold',  color:COLORS.white,}}>
                        Add To Cart
                    </Text>
                </TouchableOpacity>    
            </View>
        )        
    }
    return (
        <SafeAreaView style={styles.Container}>
           {renderHeader()}
            <ScrollView>
           
            {renderProductInfo()}
            {renderProductUserReviews()}
            {renderModal()}
            </ScrollView>
          
            {renderOrder()}
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#2c3e50',
    },
    headerView: {
        flexDirection:"row", 
        height:55,
        backgroundColor:'rgb(2, 2, 18)',
        marginBottom:2
    },
    backArrow: {
        width:50,
        paddingLeft: SIZES.padding *2,
        justifyContent: 'center'
    },
    storeMainview: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center'
    },
    storeSubview: {
        padding:SIZES.padding2*0.9,
        marginBottom:9,
        backgroundColor: COLORS.white,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: SIZES.radius
    },
    storeTitle: {
        ...FONTS.h4, 
        color:COLORS.black, 
        fontStyle:'normal'
    },
    cartCount: {
        width:60,
        padding: SIZES.padding,
        justifyContent: 'center',
        right: 6,
        top:-5
    },
    
    btnContinue:{
        borderWidth:2,
        borderColor:'#fff',
        padding:10,
         alignItems:'center', 
         justifyContent:'center',
         borderRadius: 10 
    },
    centeredView: {
      flex:1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 78,
      },
      modalView: {
        margin: 20,
        width:SIZES.width,        
        backgroundColor:  COLORS.blackSecondary || 'rgb(20, 30, 38)',
        borderRadius: 20,
        padding: 35,
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
        width:SIZES.width*0.2,
        position:'absolute',
        bottom:-2,
        left:0,
        borderBottomLeftRadius:20,
        borderRadius: 10,
        borderColor:COLORS.blackSecondary,
        borderWidth:1,
        padding: 10,
      },
      btn: {
        width:SIZES.width*0.2,
        position:'absolute',
        bottom:-2,
        right:0,
        borderBottomRightRadius:20,
        borderRadius: 10,
        borderColor:COLORS.blackSecondary,
        borderWidth:1,
        padding: 10,
      },
      buttonClose: {
        backgroundColor: COLORS.darkgrey4,
        color:COLORS.blackSecondary,
      },
      buttonReset: {
        backgroundColor: COLORS.primary,
        color:COLORS.white,
      },
      textStyle: {
        color:COLORS.white,
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        color:COLORS.white,
      },
      OrderIncrement: {
        width:50,
        backgroundColor: COLORS.white,
        alignItems:'center',
        justifyContent:'center',
      },
      OrderIncrementView: {
        position:'absolute',
        bottom:-22,
        width: SIZES.width,
        height: 45,
        justifyContent:'center',
        flexDirection:'row'
      },
      productIMGS: {
        top: 2,
        borderRadius:1,
        borderBottomRightRadius:25,
        borderBottomLeftRadius:25,
        width:SIZES.width,
        height: '85%',
      },
      productInfoView: {
        backgroundColor:'rgb(29,27,37)',
        width: SIZES.width,
        alignItems: 'center',
        marginTop: -19,
        padding:10,
        borderTopRightRadius:22,
        borderTopLeftRadius:22,
        paddingHorizontal:SIZES.padding *2
      },
      productName: {
        marginVertical:10,color:COLORS.white, textAlign:'center', ...FONTS.h3
      },
      productPricingView: {
        padding:7,width:SIZES.width, marginTop:0, backgroundColor:'rgb(17,16,17)', alignItems:'center'
      },
      Titles:{
        ...FONTS.h2,color:COLORS.darkgrey4 
      },
      SmallText: {
        ...FONTS.body3, color:COLORS.white
      },
      prodDescriptionView: {
        marginTop:2,backgroundColor:COLORS.blackSecondary,padding:10,width:SIZES.width
      },
      DotmainView: {
        height:49, marginTop:0, backgroundColor:COLORS.blackSecondary, alignItems:'center'
      },
      DotsView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: SIZES.padding 
      },
      userReviews: {          
        height:50,
        backgroundColor:COLORS.blackSecondary,
        marginTop:0,
        padding:6,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
      },
      centered: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
      },
      shareBtn: {
        padding:9,
        backgroundColor:'rgb(15,57,78)',
        borderRadius:25
      },
      productReviewCount: {
        height:70,
        backgroundColor:COLORS.blackSecondary,
        marginTop:3,
        padding:6,
        justifyContent:'center'
      },
      similarProductsView: {
        backgroundColor:COLORS.blackSecondary,
        marginTop:3,
        paddingHorizontal:7,
        paddingVertical:16,
        justifyContent:'center'
      },
      OrderMainView: {
        flexDirection:'row',
        padding:10,
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:COLORS.blackSecondary,
        borderTopLeftRadius:18, 
        borderTopRightRadius:18,
        borderTopWidth:0.5,
        borderTopColor:'grey'
      },
      getBasketCount: {
        backgroundColor:'red',
        width:'70%',
        height:'60%',
        color:COLORS.white,
        borderRadius:50,
        top:6, 
        left:20, 
        justifyContent:'center',
        textAlign:'center'
      },      
        cartCountBottom: {
          paddingTop:-25,
          paddingBottom:7
      },
      getItemCount: {
        position:'absolute',
        borderWidth:2,
        borderColor:COLORS.darkgrey3,
        backgroundColor:COLORS.green,
        color:COLORS.white,
        borderRadius:50,
        padding:5,
        top:-14, 
        left:18, 
        justifyContent:'center',
        textAlign:'center'
      },
      NoItemCount: {
        position:'absolute',
        padding:0,
        top:0, 
        left:0, 
      } 


});

//make this component available to the app
export default productDetails;
