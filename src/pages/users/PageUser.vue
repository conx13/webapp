<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-center">
      <div class="col-5">
        <div class="row items-center">
          <div class="col-3 text-left">
            <q-btn
              flat
              color="primary"
              label="Tagasi"
              icon="navigate_before"
              v-if="edit"
              @click="tyhista()"
            />
            <q-btn
              flat
              color="primary"
              label="Muuda"
              icon="edit"
              v-else
              @click="edit=!edit"
            />
          </div>
        </div>
        <div class="q-mt-lg">
          <userEdit v-if="edit" />
          <userInfo
            v-else
            :key="userReload"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import userInfo from '../../components/user/userInfo';
import userEdit from '../../components/user/userEdit';

export default {
  // name: 'PageName',
  components: {
    userInfo,
    userEdit,
  },
  data() {
    return {
      edit: true,
      newUser: false,
      userReload: 0,
    };
  },
  watch: {
    // vaatame kas ruuteri parameeter muutub
    $route() {
      // tühistame edit akna - võiks hoiatada
      if (this.edit) {
        this.edit = false;
      } else {
        this.userReload = +1; // reload userInfo
      }
    },
  },
  methods: {
    tyhista() {
      if (this.newUser) {
        this.$router.push('/users');
      }
      this.edit = !this.edit;
    },
  },
  mounted() {
    // Kui laeme lehe siis võtame baasist andmeid
    if (this.$route.params.id !== 'new') {
      this.edit = false;
    } else {
      this.newUser = true;
    }
  },
};
</script>
