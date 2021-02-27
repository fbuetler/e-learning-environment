<template>
  <div
    id="dropzone"
    class="flex-item flex-center flex-col flex-flex dropzone"
    @click="$emit('dropped')"
    @dragover.prevent
    @dragend.prevent
    @drop.stop.prevent="$emit('dropped')"
  >
    <div v-if="nothingSelected">Platziere hier die {{ itemName }}</div>
    <div v-else>
      <slot>
        <div class="flex-item flex-center flex-row">
          <div
            v-for="(amount, i) in items"
            :key="`item-${i}`"
            class="flex-item flex-center flex-col"
          >
            <div v-for="j in amount" :key="`amount-${j}`" class="responsive">
              <img :src="require(`@/assets/${itemConfig[i].img}`)" />
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { item } from "@/components/shared/ItemSelection.vue";

@Component<ItemDropzone>({})
export default class ItemDropzone extends Vue {
  @Prop({ required: true })
  items: number[];
  @Prop({ required: true })
  itemConfig: item[];
  @Prop({ required: true })
  itemName: string;

  get nothingSelected(): boolean {
    return this.items.every((el) => el === 0);
  }
}
</script>

<style scoped>
.dropzone {
  min-height: 5em;
}
</style>
