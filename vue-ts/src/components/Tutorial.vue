<template>
  <div
    id="tutorial"
    class="tutorial flex-item flex-center card"
    title="Anleitung öffnen"
    @click="openModal()"
  >
    <img :src="require('@/assets/icons/lightbulb.png')" />
    <div id="tutorial" class="modal">
      <div
        class="modal-content flex-item flex-center flex-space-between flex-row"
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
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { EventBus, EventBusEvents } from "./EventBus";

@Component<Tutorial>({})
export default class Tutorial extends Vue {
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  video: string;

  modal: HTMLElement;

  created() {
    EventBus.$on(EventBusEvents.CloseModal, (event) => this.closeModal(event));
  }

  mounted() {
    this.modal = document.getElementById("tutorial");
  }

  openModal() {
    this.modal.style.display = "block";
  }

  closeModal(event: Event) {
    if (event.target === this.modal) {
      this.modal.style.display = "none";
    }
  }
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
