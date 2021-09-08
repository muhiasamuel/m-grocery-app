import * as Actions from "./actionTypes";

export function AddProduct(productId, price,name,photo) {
    return{
        type:Actions.ADD_ITEM,
        payload:{
            productId,
            price,
            name,
            photo
        }
    }
}

export function RemoveProduct(productId, price,name,photo) {
    return{
        type: Actions.REMOVE_ITEM,
        payload:{
            productId,
            price,
            name,
            photo
        }
    }
}
export function RemoveAllItem(productId)
{
    return {
        type: Actions.REMOVE_ALL_ITEMS,
        payload: {
            productId
        }
    }
}
export function ProductQty(productId) {
    return{
        type: Actions.OrderQuantity,
        payload: {
            productId
        }
    }
}
export function BasketCount(){
    return{
        type:Actions.getBasketCount,
    }
}

export function TotalOrder(){
    return{
        type:Actions.sumOrder,
    }

}
export function filtredOrderPrds(productId){
    return{
        type: Actions.OrderData,
        payload: {
            productId
        }
    }
} 