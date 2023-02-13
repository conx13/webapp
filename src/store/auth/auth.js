// eslint-disable-next-line no-unused-vars
import axios from 'axios';
// import router from '@/router/index';
// import { Notify } from 'quasar';

const mutations = {
  setLoggingIn(state, resp) {
    state.loggedIn = resp.status;
    state.user = resp.user;
  },
  setUser(state, value) {
    state.user = value;
    // Object.assign(state.user, value);
  },
  logError(state) {
    state.loggedIn = false;
    state.user = '';
  },
};

const state = {
  loggedIn: false,
  user: {},
};

const actions = {
  loginUser({ commit }, user) {
    return new Promise((resolve, reject) => {
      axios.post('api/auth/login', user, { errorHandle: false })
        .then((resp) => {
          if (resp.data.status) {
            commit('setLoggingIn', resp.data);
            // commit('setUser', resp.data.user);
            resolve(resp.data);
          } else {
            commit('setLoggingIn', resp.data);
            // commit('setUser', '');
            reject(resp.data.message);
          }
        })
        .catch((err) => {
          commit('logError');
          reject(err);
        });
    });
  },

  authStatus({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('api/auth/authstatus')
        .then((resp) => {
          if (resp.data.status) {
            commit('setLoggingIn', resp.data);
            // commit('setUser', resp.data.user);
            resolve(resp.data);
          } else {
            commit('setLoggingIn', false);
            // commit('setUser', '');
            reject(resp.data.message);
          }
        })
        .catch((err) => {
          // commit('logError');
          // this.$router.replace({
          //   path: '/login',
          //   query: { redirect: path.fullPath },
          // });
          reject(err);
        });
    });
  },
  authError({ commit }) {
    commit('logError');
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('api/auth/logout')
        .then(() => {
          commit('logError');
          resolve();
        })
        .catch((err) => {
          console.log('Logout error');
          commit('logError');
          reject(err);
        });
    });
  },
};
const getters = {
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
