<template>
  <div id="tab-bar" class="row tab-row">
    <div class="col s12">
      <div
        class="tab col s4"
        v-on:click="tabChange(0)"
        v-bind:class="{'selected-tab-bar': selectedTabNumber==0}"
      >
        <i class="material-icons tab-switch-bar">play_arrow</i>
      </div>
      <div
        class="tab col s4"
        v-on:click="tabChange(1)"
        v-bind:class="{'selected-tab-bar': selectedTabNumber==1}"
      >
        <i class="material-icons tab-switch-bar">playlist_play</i>
      </div>
      <div
        class="tab col s4"
        v-on:click="tabChange(2)"
        v-bind:class="{'selected-tab-bar': selectedTabNumber==2}"
      >
        <i class="material-icons tab-switch-bar">search</i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'selectedTabNumber'
  ],
  methods: {
    tabChange(tabNumber) {
      this.$emit('tab-change',tabNumber)
    }
  }
}
</script>