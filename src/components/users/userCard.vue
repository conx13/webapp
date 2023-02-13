<template>
  <div>
    <q-item
      clickable
      v-ripple
      :to="userLink"
    >
      <q-item-section avatar>
        <!-- Kui on pilt siis näitame -->
        <!-- Kui pilti pole siis ikoon -->
        <q-avatar
          color="grey"
          text-color="white"
        >
          <img
            v-if="user.pilt"
            :src="userPilt"
          >
          <span v-else>{{ userIcon }}</span>
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label
          lines="1"
          class="text-capitalize text-blue-grey text-h6"
        >
          <span v-html="$options.filters.highlight(user.enimi, esile) +' '" />
          <span v-html="$options.filters.highlight(user.pnimi, esile)" />
        </q-item-label>
        <q-item-label
          caption
          lines="2"
        >
          <q-chip
            dense
            size="sm"
            outline
            :color="userColor"
          >
            {{ user.roll }}
          </q-chip>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label
          lines="1"
          caption
          v-if="user.mob"
        >
          <a :href="`tel:${user.mob}`">
            <span v-html="$options.filters.highlight(user.mob, esile)" />
          </a>
          <q-icon
            name="phone"
            color="grey"
            size=""
            class="q-ml-sm"
          />
        </q-item-label>
        <q-item-label
          caption
          lines="2"
          v-if="user.email"
        >
          <span v-html="$options.filters.highlight(user.email, esile)" />
          <q-icon
            name="email"
            color="grey"
            size=""
            class="q-ml-sm"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>

// import { date } from 'quasar';

export default {
  name: 'UserCard',
  // eslint-disable-next-line vue/require-default-prop
  props: { user: Object, esile: String },
  filters: {
    highlight(value, query) {
      const check = new RegExp(query, 'ig'); // kontrollime kas on text
      if (!value) return '';
      return value.toString().replace(check, matchedText => (`<span class='bg-yellow-4'>${matchedText}</span>`));
    },
  },
  data() {
    return {
      formKasutaja: '',
    };
  },
  computed: {
    userLink() {
      return `/user/${this.user.id}`;
    },
    userPilt() {
      if (this.user.pilt) {
        return `/pics/${this.user.pilt}`;
      }
      return null;
    },
    userIcon() {
      return this.user.email.charAt(0).toUpperCase();
    },
    userColor() {
      if (this.user.todate) {
        const kpv = new Date(this.user.todate);
        const tana = Date.now();
        if (kpv < tana) {
          console.log(this.user.todate, 'ei kehti');
          return 'grey';
        }
      }
      if (this.user.roll === 'kasutaja') {
        return 'info';
      }
      if (this.user.roll === 'admin') {
        return 'accent';
      }
      console.log(this.user.todate);
      return 'grey';
    },
  },
  methods: {
  },
};
</script>
<style>
</style>
