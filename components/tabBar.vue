<template>
  <div id="tab-bar" class="row tab-row">
    <div class="col s12">
      <div
        class="tab col s4"
        @click="tabChange('TAB_PLAY')"
        :class="{'selected-tab-bar': selectedTab==='TAB_PLAY'}"
      >
        <i class="material-icons tab-switch-bar">play_arrow</i>
      </div>
      <div
        class="tab col s4"
        @click="tabChange('TAB_QUEUE')"
        :class="{'selected-tab-bar': selectedTab==='TAB_QUEUE'}"
      >
        <i class="material-icons tab-switch-bar">playlist_play</i>
      </div>
      <div
        class="tab col s4"
        @click="tabChange('TAB_SEARCH')"
        :class="{'selected-tab-bar': selectedTab==='TAB_SEARCH'}"
      >
        <i class="material-icons tab-switch-bar">search</i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    selectedTab: String
  },
  methods: {
    tabChange(tabName) {
      this.$emit("tab-change", tabName);
    }
  }
};
</script>
<style scoped>
#tab-bar {
  padding-top: 5px;
  padding-bottom: 5px;
  user-select: none; /* Firefox */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer */
  -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
  -webkit-user-select: none; /* Chrome, Safari, and Opera */
  -webkit-touch-callout: none; /* Disable Android and iOS callouts*/
}
.selected-tab-bar {
  border-bottom: solid 2px #da5019;
}
</style>