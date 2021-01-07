<template>
  <div>
    <div
      id="tutorial"
      class="tutorial flex-item flex-center card clickable"
      title="Anleitung öffnen"
      @click="showModal = true"
    >
      <img :src="require('@/assets/icons/lightbulb.png')" />
    </div>
    <modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">Anleitung</h3>
      <div
        slot="body"
        class="flex-item flex-center flex-space-between flex-col"
      >
        <div class="flex-item flex-center flex-space-between flex-row">
          <div class="description equal-space">
            <slot name="description">Unintentionally empty!</slot>
          </div>
          <div class="video equal-space">
            <slot name="video">Unintentionally empty!</slot>
          </div>
        </div>
        <div>
          <button
            class="card clickable"
            @click="
              showModal = false;
              $emit('start-tutorial-animation');
            "
          >
            Live Demo!
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Modal from "./Modal.vue";

@Component<Tutorial>({
  components: {
    Modal,
  },
})
export default class Tutorial extends Vue {
  showModal = false;
}
</script>

<style scoped>
.tutorial > img {
  width: 100%;
  max-width: 30px;
}
</style>
