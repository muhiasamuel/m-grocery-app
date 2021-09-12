import React from 'react';
import Firebase from '../firebaseConfig';
import "firebase/storage";
import 'firebase/firestore';



function StoreData () {
    const [storeData, setStoreData] = React.useState([]);
    const fetchstores = async ()=>{
        const response = Firebase.firestore().collection('Stores');
        const data = await response.get();
        data.docs.forEach(item => {
            setStoreData([...storeData, item.data()])

        })
    }
    React.useEffect(() =>{
        fetchstores();
    },[])
    return storeData

    
}

function CategoryData () {
    const [catData, setCatData] = React.useState([]);
    const fetchcategories = async ()=>{
        const response = Firebase.firestore().collection('ProductCategories');
        const data = await response.get();
        data.docs.forEach(item => {
            setCatData([...catData, item.data()])

        })
    }
    React.useEffect(() =>{
         fetchcategories();
    },[])
    return catData
}

export {
    StoreData,
    CategoryData,
}
