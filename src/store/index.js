import Vue from 'vue';
import Vuex from 'vuex';

// import example from './module-example'
import auth from './auth/auth';

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

const Store = new Vuex.Store({
  modules: {
    auth,
    // example
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV,
});
export default function (/* { ssrContext } */) {
  return Store;
}
export {
  Store,
};
