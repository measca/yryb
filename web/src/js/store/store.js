import Vuex from 'vuex'
import cart from './modules/cart'
import products from './modules/products'

export default new Vuex.Store({
  modules: {
    cart,
    products
  }
})