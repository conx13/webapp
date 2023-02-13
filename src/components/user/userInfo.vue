<template>
  <div class="">
    <div class="row items-center">
      <div class="col-3 text-center">
        <q-btn
          round
          @click="pildiDialog = true"
        >
          <q-avatar
            size="80px"
            font-size="42px"
            color="grey"
            text-color="white"
            v-if="kasutaja.email"
          >
            <img
              v-if="kasutaja.pilt"
              :src="userPilt"
            >
            <span v-else>{{ userIcon }}</span>
          </q-avatar>
          <q-tooltip>
            Muuda pilti:
          </q-tooltip>
        </q-btn>
      </div>
      <div class=" text-h3 col text-weight-light">
        {{ kasutaja.enimi }} {{ kasutaja.pnimi }}
        <q-badge
          color="orange"
          align="top"
          v-if="kasutaja.roll=='admin'"
        >
          {{ kasutaja.roll }}
        </q-badge>
      </div>
    </div>
    <div class="row q-pt-lg items-center q-col-gutter-lg">
      <div class="col-3 text-blue-grey text-subtitle1 text-right">
        Mobiil
      </div>
      <div class="col text-h6 text-weight-light">
        <a :href="`tel:${kasutaja.mob}`">{{ kasutaja.mob }}</a>
      </div>
    </div>
    <div class="row q-pt-md items-center q-col-gutter-lg">
      <div class="col-3 text-blue-grey text-subtitle1 text-right">
        Email
      </div>
      <div class="col text-h6 text-weight-light ">
        <a :href="`mailto:${kasutaja.email}`">{{ kasutaja.email }}</a>
      </div>
    </div>
    <div class="row text-h6 text-weight-light q-pt-lg">
      <div class="col-3" />
      <div class="col">
        <q-separator />
      </div>
    </div>
    <div class="row q-pt-lg items-end q-col-gutter-lg">
      <div class="col-3 text-blue-grey text-subtitle1 text-right">
        Firma
      </div>
      <div class="col text-h6 text-weight-light">
        {{ kasutaja.firma }}
      </div>
    </div>
    <div
      class="row q-pt-lg items-end q-col-gutter-lg"
      v-if="kasutaja.desc"
    >
      <div class="col-3 text-blue-grey text-subtitle1 text-right">
        Märkus
      </div>
      <div class="col text-h6 text-weight-light">
        {{ kasutaja.desc }}
      </div>
    </div>
    <div
      class="row q-pt-lg items-end q-col-gutter-lg"
      v-if="kasutaja.todate"
    >
      <div class="col-3 text-blue-grey text-subtitle1 text-right">
        Kehtiv
      </div>
      <div class="col text-h6 text-weight-light">
        {{ userDate }}
      </div>
    </div>
    <q-dialog v-model="pildiDialog">
      <q-card class="my-card">
        <q-uploader
          :url="`api/users/editpic/${kasutaja.id}`"
          field-name="pilt"
          flat
          accept=".jpg, image/*"
          @failed="piltFailed"
          @uploaded="piltMuudetud"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  // name: 'PageName',
  data() {
    return {
      kasutaja: {},
      pildiDialog: false,
    };
  },
  computed: {
    userPilt() {
      if (this.kasutaja.pilt) {
        return `/pics/${this.kasutaja.pilt}`;
      }
      return null;
    },
    userIcon() {
      if (this.kasutaja.email) {
        const taht1 = this.kasutaja.enimi.charAt(0).toUpperCase();
        const taht2 = this.kasutaja.pnimi.charAt(0).toUpperCase();
        return taht1 + taht2;
      }
      return '-';
    },
    userDate() {
      if (this.kasutaja.todate) {
        return this.kasutaja.todate;
      }
      return 'aktiivne';
    },
  },
  methods: {
    // Võtame baasist andmeid
    getUser(id) {
      console.log('uurime kasutajat');
      this.$axios(`api/users/${id}`)
        .then((resp) => {
          this.kasutaja = resp.data;
        })
        .catch(err => console.log(err));
    },
    piltFailed(err) {
      console.log(err, 'ERROR');
    },
    piltMuudetud() {
      this.getUser(this.$route.params.id);
      this.pildiDialog = false;
    },
  },
  mounted() {
    // Kui laeme lehe siis võtame baasist andmeid
    console.log('USER INFO');
    if (this.$route.params.id !== 'new') {
      this.getUser(this.$route.params.id);
    }
  },
};
</script>
<style lang="stylus">
a {
  color: inherit;
  text-decoration: inherit;
}

a:hover {
  color: blue;
}
</style>
