<template>
  <div id="items" class="flex-item flex-center flex-col flex-flex card">
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { item } from "@/components/shared/ItemSelection.vue";

@Component<ItemGroup>({})
export default class ItemGroup extends Vue {
  @Prop({ required: true })
  items: number[];
  @Prop({ required: true })
  itemConfig: item[];
}
</script>

<style scoped></style>
