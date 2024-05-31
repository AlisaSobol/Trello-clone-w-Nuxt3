<script setup>
import { useBoardStore } from '../stores/boardStore'
import BoardColumn from '../components/BoardColumn'
const newColumnName = ref('')
const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()

const addColumn = () => {
  boardStore.addColumn(newColumnName.value)
  newColumnName.value = ''
}

const isModalOpen = computed( () => {
  return route.name === 'index-tasks-id' // that is folders structure in pages folder and is out url path
})

const closeModal = () => router.push('/')

</script>

<template>
  <main>
    <h1>Build a trello clone</h1>
    <UContainer class="col p-3">
      <UInput
          v-model="newColumnName"
          type="text"
          placeholder="New column"
          icon="i-heroicons-plus-circle-solid"
          @keyup.enter="addColumn"
      />
    </UContainer>
    <div class="container">
      <BoardColumn
          v-for="(column, columnIndex) in boardStore.board.columns"
          :key="column.id"
          class="col"
          :columnIndex="columnIndex"
          :column="column"
       />
    </div>
    <div v-if="isModalOpen" class="modal">
      <div class="modal__content">
        <UIcon class="closeModalIcon" name="i-heroicons-x-circle-16-solid" @click="closeModal"/>
        <NuxtPage :key="route.fullPath" />
      </div>
    </div>

  </main>
</template>
