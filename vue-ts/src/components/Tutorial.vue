<template>
  <div>
    <div
      id="tutorial"
      class="tutorial flex-item flex-center card"
      title="Anleitung öffnen"
      @click="showModal = true"
    >
      <img :src="require('@/assets/icons/lightbulb.png')" />
    </div>
    <modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">Anleitung</h3>
      <div
        slot="body"
        class="flex-item flex-center flex-space-between flex-row"
      >
        <div class="equal-space">
          <p v-html="description"></p>
        </div>
        <div class="equal-space">
          <video loop controls muted>
            <source :src="require('@/assets/tutorials/' + video)" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Modal from "./Modal.vue";

@Component<Tutorial>({
  components: {
    Modal,
  },
})
export default class Tutorial extends Vue {
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  video: string;

  showModal = false;
}
</script>

<style scoped>
.tutorial > img {
  width: 100%;
  max-width: 30px;
}
p {
  margin: 1em;
  text-align: justify;
}
video {
  max-height: 100%;
  max-width: 100%;
}
</style>
