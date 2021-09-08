import React, { Component } from 'react'
import firebase from 'firebase/app'
import "firebase/storage";
import 'firebase/firestore';
const DataContext = React.createContext();
class DataProvider extends Component {
    state = {
        Store:[],
        Category: [],
        Products:'',
    } 
    componentDidMount(){
       this.getStoreData(); 
       this.getCategoryData(); 
    }
    async getStoreData(){        
            const response=  firebase.firestore()
            .collection('Stores');
            const data=await response.get();
            data.docs.forEach(item=>{
                this.setState({
                    Store:[...this.state.Store,item.data()],
                })
               })    
    }
    
    async getCategoryData(){
        const response=  firebase.firestore()
        .collection('ProductCategories');
        const data=await response.get();
        data.docs.forEach(item=>{
            this.setState({
                Category:[...this.state.Category,item.data()],
            })
           })
    }
 
    render() {
        return (
           <DataContext.Provider value={{...this.state}}>
               {this.props.children}
           </DataContext.Provider>
        )
    }
}
export {DataProvider, DataContext }
