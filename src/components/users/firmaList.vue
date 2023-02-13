<template>
  <div>
    <div class="row q-mb-xs allJoon">
      <div class="text-h6">
        Firmad:
      </div>
    </div>
    <q-chip
      v-for="firma in firmad"
      :key="firma.index"
      outline
      clickable
      class="shadow-1 cursor-pointer"
      @click="$emit('otsi-firmat', firma.nimi)"
    >
      {{ firma.nimi }}<q-badge
        color="grey-2"
        text-color="negative"
        floating
        transparent
      >
        {{ firma.kokku }}
      </q-badge>
    </q-chip>
  </div>
</template>

<script>
export default {
  name: 'FirmaList',
  // eslint-disable-next-line vue/require-default-prop
  props: { firmad: Array },
  data() {
    return {};
  },
};
</script>
<style>
.allJoon {
  border-bottom: 1px solid grey;
}
</style>
