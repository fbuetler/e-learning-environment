<template>
  <div class="flex-item flex-wrap flex-row">
    <div
      class="flex-item flex-wrap flex-center card clickable"
      v-for="item in items"
      :key="item.id"
      :class="{
        selected: item.type === selected,
        nut: item.type === nut,
        stick: item.type === stick,
      }"
      @click="$emit('selected', item.type)"
      draggable
      @dragstart="$emit('selected', item.type)"
      @dragover.prevent
      @dragend.prevent
      @drop.prevent
    >
      <img :src="require('@/assets/' + item.img)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import MayasMixin, { itemType } from "@/components/mayas/Mayas";

@Component<NutsAndSticks>({})
export default class NutsAndSticks extends Mixins(MayasMixin) {
  @Prop({ required: true })
  selected: itemType;

  items: { id: number; type: itemType; img: string }[] = [
    {
      id: 1,
      type: itemType.NUT,
      img: "mayas/nut.png",
    },
    {
      id: 2,
      type: itemType.STICK,
      img: "mayas/stick.png",
    },
  ];
}
</script>
