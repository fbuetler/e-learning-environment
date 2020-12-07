<template>
  <div class="tutorial flex-item flex-center card" @click="openModal()">
    <img :src="require('@/assets/icons/lightbulb.png')" />
    <div id="tutorial" class="modal">
      <div
        class="modal-content flex-item flex-center flex-space-between flex-row"
      >
        <div>
          <p>{{ description }}</p>
        </div>
        <div>
          <video loop controls>
            <source
              :src="require('@/assets/tutorials/' + video)"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { EventBus, EventBusEvents } from "./EventBus";

@Component<Tutorial>({})
export default class Tutorial extends Vue {
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  video: string;

  private modal: HTMLElement;

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
video {
  width: 500px;
}
</style>
