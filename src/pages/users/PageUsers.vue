<template>
  <q-page padding>
    <!-- <div class="row items-end">
      <div class="col-md-12 col-xs-12 text-h4 text-center">
        Kasutajad
      </div>
    </div> -->
    <div class="row">
      <div class="col-md-2 offset-md-1 col-xs-6 col-sm-3text-center">
        <q-btn
          outline
          rounded
          size=""
          color="primary"
          label="Lisa kasutaja"
          icon="add"
          class=""
          @click="$router.push('/user/new')"
        />
      </div>
      <div class="col-md-2 offset-md-7 col-xs-6 col-sm-4 offset-sm-2 text-right">
        <q-input
          v-model="otsi"
          debounce="600"
          outlined
          rounded
          color="positive"
          class="text-positive"
          dense
          :label="otsiPrefix"
          clearable
          autofocus
          v-select-all
          @input="filterTulem"
        >
          <template v-slot:prepend />
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="row q-pa-md">
      <div class="col-md-4 offset-md-4 col-sm-7 col-xs-12">
        <div
          v-for="firma in firmad"
          :key="firma.index"
        >
          <div>
            <q-toolbar class="q-mt-md bg-blue-grey-12 text-white">
              <q-toolbar-title>{{ firma }}</q-toolbar-title>
            </q-toolbar>
            <q-list
              bordered
              separator
            >
              <usercard
                v-for="user in filterFirmaList(firma)"
                :key="user.id"
                :user="user"
                :esile="otsi"
              />
            </q-list>
          </div>
        </div>
      </div>
      <div class="col-md-2 offset-md-2 col-sm-4 offset-sm-1 gt-xs">
        <firmaList
          :firmad="firmadBaasist"
          @otsi-firmat="otsiFirmat"
          class="q-ma-sm"
        />
      </div>
    </div>
    <!-- content -->
    <q-page-sticky
      expand
      position="top"
    >
      <!-- <q-toolbar class="bg-accent text-white">
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
        </q-avatar>
        <q-toolbar-title>
          Page Title
        </q-toolbar-title>
      </q-toolbar> -->
    </q-page-sticky>
  </q-page>
</template>

<script>
import { selectAll } from 'src/directives/directive-select-all';
import userCard from '../../components/users/userCard';
import firmaList from '../../components/users/firmaList';

export default {
  name: 'PageUsers',
  directives: {
    selectAll,
  },
  components: {
    usercard: userCard,
    firmaList,
  },

  data() {
    return {
      otsi: '',
      kasutajadData: [],
      kasutajadD: [],
      lubatudTulbad: ['email', 'mob', 'firma', 'enimi', 'pnimi'],
      otsiPrefix: 'Filter:',
    };
  },
  computed: {
    // teeme firmade nimekirja koos
    firmad() {
      // new Set tekitab distinct loendi ja Array.from teeb sellest array
      return Array.from(new Set(this.kasutajadD.map(({ firma }) => firma)));
    },
    firmadBaasist() {
      // seda leiutasin kaks päeva :-)
      const tulem = Array.from(new Set(this.kasutajadData
        .map(({ firma }) => firma))) // tekitame distinct loendi firmadest
        // ja vastavalt loendile loeme kokku fitriga mitu kontakti on firmast
        .map(e => ({
          nimi: e,
          kokku: this.kasutajadData
            .filter(n => n.firma === e).length,
        }));
      return tulem;
    },
  },
  methods: {
    // näitame kaardil ainult vastava firma kontakte
    filterFirmaList(firma) {
      // return this.kasutajadData.filter(tulem => tulem.firma.includes(firma));
      return this.kasutajadD.filter(tulem => tulem.firma === firma);
    },
    getUsers() {
      this.$axios('api/users')
        .then((resp) => {
          this.kasutajadData = resp.data; // andmed baasist
          this.kasutajadD = resp.data; // näitamiseks andmed
        })
        .catch(err => console.log(err));
    },

    // filtreerime andmeid vastavalt tulpadele - leiutasin nädal
    filterTulem(text) {
      this.otsiPrefix = 'Filter:';
      if (!text) {
        this.kasutajadD = this.kasutajadData;
      } else {
        this.kasutajadD = this.kasutajadData
          .filter(e => Object.keys(e)
            .find((s) => {
              // kui tulp on kirjeldatud tulpade nimekirjas
              if (this.lubatudTulbad.includes(s)) {
                // if (this.lubatudTulbad.indexOf(s) > -1) {
                if (e[s]) {
                  return e[s].toString().toLowerCase().includes(text.toLowerCase());
                  // return e[s].toString().toLowerCase().indexOf(text.toLowerCase()) > -1;
                }
                // return this.toLowerCase(e[s]).indexOf(text.toLowerCase()) > -1;
              }
              return false;
            }));
      }
    },
    otsiFirmat(firma) {
      this.otsi = firma;
      this.filterTulem(firma);
      this.otsiPrefix = 'Firma:';
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>

<style>
.q-if::before {
  background-color: black !important;
}
</style>
