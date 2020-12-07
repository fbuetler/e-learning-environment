<template>
  <div class="flex-item flex-center card" @click="openModal()">
    <div>Open Modal</div>
    <div id="tutorial" class="modal">
      <div class="modal-content">
        <span class="modal-close" @click="closeModal()">&times;</span>
        <p>Some text in the Modal..</p>
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
  created() {
    EventBus.$on(EventBusEvents.CloseModal, (event) => this.closeModal(event));
  }

  openModal() {
    const modal = document.getElementById("tutorial");
    modal.style.display = "block";
  }

  closeModal(event: Event) {
    const modal = document.getElementById("tutorial");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }
}
</script>
