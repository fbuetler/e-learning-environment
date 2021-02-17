<template>
  <div id="tutorial-wrapper">
    <div
      id="tutorial"
      class="flex-item flex-center card clickable responsive"
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
          <div class="responsive equal-space">
            <slot name="video">Unintentionally empty!</slot>
          </div>
        </div>
        <!-- 
        Uncomment the following code to show a button in the tutorial to start
        the tutorial animation. This is used to create the tutorial videos.
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
        -->
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Modal from "@/components/shared/Modal.vue";

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
.description > p {
  margin: 1em;
  text-align: justify;
}
</style>
