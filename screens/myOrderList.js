import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Animated, FlatList, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text,TouchableOpacity, View, Pressable,Alert} from 'react-native'
import { AddProduct, BasketCount, filtredOrderPrds, ProductQty, RemoveAllItem, RemoveProduct, TotalOrder } from '../reducers/Actions';
import { COLORS, FONTS,SIZES } from '../constants/Index'
import store from '../reducers/store';
import { AuthenticatedUserContext } from '../AuthProvider/AuthProvider';
// create a component

const myOrderList = ({route, navigation}) => {
    const {Products} = React.useContext(AuthenticatedUserContext);
    const [myorderItems, setmyItems] = React.useState([]); 
    const [CurrentBasketState, SetCurrentBasketState ] = React.useState(store.getState());
    const [orderDetails, SetOrderDetails] = React.useState([]) 
    const [productCount,setProductCount] = React.useState();
    const [basketItem,setBasketItem] = React.useState();
    React.useEffect(() =>{ 
        const prods = CurrentBasketState?.orderItems.map(data=>{
           SetOrderDetails(CurrentBasketState?.orderItems)
            return getproductsByIds(data.productId)[0];
        })
        
        setmyItems(prods) 
    },[])
    console.log(myorderItems);
   function getproductsByIds(id) {
        let prods = Products.filter(a =>a.key == id)
        if (prods.length > 0) {
            return prods;  
        }
        return ""
    }
    console.log(orderDetails);
    function AddOrder(id, price) {
        store.dispatch(AddProduct(id, price))
        store.dispatch(filtredOrderPrds(id))      
        store.dispatch(ProductQty(id))
        store.dispatch(TotalOrder())
        store.dispatch(BasketCount())

        SetCurrentBasketState(store.getState())

        setBasketItem(store.getState().filteredOrder)
  
      }
      function RemoveOrder(id, price) {
        store.dispatch(RemoveProduct(id, price))
        store.dispatch(filtredOrderPrds(id)) 
        store.dispatch(ProductQty(id))
        store.dispatch(BasketCount())
        store.dispatch(TotalOrder())

        SetCurrentBasketState(store.getState())

        setBasketItem(store.getState().filteredOrder)
      
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

        SetCurrentBasketState(store.getState())

        setBasketItem(store.getState().filteredOrder)
        setProductCount(0)
  
  
      }
    function renderMenu() {
        return(
           Alert.alert( "Alert",
           "First Add Items In The Cart To Continue",)
        )
    }
    function renderHeader()     
    {
       return ( <View style={styles.header}>
            <TouchableOpacity
            style={{
                width:50,
                paddingLeft: SIZES.padding *2,
                justifyContent: 'center'
            }}
            onPress={() => navigation.goBack()} 
            >
                <Fontisto name='arrow-return-left' size={24} color={COLORS.white}/>

            </TouchableOpacity>
            <TouchableOpacity
            style={{
                width:50,
                paddingLeft: SIZES.padding *2,
                justifyContent: 'center'
            }}
            onPress={() => renderMenu()} 
            >
                <MaterialCommunityIcons name='dots-vertical' size={24} color={COLORS.darkgrey2}/>

            </TouchableOpacity>
            
            
        </View>) 
    }
    function renderCartItems() {    
        const renderItem = ({ item }) => (
          <View underlayColor='rgb(122, 22, 65)'       
          >
            <View style={styles.bodycontainer}>
              <Image style={styles.bodyphoto} source={{uri: item?.imageUrls[0].url}} />
              <View>
                <Text style={[styles.bodytitle,{color: COLORS.darkgrey4, width:SIZES.width*0.35}]}>{item?.prodname}</Text>
                
                <Text style={[styles.bodycategory,
                    {color:COLORS.white,padding:5, }]}>
                        ksh {item?.prodprice} / {item?.productUnit}
                </Text>
                <View style={styles.OrderIncrementView}>
                    <TouchableOpacity
                        style={[styles.OrderIncrement,{borderTopLeftRadius:25,
                        borderBottomLeftRadius:25}]}
                        onPress = {() =>  RemoveOrder(item?.key,item?.prodprice)} >
                        <Text style={{...FONTS.body1}}>
                            <FontAwesome name='minus-circle' size={20} color={COLORS.black}/>    
                        </Text>
                    </TouchableOpacity>
                   
                        <View 
                        style={styles.OrderIncrement} >
                        <Text style={{...FONTS.h2, fontWeight:'bold'}}>{orderDetails?.qty} </Text>
                    </View>
                   
                    
                    <TouchableOpacity  style={[styles.OrderIncrement,{borderTopRightRadius:25,
                            borderBottomRightRadius:25}]}
                            onPress = {() =>  AddOrder(item?.key,item?.prodprice)} >
                        <Text style={{...FONTS.body1}}>
                            <FontAwesome name='plus-circle' size={20} color={COLORS.black}/>  
                        </Text>                    
                    </TouchableOpacity>
                </View>
              </View>
              <View>
              <Text style={[styles.btntext,]}> Total:</Text>
              <Text style={[styles.btntext,]}> ksh </Text>
                <TouchableOpacity
                        style={[styles.btnContinue,{backgroundColor:'rgb(250,170,20)'}]}
                        onPress={() => removeAll(item?.key)}>
                        <Text style={styles.btntext}>Reset</Text>
                  </TouchableOpacity>
               

              </View>
          
            
            </View>
          </View>
        )
        return(
          <View style={styles.catBody}>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            data={myorderItems}
            renderItem={renderItem}
            keyExtractor={item => `${item?.key}`}
          />
        </View>
        )}

        function renderTotals(){
            return(
                <View style={styles.totals}>
                    <View style={styles.totalCentered}>
                        <View>
                            <Text style={styles.btntext}>Items in Your Cart: {CurrentBasketState?.BasketCount} </Text>
                            <Text style={styles.btntext}>Total Payable Amount: ksh {CurrentBasketState?.total}</Text>
                        </View> 
                        <TouchableOpacity
                            style={styles.btnContinue }
                            onPress={() =>navigation.navigate('customerDetails')}
                        >
                            <Text style={styles.btntext}>CheckOut</Text>
                        </TouchableOpacity>                       
                    </View>   
                </View>
            )
        }
     
    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderCartItems()}
            {renderTotals()}
        </SafeAreaView>

    )
}

export default myOrderList

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
    ScrollView: {
        padding:SIZES.padding,
        
    },
    bodycontainer: {
        width:SIZES.width,
        marginTop:3,
        backgroundColor:COLORS.blackSecondary,
        padding:SIZES.padding*0.5,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between'

    },
    bodyphoto: {
        width:SIZES.width*0.23,
        height:75,
        borderRadius:50

    },
    OrderIncrement: {
        width:50,
        backgroundColor: COLORS.white,
        alignItems:'center',
        justifyContent:'center',
      },
     

    OrderIncrement: {
        width:50,
        backgroundColor: COLORS.white,
        alignItems:'center',
        justifyContent:'center',
      },
      OrderIncrementView: {
         
        bottom:0,
        height: 45,
        justifyContent:'center',
        flexDirection:'row'
      },
    totals: {
        marginTop:70,
        position:'absolute',
        padding:SIZES.padding*1.2,
        bottom:0,
        width:SIZES.width,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        backgroundColor:COLORS.blackSecondary,
    },
    totalCentered:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    btnContinue:{
        backgroundColor:COLORS.primary,
        borderWidth:2,
        borderColor:'#fff',
        padding:10,
        alignItems:'center', 
        justifyContent:'center',
        borderRadius: 10 
    },
    btntext:{
        color:COLORS.white,
        ...FONTS.h5,

    },
    buttonReset: {

    }
    
})
