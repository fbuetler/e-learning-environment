<template>
  <div class="tutorial flex-item flex-center card" @click="openModal()">
    <img :src="require('@/assets/icons/lightbulb.png')" />
    <div id="tutorial" class="modal">
      <div class="modal-content">
        <span id="modal-close" class="modal-close" @click="closeModal($event)"
          >&times;</span
        >
        <p>Some text about the exercise..</p>
        <video loop controls>
          <source
            src="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { EventBus, EventBusEvents } from "./EventBus";

@Component<Tutorial>({})
export default class Tutorial extends Vue {
  private modal: HTMLElement;
  private modalClose: HTMLElement;

  created() {
    EventBus.$on(EventBusEvents.CloseModal, (event) => this.closeModal(event));
  }

  mounted() {
    this.modal = document.getElementById("tutorial");
    this.modalClose = document.getElementById("modal-close");
  }

  openModal() {
    this.modal.style.display = "block";
  }

  closeModal(event: Event) {
    if (event.target === this.modal || event.target === this.modalClose) {
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
</style>
