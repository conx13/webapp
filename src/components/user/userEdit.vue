<template>
  <div>
    <q-form
      ref="vorm"
      autocomplete="off"
      @submit.prevent.stop="submitForm(kasutaja.id)"
    >
      <div class="row items-center">
        <div class="col-3 text-center">
          <q-avatar
            size="80px"
            font-size="42px"
            color="grey"
            text-color="white"
            v-if="kasutaja.pilt"
          >
            <img :src="userPilt">
          </q-avatar>
          <q-avatar
            size="80px"
            font-size="42px"
            color="grey"
            text-color="white"
            v-else
          >
            <span>{{ userIcon }}</span>
          </q-avatar>
        </div>
        <div class="col">
          <div class="row">
            <div class="col">
              <q-input
                ref="enimi"
                type="text"
                v-model="kasutaja.enimi"
                @input="txt => {kasutaja.enimi = capsChar(txt)}"
                lazy-rules
                :rules="[val => !!val || 'Eesnimi on oluline!']"
                label="Eesnimi*"
              />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input
                ref="pnimi"
                type="text"
                v-model="kasutaja.pnimi"
                @input="txt => {kasutaja.pnimi = capsChar(txt)}"
                lazy-rules
                :rules="[val => !!val || 'Perenimi on oluline!']"
                label="Perenimi*"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row q-pt-lg">
        <div class="col">
          <q-separator />
        </div>
      </div>
      <div class="row justify-end">
        <div class="col-10">
          <q-input
            v-model="kasutaja.mob"
            type="tel"
            lazy-rules
            :rules="[val => !!val || 'Mobiili nr on oluline!']"
            label="Mobiil*"
          />
        </div>
      </div>
      <div class="row justify-end">
        <div class="col-10">
          <q-input
            v-model="kasutaja.email"
            type="email"
            lazy-rules
            :rules="[val => !!val || 'Email on oluline!', isValidEmail]"
            label="Email* "
          />
        </div>
      </div>
      <div class="row justify-end">
        <div class="col-10">
          <q-select
            :disable="user.roll!='admin'"
            v-model="kasutaja.roll"
            :options="rollid"
            lazy-rules
            :rules="[val => !!val || 'Miski roll peab olema!']"
            label="Kasutaja roll"
          />
        </div>
      </div>
      <div class="row justify-end">
        <div class="col-10">
          <q-input
            label="Kehtiv kuni"
            v-model="kasutaja.todate"
            :disable="
              user.roll!='admin'"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qKehtivKuniProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="kasutaja.todate"
                    minimal
                    first-day-of-week="1"
                    mask="YYYY.MM.DD"
                    v-close-popup
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Sulge"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row justify-end">
        <div class="col-10">
          <div class="row q-gutter-x-sm">
            <div class="col">
              <q-input
                v-model="kasutaja.password"
                autocomplete="new-password"
                type="password"
                :rules="[vajalikPass]"
                label="Salasõna"
              />
            </div>
            <div class="col">
              <q-input
                autocomplete="new-password"
                v-model="pass.password_2"
                type="password"
                lazy-rules
                :rules="[val=>val===kasutaja.password || 'Salasõna ei klapi!']"
                label="Salasõna uuesti"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row q-mt-lg">
        <q-separator />
      </div>
      <div class="row q-mt-sm justify-between">
        <div class="col-3">
          <q-btn
            v-if="!formNew"
            flat
            color="negative"
            icon="person_remove"
            label="Kustuta"
          />
        </div>
        <div class="col-3">
          <q-btn
            type="submit"
            :disable="formError"
            flat
            color="positive"
            icon="how_to_reg"
            label="Salvesta"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  // name: 'ComponentName',
  props: {
    editAken: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      kasutaja: {},
      rollid: ['kasutaja', 'admin'],
      pass: {},
      formError: false,
      formNew: false,
    };
  },
  filters: {
  },
  computed: {
    ...mapState('auth', ['user']),
    userPilt() {
      if (this.kasutaja.pilt) {
        return `/pics/${this.kasutaja.pilt}`;
      }
      return null;
    },
    userIcon() {
      if (this.kasutaja.enimi && this.kasutaja.pnimi) {
        const taht1 = this.kasutaja.enimi.charAt(0).toUpperCase();
        const taht2 = this.kasutaja.pnimi.charAt(0).toUpperCase();
        return taht1 + taht2;
      }
      return '-';
    },
  },
  methods: {
    capsChar(str) {
      str = str.toString();
      return str.replace(/(^|\s)\S/g, t => t.toUpperCase());
    },
    // Kontrollime emaili
    isValidEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || 'Kontrolli emaili!';
    },
    vajalikPass(val) {
      console.log(!!val, 'on parool');
      if (this.formNew) {
        console.log('on vaja parooli');
        return !!val || 'On vaja ka parooli!';
      }
      return true;
    },
    // et võtame baasist kasutaja andmed
    getUser(id) {
      this.$axios.get(`api/users/${id}`)
        .then((resp) => {
          this.kasutaja = resp.data;
        })
        .catch(err => console.log(err));
    },
    // tegeleme uue kasutaja loomisega
    newUser() {
      console.log('vajutas new submit');
      // this.$axios.put('api/users/edit/',
      //   this.kasutaja)
      //   .then((resp) => {
      //     console.log(resp.data.status);
      //     this.$q.notify({
      //       message: resp.data.message,
      //       color: 'positive',
      //       icon: 'done',
      //       position: 'top',
      //     });
      //   })
      //   .catch(err => console.log(err));
    },
    // kontrollime kas form korralikult täidetud
    // kontForm() {
    //   this.$refs.vorm.validate()
    //     .then((valid) => {
    //       console.log(valid, 'form on ok');
    //       this.formError = false;
    //     });
    // },
    submitForm(id) {
      if (this.formNew) {
        this.newUser();
      } else {
        this.editUser(id);
      }
    },
    editUser(id) {
      console.log(id, 'vajutas edit submit');
      // this.$axios.put(`api/users/edit/${id}`,
      //   this.kasutaja)
      //   .then((resp) => {
      //     console.log(resp.data.status);
      //     this.$q.notify({
      //       message: resp.data.message,
      //       color: 'positive',
      //       icon: 'done',
      //       position: 'top',
      //     });
      //   })
      //   .catch(err => console.log(err));
    },
  },
  mounted() {
    // Kui laeme edit lehe siis võtame baasist andmeid
    // kui uus kasutaja siis tekitame tühja lehe
    if (this.$route.params.id !== 'new') {
      // this.kasutaja.id = this.$route.params.id;
      this.getUser(this.$route.params.id);
    } else {
      this.formNew = true;
    }
    this.$refs.vorm.focus();
  },
};
</script>
