
import * as Action from './actionTypes';

initialState = {
    orderItems:[],
    total : 0,
    BasketCount:0,
    itemCount:0,
    filteredOrder:[] 
}
function productReducers( state=initialState, action){
    switch (action.type) {
        case Action.ADD_ITEM:        
                let orderList = state.orderItems.slice()
                let item = orderList.filter(data => data.productId == action.payload.productId)
                  if (item.length > 0) {
                      let newQty = item[0].qty + 1
                      item[0].qty = newQty
                      item[0].total = item[0].qty * action.payload.price
                  } else {
                      const newItem = {
                          productId: action.payload.productId,
                          qty: 1,
                          name: action.payload.name,
                          image:action.payload.image,
                          unit:action.payload.unit,
                          price: action.payload.price,
                          total: action.payload.price,
                          storeId:action.payload.prodStoreid,
                      }
                      orderList.push(newItem)
                  } 
                  return {
                      ...state,
                      orderItems:orderList
                 }
           
        case Action.REMOVE_ITEM:
            let myOrders = state.orderItems.slice();
            let myitem = myOrders.filter(data => data.productId == action.payload.productId);
            if (myitem.length > 0) {
                if (myitem[0]?.qty > 0) {
                    let newQty = myitem[0].qty - 1
                    myitem[0].qty = newQty
                    myitem[0].total = newQty * action.payload.price 
                } 
             }  
            return{
                ...state,
                orderItems:myOrders
            }
        
        case Action.getBasketCount:
            let itemcount = state.orderItems.reduce((a, b) =>a + (b.qty || 0),0)
            return{
                ...state,
                BasketCount:itemcount
             }
        case Action.sumOrder:
            let total = state.orderItems.reduce((a,b) => a + (b.total || 0), 0)
           
                return{ 
                    ...state,
                    total:total
                 }
           
        case Action.OrderQuantity:
            let orderItem = state.orderItems.filter(a => a.productId == action.payload.productId)
            if (orderItem.length>0) {
                return{
                    ...state,
                    itemCount:orderItem[0].qty
               }
            }else{
                return{
                    ...state,
                    itemCount:state.itemCount
                }
            }
        case Action.REMOVE_ALL_ITEMS:
            let result = state.orderItems.filter(product => product.productId !== action.payload.productId)
            return {
                ...state,
                orderItems:result
            } 
        case Action.OrderData:
           let FilteredOrder = state.orderItems.filter(data => data.productId == action.payload.productId)
            if (FilteredOrder.length>0) {
                return{
                    ...state,
                    filteredOrder:FilteredOrder[0]
            }
            }else{
                return{
                    ...state,
                    filteredOrder:{total:0}
                }
            }  

            default:
            return state;
                           
}
}
export default productReducers;
