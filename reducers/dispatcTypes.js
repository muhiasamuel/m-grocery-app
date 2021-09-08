import { AddProduct, BasketCount, ProductQty, RemoveAllItem, RemoveProduct, TotalOrder } from './reducers/Actions';

  store.dispatch(AddProduct(1, 500))
  store.dispatch(RemoveProduct(3, 500))
  store.dispatch(BasketCount())
  store.dispatch(TotalOrder())
  store.dispatch(RemoveAllItem(3))
  store.dispatch(ProductQty(1))
  console.log(store.getState());