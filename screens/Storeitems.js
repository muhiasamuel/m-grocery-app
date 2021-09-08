import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Animated, FlatList, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text,TouchableHighlight, TouchableOpacity, View, Pressable,Alert } from 'react-native'
import { RecipeCard } from '../constants/AppStyles'
import { getProductbyCategory, getproductsByIds, getProductsbyStore, getStoreCategories } from '../constants/DataApi'
import store from '../reducers/store';
import { COLORS, FONTS, images, SIZES } from '../constants/Index'
import { items, categoryData } from '../constants/mydata'
import Categories from './categories'
const Storeitems = ({route, navigation}) => {

    const scrollX = new Animated.Value(0);
    const [Restaurant,SetRestaurant] = React.useState(null)
    const [storecategories,SetStoreCategories] = React.useState([]);
    const [storeItems,SetstoreItems] = React.useState();
    const [basketState,setBasketState] = React.useState([]);
    const [selectedCategory, setSelectedCategory ] = React.useState(null)
    React.useEffect(() =>{
        let{item} = route.params;
        SetRestaurant(item)
        setBasketState(store.getState())
        const categoryId = getStoreCategories(item.id)
       const catsArray =  categoryId.map(a=>{
          return getCategoryById(a)[0]
        })
        SetStoreCategories(catsArray);
              
    },[])
    function getCategoryById(id) {
        let category = categoryData.filter(a =>a.id == id)
        if (category.length > 0) {
          return category;  
        }
        return ""
    }
    function onselectCategory(category) {
        //filter data
        let Storeitems = getProductsbyStore(Restaurant.id)
        const catsProdsids = getProductbyCategory(category.id)
        const catsProds = catsProdsids.map(data=>{
            return getproductsByIds(data)[0].id
        })
        const prodsIds= Storeitems.map(data =>{
            return getproductsByIds(data)[0]
        })
        let filtered = prodsIds.filter(data =>(
            catsProds.includes(data.id)
        ))
        SetstoreItems(filtered);
        console.log(storeItems);
        
        setSelectedCategory(category)
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
                      <Text style={styles.storeTitle}>{Restaurant?.name} stores</Text>
                  </View>
              </View>
              <TouchableOpacity
                style={styles.cartCount}
                onPress = {() => ShowOrderItems()}> 
                {basketState.BasketCount > 0 ? 
                     <Text style={styles.getBasketCount}>
                          {basketState.BasketCount}
                      </Text>:
                     <Text></Text>   
                }                 
                    <MaterialCommunityIcons name= 'cart-outline' size={27} color={COLORS.white}/>
              </TouchableOpacity>
            </View>
        )
    }
    function renderCats() {    
      const renderCategories = ({ item }) => (
        <TouchableOpacity onPress = {() => navigation.navigate("ProductDetails", {
            item,
            storeItems
        })}
        >
          <View style={styles.bodycontainer}>
            <Image style={styles.bodyphoto} source={item.photo[0]} />
            <Text style={[styles.bodytitle,{color: COLORS.darkgrey4}]}>{item.name}</Text>
           
            <Text style={[styles.bodycategory,
                {color:COLORS.white,padding:5, backgroundColor:COLORS.darkgrey}]}>
                    {item.price[0][0]}ksh / {item.price[0][1]}
            </Text>
          </View>
        </TouchableOpacity>
      )
      return(
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={storeItems}
          renderItem={renderCategories}
          keyExtractor={item => `${item.id}`}
          contentContainerStyle={{
            marginBottom:30,
            paddingBottom:185,
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
                           source = {item.icon}
                           style={styles.bodyphoto}/>
                    
                    <Text style={[styles.bodytitle,{color: COLORS.darkgrey4}]}>
                        {item.name}
                    </Text>
                    </View>
                </TouchableOpacity>         
            )}
        return (             
                <FlatList
                   data={storecategories}
                   vertical
                   showsVerticalScrollIndicator={false}
                   numColumns={2}
                   keyExtractor={item => `${item.id}`}
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
                   {backgroundColor:(selectedCategory?.id !=item.id ? 'rgb(245,240,255)': COLORS.primary),...styles.shandow }]}
                   onPress = {() => onselectCategory(item)}>
                    <View style={styles.categoryView}>
                        <Image
                           source = {item.icon}
                           resizeMode="cover"
                           style={styles.categoryIMG}/>
                    </View>
                    <Text style={[styles.categoryName,{color:(selectedCategory?.id !=item.id ?  COLORS.black: COLORS.white),}]}>
                        {item.name}
                    </Text>
                </TouchableOpacity>         
            )}
        return (
            <View style={styles.categoryMainView}>              
                <FlatList
                   data={storecategories}
                   horizontal
                   showsHorizontalScrollIndicator={false}
                   keyExtractor={item => `${item.id}`}
                   renderItem={renderItem}
                   contentContainerStyle={{paddingVertical:SIZES.padding * 0.5}}
                />
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
        backgroundColor: COLORS.backgroundColor,
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
    }

})
