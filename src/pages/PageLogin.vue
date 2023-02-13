<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-center">
      <div class="col-3">
        <q-card class="">
          <q-banner class="bg-blue-grey text-white">
            <span class="text-h6">Logi palun sisse:</span>
          </q-banner>
          <q-card-section>
            <q-form
              @submit.prevent="onSubmitForm"
              class="q-gutter-md"
            >
              <div class="row">
                <div class="col full-width">
                  <q-input
                    ref="email"
                    autofocus
                    outlined
                    dense
                    clearable
                    clear-icon="close"
                    type="email"
                    label="Email"
                    :rules="[
                      val => (val !== null && val !== '') || 'Palun email!',
                      val => isValidEmail(val) || 'Email on vale!'
                    ]"
                    lazy-rules
                    v-select-all
                    v-model="loginData.email"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col full-width">
                  <q-input
                    ref="password"
                    outlined
                    dense
                    clearable
                    clear-icon="close"
                    label="Parool"
                    :rules="[
                      val => (val !== null && val !== '') || 'Palun parool!'
                    ]"
                    v-model="loginData.password"
                    :type="isPwd ? 'password' : 'text'"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row justify-center">
                <div class="col-6">
                  <q-btn
                    class="full-width"
                    type="submit"
                    outline
                    color="primary"
                    label="Login"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { selectAll } from 'src/directives/directive-select-all';
import { mapActions } from 'vuex';

export default {
  name: 'PageLogin',
  directives: {
    selectAll,
  },
  data() {
    return {
      isPwd: true,
      loginData: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    ...mapActions('auth', ['loginUser']),
    // Kontrollime kas email on õieti kirjutat
    isValidEmail(email) {
      // eslint-disable-next-line no-useless-escape
      const re = /\S+@\S+\.\S+/;
      return re.test(String(email).toLowerCase());
    },
    // Kinnitame formi
    onSubmitForm() {
      this.$refs.email.validate();
      this.$refs.password.validate();
      this.loginUser(this.loginData)
        .then(() => {
          this.$router.replace(this.$route.query.redirect || '/');
        })
        .catch(err => console.log('Submit Err:', err.message));
    },
  },
};
</script>

<style></style>
