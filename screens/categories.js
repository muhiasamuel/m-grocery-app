import React from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, images, SIZES } from '../constants/Index'
import {restaurantData,
    categoryData,
    initialCurrentLocation}
     from '../constants/mydata'

const categories = () => {
    const [categories, setCategories] = React.useState(categoryData)
    const [selectedCategory, setSelectedCategory ] = React.useState(null)
    const [ restaurant, setRestaurant] = React.useState(restaurantData)


    function renderMainCategories() {
        const renderItem = ({item}) =>{
            return(
                         <TouchableOpacity
                   style={{
                       padding:SIZES.padding*0.5,
                       paddingBottom: SIZES.padding *0.4,
                       height: 80,
                       backgroundColor:(selectedCategory?.id !=item.id ? 'rgb(250,250,250)': 'rgb(122, 22, 65);'),
                       borderRadius: 10,
                       alignItems:"center",
                       justifyContent:"center",
                       marginRight: SIZES.padding,
                       ...styles.shandow 
                   }}
                   onPress = {() => onselectCategory(item)}
                >
                    <View style={{
                      width: 60,
                      height: 50,
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: COLORS.black  
                    }}>
                        <Image
                           source = {item.icon}
                           resizeMode="cover"
                           style={{
                               borderRadius:10,
                               width:60,
                               height:50
                           }}
                        />

                    </View>
                    <Text
                    style={{
                        marginTop: SIZES.padding*0.1,
                        color:(selectedCategory?.id !=item.id ?  COLORS.black: COLORS.white),
                        ...FONTS.body3
                    }}>{item.name}</Text>

                </TouchableOpacity>
           
            )
        }
        return (
            <View style={{padding:SIZES.padding*0.9,backgroundColor:' rgb(250, 250, 250)',height: '17%', borderTopLeftRadius:10,borderTopRightRadius:10, top:-7 }}>              
                <FlatList
                   data={categories}
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
        renderMainCategories()
    )
}

export default categories

const styles = StyleSheet.create({
 
    shandow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 5
        },
        shadowOpacity : 1,
        shadowRadius: 3,
        elevation: 1,
    }
})
