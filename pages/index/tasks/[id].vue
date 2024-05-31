<script setup>
import { useBoardStore } from "~/stores/boardStore";

const boardStore = useBoardStore()
const route = useRoute()

const task = computed(() => boardStore.getTask(route.params.id))
</script>

<template>
  <UCard>
    <template #header>
      <UFormGroup label="Name">
        <UInput type="text" v-model="task.name" />
      </UFormGroup>
    </template>
    <UFormGroup label="Description">
      <UTextarea v-model="task.description" />
    </UFormGroup>

  </UCard>
</template>
