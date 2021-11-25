import { AntDesign, Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Animated, FlatList, Image, SafeAreaView,  StyleSheet, Text, TouchableOpacity, View,Modal, TouchableNativeFeedback } from 'react-native'
import { RecipeCard } from '../constants/AppStyles'
import store from '../reducers/store';
import { COLORS, FONTS,  SIZES } from '../constants/Index'
import { AddProduct, BasketCount, filtredOrderPrds, ProductQty, RemoveAllItem, RemoveProduct, TotalOrder } from '../reducers/Actions';
import Firebase from '../firebaseConfig';
import "firebase/storage";
import 'firebase/firestore';
import { AuthenticatedUserContext } from '../AuthProvider/AuthProvider';
import { Colors, Searchbar } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
const Storeitems = ({route, navigation}) => {
    const {Products, setProducts,catData, setCatData, storeData, setStoreData} = React.useContext(AuthenticatedUserContext);

    const scrollX = new Animated.Value(0);
    const [Store,SetStore] = React.useState(null)
    const [StoreProducts,SetStoreProducts] = React.useState(null)
    const [storecategories,SetStoreCategories] = React.useState([]);
    const [storeItems,SetstoreItems] = React.useState();
    const [selectedCategory, setSelectedCategory ] = React.useState(null)
    const [basketCount,setBasketCount] = React.useState(store.getState().BasketCount);
    const [filteredStoreProducts, setfilteredStoreProducts] = React.useState('');
    const [productCount,setProductCount] = React.useState();
    const [modalVisible, setModalVisible] = React.useState(false)
    const [basketItem,setBasketItem] = React.useState(null);
    const [currentCartItem, setcurrentCartItem] = React.useState(null)
    const [PriceTotal,SetPriceTotal] = React.useState();
    const [query,setQuery] = React.useState('');
    React.useEffect(() =>{
        let {item} = route.params;
        SetStore(item); 
            
        getProductsData();
        getStoreData(); 
        getCatData();
        getProductByStoreData(item?.key);
               
    },[])
    const getProductsData = async () => {
        try{
          const dataArr = [];
        
            const response=Firebase.firestore().collection('Products');
            const data=await response.get();
            data.docs.forEach(item=>{
              const {prodname, proddetails,prodprice, imageUrls,productUnit, prodId,proddiscount,prodcatid,prodStoreid} = item.data();
              dataArr.push({
               key: item.id,
                prodname,
                proddetails,
                prodprice,
                imageUrls,
                proddiscount,
                prodStoreid,
                prodcatid,
                prodId,
                productUnit
              });
                setProducts(dataArr)      
                
            })
        }
        catch(e){
          console.log(e);
        }
      }
   //fe   
   const getStoreData = async () => {
        try{
          const dataArr = [];
            const response=Firebase.firestore().collection('Stores');
            const data= await response.get();
            data.docs.forEach(item=>{
              const {storeName,storeId, storeDetails,storeLocation, storeimage} = item.data();
              dataArr.push({
                key: item.id,
                storeId,
                storeName,
                storeDetails,
                storeLocation,
                storeimage
              });
              setStoreData(dataArr)
            })
        }
        catch(e){
          console.log(e);
        }
      }   
    //fetch category data from firebase backed  
     const getCatData = async () => {
        try{
          const catArr = [];
            const response=Firebase.firestore().collection('ProductCategories');
            const data=await response.get();
            data.docs.forEach(item=>{
              const {catdetails, catname,catId, catimage} = item.data();
              catArr.push({
                key: item.id,
                catdetails,
                catId,
                catname,
                catimage,
              });
              setCatData(catArr)
            })
        }
        catch(e){
          console.log(e);
        }
      }
      //get products in a store using store id
      function getProductByStoreData(id){
          let storeProducts = Products.filter(a => a.prodStoreid == id)
          if (storeProducts.length > 0) {
              const uniqProd = [...new Set(storeProducts)]
            SetStoreProducts(uniqProd);
           
          const cats = storeProducts.map(d =>{
               return getCategoryByIds(`${d.prodcatid}`)[0] 
            }) 
            const uniq = [ ...new Set(cats ) ];             
            SetStoreCategories(uniq) 
            }
          return "";
      }
    function getCategoryByIds(id) {
        let category = catData.filter(a =>a.key == id) 
            
        if (category.length > 0) {
          return category;           
        }
        return ""
    }
    //filter products by category
     function getProductbyCategory(categoryId){
        const productsArray = []
        StoreProducts.map(data =>{
            if (data.prodcatid == categoryId) {
                productsArray.push(data);           
            }  
            
        });
        return productsArray;
        
    }
    function onselectCategory(category) {
        //filter data
        const catsProdsids = getProductbyCategory(category.key)
        SetstoreItems(catsProdsids);
        setSelectedCategory(category)
    }
    //search Productss
    function searchProducts(query){
      SetstoreItems(StoreProducts.filter(i=>i.prodname.toLowerCase().includes(query.toLowerCase())))
    }
    ///Add items to cart
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
    const AddtoCart = (item) => {
      
        setcurrentCartItem(item)
        store.dispatch(filtredOrderPrds(item?.key)) 
        setModalVisible(!modalVisible)
        
    }

    const modalClose = () =>{
      setBasketItem();
      setModalVisible(!modalVisible)     
      console.log(basketItem);
    }
 
    function renderHeader(){
        return(
            <View style={styles.headerView}>
                <TouchableOpacity
                 style={styles.backArrow}
                 onPress={() => navigation.goBack()}>
                    <MaterialIcons name='arrow-back' size={24} color={COLORS.white}/>
                </TouchableOpacity>
                <View style={styles.storeMainview}>
                  <View style={styles.storeSubview}>
                      <Text style={styles.storeTitle}>{Store?.storeName} stores</Text>
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
               <TouchableNativeFeedback onPress={() => setModalVisible(!modalVisible)}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              
              <View style={styles.centeredView}>
                
                <View style={styles.modalView}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => modalClose()}
                  >
                    <Entypo name="cross" size={24} color="white" />
                  </TouchableOpacity>
                  
                
                <Text style={[styles.Titles,{marginVertical:15,color:COLORS.white,...FONTS.body2, alignSelf:'center'}]}>Add {currentCartItem?.prodname} My to  Cart</Text>
                  
                  <View style={[styles.centered,{marginHorizontal:SIZES.padding2, marginVertical:SIZES.padding2}]} > 
                    <Image style={[{width:SIZES.width*0.24,height:SIZES.height*0.10,borderRadius:25,backgroundColor:Colors.grey700}]} source = {{uri: currentCartItem?.imageUrls[0].url}} />
                    <View style={{width:SIZES.width*0.3,left:-10}}>
                        <Text style={styles.textStyle}>Price: ksh {basketItem?.price}/ {basketItem?.unit} </Text>
                        <Text style={styles.textStyle}style={styles.textStyle}>Total Price: Ksh {basketItem?.total}</Text>
                        <Text style={styles.textStyle}>Items: {basketItem?.qty}</Text>
                    </View>
                    <Text style={[styles.SmallText,{margin:15,marginLeft:-8, color:COLORS.darkgrey4, width:SIZES.width*0.25 }]}>Total Price For All Items In Cart:  
                    <Text style={{...FONTS.body3,color:COLORS.white}}>ksh {PriceTotal}</Text> </Text>  
                  </View>
                  <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between',marginBottom:SIZES.padding,marginHorizontal:SIZES.padding2}}>
                  <View style={styles.OrderIncrementView}>
                            <TouchableOpacity
                                style={[styles.OrderIncrement,{borderTopLeftRadius:25,
                                  borderBottomLeftRadius:25}]}
                                onPress = {() =>  RemoveOrder(currentCartItem?.key,currentCartItem?.prodprice)}
                            >
                                <Text style={{...FONTS.body1}}>
                                <AntDesign name="minuscircleo" size={27} color={COLORS.white} />
                                </Text>
                            </TouchableOpacity>
                            <View 
                                style={styles.OrderIncrement} >
                                  {basketItem ? 
                                  <Text style={{...FONTS.h2,color:COLORS.white, fontWeight:'bold'}}> {basketItem?.qty}</Text>
                                  :
                                  <Text style={{...FONTS.h2,color:COLORS.white, fontWeight:'bold'}}> 0 </Text>
                                }
                               
                                   
                                
                            </View>
                            <TouchableOpacity  style={[styles.OrderIncrement,{borderTopRightRadius:25,
                                    borderBottomRightRadius:25}]}
                                onPress = {() =>  AddOrder(currentCartItem?.key,currentCartItem?.prodprice,currentCartItem?.prodname, currentCartItem?.imageUrls[0].url,currentCartItem?.productUnit,currentCartItem?.prodStoreid)}
                            >
                                <Text style={{...FONTS.body1}}>
                                <AntDesign name="pluscircleo" size={27} color={COLORS.white} />
                                </Text>
                           
                             </TouchableOpacity>
                        </View>
                 
                      {/**Quantity */}
                     

                  <TouchableOpacity
                    style={[styles.btn, styles.buttonReset]}
                    onPress={() => removeAll(currentCartItem?.key)}
                  >
                    <Text style={styles.textStyle}>Reset</Text>
                  </TouchableOpacity>
                  </View>
                 
                </View>
              </View>
            </Modal>
            </TouchableNativeFeedback>
          </View>
         
        )
    }
    function renderCats() {    
      const renderCategories = ({ item }) => (

          <View style={[styles.bodycontainer,{marginBottom:20}]}>
        <TouchableOpacity onPress = {() => navigation.navigate("ProductDetails", {
            item,
            storeItems
        })}
        >
            <Image style={[styles.bodyphoto,{marginTop:-45}]} source = {{uri: item?.imageUrls[0].url}} />
            <Text style={[{color: Colors.lightGreen300, alignSelf:'center',...FONTS.h3,fontWeight:'bold',top:5}]}>{item?.prodname}</Text>
           </TouchableOpacity>
           
            <Text style={[styles.bodycategory,
                {color:Colors.lightGreen900,padding:5,fontSize:17, fontWeight:'bold'}]}>
                    KSh {item?.prodprice}/ {item?.productUnit}
            </Text>
            <View style={styles.OrderIncrementView1}>
        
                <TouchableOpacity  style={[styles.OrderIncrement1,{borderRadius:15,borderTopLeftRadius:0,width:SIZES.width*0.2}]}
                    onPress = {() =>  AddtoCart(item)}
                >
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                      <AntDesign name="plus" size={16} color="black" />
                    <Text style={{...FONTS.body5}}> to Cart</Text>   
                    
                    </View>
                
                  </TouchableOpacity>
            </View>
          </View>
       
      )
      return(
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={storeItems}
          renderItem={renderCategories}
          keyExtractor={item => `${item.key}`}
          contentContainerStyle={{
            paddingBottom:220,
          }}
        />
      )}
    function renderCatsvertically() {
        const renderItem = ({item}) =>{
            return(
                <TouchableOpacity
                   onPress = {() => onselectCategory(item)}>
                    <View style={styles.bodycontainer}>
                        <Image
                           source = {{uri: item?.catimage}}
                           style={styles.bodyphoto}/>
                    
                    <Text style={[styles.bodytitle,{color: Colors.lightGreen700,...FONTS.h3}]}>
                        {item?.catname}
                    </Text>
                    <View style={[styles.bodytitle,{backgroundColor:Colors.lightGreen50,width:'100%',paddingHorizontal:4}]}>
                    {item?.catdetails.substring().length > 45 ?
                      <Text style={{color: Colors.green800,bottom:-5,...FONTS.h6,alignSelf:'center'}}>
                        {item?.catdetails.substring(0, 49)}....   
                      </Text>
                      :
                      <Text style={[{color: Colors.green800,bottom:-5,...FONTS.h6,alignSelf:'center'}]}>
                      {item?.catdetails}  
                    </Text>
                    }
                    </View>
                   
                    </View>
                </TouchableOpacity>         
            )}
        return (             
                <FlatList
                   data={storecategories}
                   vertical
                   showsVerticalScrollIndicator={false}
                   numColumns={2}
                   keyExtractor={item => `${item.key}`}
                   renderItem={renderItem}
                   contentContainerStyle={{
                    marginBottom:30,
                    paddingBottom:185,
                }}
                />
        )
    }

    function renderMainCategories() {
        const renderItem = ({item}) =>{
            return(
                <TouchableOpacity
                   style={[styles.category,
                   {backgroundColor:(selectedCategory?.catId !=item.catId ? 'rgb(245,240,255)':Colors.lightGreen300),...styles.shandow }]}
                   onPress = {() => onselectCategory(item)}>
                    <View style={styles.categoryView}>
                        <Image
                           source = {{uri: item?.catimage}}
                           resizeMode="cover"
                           style={styles.categoryIMG}/>
                    </View>
                    <Text style={[styles.categoryName,{color:(selectedCategory?.catId !=item.catId ?  COLORS.black: COLORS.white),}]}>
                        {item?.catname}
                    </Text>
                </TouchableOpacity>         
            )}
        return (
            <View style={styles.categoryMainView}>              
                <FlatList
                   data={storecategories}
                   horizontal
                   showsHorizontalScrollIndicator={false}
                   keyExtractor={item => `${item.catId}`}
                   renderItem={renderItem}
                   contentContainerStyle={{paddingVertical:SIZES.padding * 0.78}}
                />
            {selectedCategory !== null ?
                  <Searchbar
                  style={{height:SIZES.height*0.05,backgroundColor:Colors.grey200, borderRadius:10}}
                    placeholder="Search For Products"
                    onChangeText={query => searchProducts(query)}
            
                />
                :
                <View></View>
              }
            </View>
        )
    }
 
    return (
        <SafeAreaView style={styles.Container}>      
            {selectedCategory !== null ?
            <View>
                {renderHeader()}   
                {renderMainCategories()}             
                {renderCats()}                
                {renderModal()} 
                           
                </View>
                :
                <View>
                   {renderHeader()}
                   {renderMainCategories()}
                   {renderCatsvertically()}
                 
                </View>
            }         
       
            
        </SafeAreaView>
    )
}

export default Storeitems

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: Colors.grey800,
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
    OrderIncrement: {
        paddingHorizontal:SIZES.padding2*1,
        alignItems:'center',
        justifyContent:'center',
      },
      OrderIncrementView: {
        bottom:0,
        justifyContent:'center',
        flexDirection:'row'
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
    category: {
        padding:SIZES.padding*0.5,
        paddingBottom: SIZES.padding *0.4,
        height: 80,        
        borderRadius: 10,
        alignItems:"center",
        justifyContent:"center",
        marginRight: SIZES.padding,        
    },
    shandow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 5
        },
        shadowOpacity : 1,
        shadowRadius: 3,
        elevation: 1,
    },
    categoryView: {
        width: 60,
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.black
    },
    categoryIMG: {
        borderRadius:10,
        width:60,
        height:50
    },
    categoryName: {
        marginTop: SIZES.padding*0.1,
        
        ...FONTS.body3
    },
    categoryMainView: {
        padding:SIZES.padding,
        backgroundColor:COLORS.darkblue||' rgb(125, 120, 160)',
     
        borderTopLeftRadius:10,
        borderTopRightRadius:10, 
        top:-12
    },
    bodycontainer: RecipeCard.container,
    bodyphoto: RecipeCard.photo,
    bodytitle: RecipeCard.title,
    bodycategory: RecipeCard.category,
    catBody: {
        marginBottom:80,
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
    centeredView: {
        flex:1,
          alignItems: "center",
          justifyContent:'flex-end'
        },
        modalView: {
          width:SIZES.width,        
          backgroundColor:  COLORS.blackSecondary || 'rgb(20, 30, 38)',
          borderRadius: 10,
          borderBottomRightRadius:0,
          borderBottomLeftRadius:0,
          padding: 3,
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
          position:'absolute',
          top:-14,
          right:-1,
          borderBottomLeftRadius:20,
          borderRadius: 10,
          borderColor:COLORS.blackSecondary,
          borderWidth:1,
          padding: 10,
        },
        btn: {
          bottom:-2,
          right:0,
          paddingHorizontal:SIZES.padding2,
          borderRadius: 10,
          borderColor:COLORS.white,
          borderWidth:1,
          padding: 10,
        },
        buttonClose: {
          backgroundColor: COLORS.blackSecondary,
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
        centered:{
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'space-between'
        },     
         OrderIncrement1: {
           padding:SIZES.padding2,
          backgroundColor: COLORS.white,
          alignItems:'center',
          justifyContent:'center',
        },
        OrderIncrementView1: {
          position:'absolute',
          bottom:-12,
          width: SIZES.width,
          justifyContent:'center',
          flexDirection:'row'
        },

})
