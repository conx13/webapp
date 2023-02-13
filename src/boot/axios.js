import axios from 'axios';
import { Notify } from 'quasar';
import { Store } from '../store/index.js';
import router from '../router/index';

export default async ({ Vue }) => {
  Vue.prototype.$axios = axios;
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  // Näitame kõik päringud
  Vue.prototype.$axios.interceptors.request.use(
    (config) => {
      // Näitame päringut
      console.log(
        `%c[REQUEST] sent -> ${config.url}`,
        'color: blue; font-weight: bold;',
        config,
      );
      return config;
    },
    (error) => {
      // Kui päringus on error
      console.log(
        `%c[REQUEST] error -> ${error.config.url}`,
        'color: red; font-weight: bold;',
        error.message || error,
      );
      return Promise.reject(error);
    },
  );

  // Näitame kõik vastused
  Vue.prototype.$axios.interceptors.response.use(
    (response) => {
      console.log(
        `%c[RESPONSE] received -> ${response.config.url}`,
        'color: green; font-weight: bold;',
        response.data,
      );
      return response;
    },
    (error) => {
      // kirjutame üles kuskohast on päring pärit
      const tee = router.history.current.fullPath;
      // console.log('Axios error ja tee', tee);
      // kontrollime kas api ise teeb error handlet
      // vajadusel kirjuta configi { errorHandle: true }
      const onErrorconf = Object.prototype.hasOwnProperty.call(error.config, 'errorHandle');
      // kui api tegeleb ise error handlega
      if (onErrorconf && error.config.errorHandle === true) {
        console.log(
          `%c[errorHandle määratud 'true'] -> ${error.config.url}`,
          'color: red; font-weight: bold;',
          error,
        );
        return Promise.reject(error);
      }
      // Näitame error consooli
      console.log(
        `%c[RESPONSE] error -> ${error.config.url}`,
        'color: red; font-weight: bold;',
        error.response.data.message || error.response,
      );
      // Näitame error teadet
      Notify.create({
        timeout: 3500,
        color: 'negative',
        message: error.response.data.message || error.response.data,
        actions: [{ icon: 'close', color: 'white' }],
      });
      // Kui on vale parool või ei ole lubatud jne
      if (error.response.status === 402 || error.response.status === 401) {
        // kui tuleme login aknast siis suunamist logini pole vaja
        if (tee !== '/login' && tee !== '/') {
          router.replace({
            path: '/login',
            query: { redirect: tee },
          });
          Store.dispatch('auth/authError');
          //   .then(() => {
          //   })
          //   .catch(err => console.log(err));
        }
        error.message = error.response.data;
        return Promise.reject(error.message);
      }
      return Promise.reject(error);
    },
  );
};
