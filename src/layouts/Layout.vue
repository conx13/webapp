<template>
  <q-layout view="hHh Lpr lff">
    <q-header class="bg-blue-grey-5">
      <q-toolbar>
        <q-toolbar-title shrink>
          webProjekt
        </q-toolbar-title>
        <q-btn-dropdown
          v-if="page!=='login'"
          :label="page"
          :icon="pageIcon"
          no-caps
          flat
          stretch
          size="md"
          class=""
        >
          <q-list>
            <q-item
              v-if="page!=='Projektid'"
              clickable
              v-close-popup
              to="/"
            >
              <q-item-section avatar>
                <q-avatar
                  icon="business_center"
                  color="primary"
                  text-color="white"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>Projektid</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
            >
              <q-item-section avatar>
                <q-avatar
                  icon="assignment"
                  color="secondary"
                  text-color="white"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>Tööd</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="page!=='Kasutajad' && user.roll=='admin'"
              clickable
              v-close-popup
              to="/users"
            >
              <q-item-section avatar>
                <q-avatar
                  icon="groups  "
                  color="primary"
                  text-color="white"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>Kasutajad</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          v-if="loggedIn"
          outline
          rounded
          align="left"
          class="absolute-right"
          no-caps
          padding="none"
          style="margin-top: 2px; margin-bottom: 2px"
        >
          <div class="row items-center">
            <q-avatar
              color="grey"
              class="q-ma-xs"
            >
              <img
                v-if="user.pilt"
                :src="userPilt"
              >
              <span v-else>{{ userIcon }}</span>
            </q-avatar>
            <div class="q-mx-sm desktop-only">
              {{ user.email }}
            </div>
          </div>
          <q-menu content-class="bg-blue-grey-5 text-white">
            <q-list style="min-width: 100px">
              <q-item
                v-close-popup
                clickable
                :to="userLink"
              >
                <q-item-section>
                  <q-item-label caption>
                    {{ user.email }}
                  </q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item
                clickable
                v-close-popup
                @click="logiValja()"
              >
                <q-item-section>Logi välja</q-item-section>
                <q-item-section avatar>
                  <q-icon name="exit_to_app" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-footer
      elevated
      class="bg-blue-grey-5"
    >
      <q-toolbar>
        <small class="right">
          Quasar v{{ $q.version }}
        </small>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: false,
      page: 'Projektid',
      pageIcon: 'business_center',
    };
  },
  computed: {
    ...mapState('auth', ['loggedIn', 'user']),
    userLink() {
      return `/user/${this.user.id}`;
    },
    userPilt() {
      if (this.user.pilt && this.user) {
        return `/pics/${this.user.pilt}`;
      }
      return null;
    },
    userIcon() {
      return this.user.email.charAt(0);
    },
  },
  methods: {
    openURL,
    ...mapActions('auth', ['logout']),

    // Logime kasutaja välja
    logiValja() {
      this.logout()
        .then(() => this.$router.push('/login'))
        .catch(err => console.log(err));
    },

    // Lehe pealkirja menüü valimine
    pageName() {
      const leht = this.$route.path;
      if (leht.includes('login')) {
        this.page = 'login';
        this.pageIcon = 'verified';
        return;
      }
      if (leht.includes('users')) {
        this.page = 'Kasutajad';
        this.pageIcon = 'groups';
        return;
      }
      if (leht.includes('user/')) {
        this.page = 'Kasutaja:';
        this.pageIcon = 'person';
        return;
      }
      this.page = 'Projektid';
      this.pageIcon = 'business_center';
    },
  },
  watch: {
    // Kui url muutub, siis mudame pealkirja jne
    $route() {
      this.pageName();
      // react to route changes...
    },
  },
  mounted() {
    // Paneme õige lehe pealkirja
    this.pageName();
  },
};
</script>

<style>
</style>
