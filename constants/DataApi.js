import React from 'react'
import { View, Text } from 'react-native'
import { categoryData, restaurantData, products } from './mydata';

//getting a category based on the id
export function  getCategoryById(categoryId){
    let category;
    categoryData.map(data => {
        if(data.id == categoryId){
            category = data;
        }
    });
    return category;
}
 //getting a Store

export function getStorebyId(storeId){
    let store;
    restaurantData.map(data =>{
        if(data.id == storeId){
            store = data;
        }
    });
    return store;    
} 
 //getting a product

export function getProductbyId(productId){
    let product;
    products.map(data =>{
        if (data.productid == productId) {
            product = data; 
        }
    });
    return product;
} 

//getting products in a category
 
export function getProductbyCategory(categoryId){
    const productsArray = []
    products.map(data =>{
        if (data.categoryId == categoryId) {
            productsArray.push(data.id);           
        }     
        
    });
    return productsArray;
}


//getting products in a store

export function getProductsbyStore(storeId) {
    let products;
    restaurantData.map(data => {
      if (data.id == storeId) {
        products= data.storeProducts
      }
    });
    return products;
  }
    //filtering prods
    export function getproductsByIds(id) {
        let prods = products.filter(a =>a.id == id)
        if (prods.length > 0) {
            return prods;  
        }
        return ""
    }
  //getting categories in a Store
  export function getStoreCategories(storeId) {
     let myStore;  
      restaurantData.map(data => {
          if (data.id == storeId) {  
            myStore = data.categories;         
          }          
      })
      
      return myStore;
   }
   //filtering categoryIds
   export function getCategoryByIds(id) {
    let category = categoryData.filter(a =>a.id == id)
    if (category.length > 0) {
      return category[0].name  
    }
    return ""
}