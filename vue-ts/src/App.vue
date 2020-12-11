<template>
  <div id="app" @click="emitCloseModal($event)">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script lang="ts">
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import { EventBus, EventBusEvents } from "./components/EventBus";

export default {
  name: "app",
  components: {
    Header,
    Footer,
  },
  methods: {
    emitCloseModal(event: Event) {
      EventBus.$emit(EventBusEvents.CloseModal, event);
    },
  },
};
</script>

<style>
body {
  background-color: #ff5252;
}
hr {
  border: 1px solid black;
}
input:focus,
select:focus,
textarea:focus,
button:focus {
  outline: none;
}
#app {
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
  width: 80%;
  margin: 0 auto;
}
.card {
  border-radius: 5px;
  background: white;
  border: 3px solid #e7e7e7;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  padding: 0.5em;
  margin: 1em;
}
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.flex-item {
  display: flex;
}
.flex-wrap {
  flex-wrap: wrap;
}
.flex-center {
  align-items: center;
  justify-content: center;
}
.flex-stretch {
  align-items: stretch;
}
.flex-space-between {
  justify-content: space-between;
}
.flex-row {
  flex-direction: row;
}
.flex-col {
  flex-direction: column;
}
.flex-flex {
  flex: 1;
}
.dropzone {
  border: 2px dashed #a33535;
  background: #df4747;
  border-radius: 5px;
  min-height: 1em;
  min-width: 1em;
  margin: 1em;
}
.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 60%;
}

/* The Close Button */
.modal-close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.modal.close:hover,
.modal-close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
