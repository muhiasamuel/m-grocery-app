import * as Actions from "./actionTypes";

export function AddProduct(productId, price,name,image,unit,prodStoreid) {
    return{
        type:Actions.ADD_ITEM,
        payload:{
            productId,
            price,
            name,
            image,
            unit,
            prodStoreid
        }
    }
}

export function RemoveProduct(productId, price) {
    return{
        type: Actions.REMOVE_ITEM,
        payload:{
            productId,
            price
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

export function resetStore(){
    return{
        type:Actions.ResetStore,
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