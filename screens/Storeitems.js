import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Animated, FlatList, Image, SafeAreaView,  StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RecipeCard } from '../constants/AppStyles'
import store from '../reducers/store';
import { COLORS, FONTS,  SIZES } from '../constants/Index'
import Firebase from '../firebaseConfig';
import "firebase/storage";
import 'firebase/firestore';
import { AuthenticatedUserContext } from '../AuthProvider/AuthProvider';
const Storeitems = ({route, navigation}) => {
    const {Products, setProducts,catData, setCatData, storeData, setStoreData} = React.useContext(AuthenticatedUserContext);

    const scrollX = new Animated.Value(0);
    const [Store,SetStore] = React.useState(null)
    const [StoreProducts,SetStoreProducts] = React.useState(null)
    const [storecategories,SetStoreCategories] = React.useState([]);
    const [storeItems,SetstoreItems] = React.useState();
    const [basketState,setBasketState] = React.useState([]);
    const [selectedCategory, setSelectedCategory ] = React.useState(null)
    React.useEffect(() =>{
        let {item} = route.params;
        SetStore(item); 
            
        getProductsData();
        getStoreData(); 
        getCatData();
        getProductByStoreData(item.key);
               
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
   const  getStoreData = async () => {
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
      function getProductByStoreData(id){
          let storeProducts = Products.filter(a => a.prodStoreid == id)
          if (storeProducts.length > 0) {
            SetStoreProducts(storeProducts);
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
            <Image style={styles.bodyphoto} source = {{uri: item?.imageUrls[0].url}} />
            <Text style={[styles.bodytitle,{color: COLORS.darkgrey4}]}>{item?.prodname}</Text>
           
            <Text style={[styles.bodycategory,
                {color:COLORS.darkblue,padding:5,fontSize:17, fontWeight:'bold'}]}>
                    KSh {item?.prodprice}/ {item?.productUnit}
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
          keyExtractor={item => `${item.key}`}
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
                           source = {{uri: item?.catimage}}
                           style={styles.bodyphoto}/>
                    
                    <Text style={[styles.bodytitle,{color: COLORS.darkgrey4}]}>
                        {item?.catname}
                    </Text>
                    <Text style={[styles.bodytitle,{color: COLORS.darkgrey4,bottom:5}]}>
                        {item?.catdetails}
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
                   {backgroundColor:(selectedCategory?.catId !=item.catId ? 'rgb(245,240,255)': COLORS.primary),...styles.shandow }]}
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
        backgroundColor: COLORS.darkgrey4,
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
