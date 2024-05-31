<script setup>
import { useBoardStore } from '../stores/boardStore'

const editState = ref(false)
const newTaskName = ref('')
const router = useRouter()

const boardStore = useBoardStore()
defineProps({
  column: {
    type: Object,
    required: true
  },
  columnIndex: {
    type: Number,
    required: true
  }
})

const deleteCol = (colIndex) => {
  boardStore.deleteColumn(colIndex)
}

const goToTask = (taskId) => {
  router.push(`/tasks/${taskId}`)
}

const addTask = (colIndex) => {
  boardStore.addNewTask({ columnIndex: colIndex, taskName: newTaskName.value})

  newTaskName.value = ''
}

const deleteTask = ({columnIndex, taskIndex}) => {
  boardStore.deleteTask({columnIndex, taskIndex})
}

const pickupTask = (event, {fromTaskIndex, fromColumnIndex}) => {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.setData('type', 'task')
  event.dataTransfer.setData('from-column-index', fromColumnIndex)
  event.dataTransfer.setData('from-task-index', fromTaskIndex)
}

const dropItem = (event, {toColumnIndex, toTaskIndex}) => {
  const itemType = event.dataTransfer.getData('type')
  const fromColumnIndex = event.dataTransfer.getData('from-column-index')

  if (itemType === 'task') {
    const fromTaskIndex = event.dataTransfer.getData('from-task-index')

    boardStore.moveTask({
      taskIndex: fromTaskIndex,
      toTaskIndex,
      fromColumnIndex,
      toColumnIndex
    })
  } else if (itemType === 'column') {
    boardStore.moveColumn({
      fromColumnIndex,
      toColumnIndex
    })
  }
}

const pickupCol = (event, fromColumnIndex) => {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.setData('type', 'column')
  event.dataTransfer.setData('from-column-index', fromColumnIndex)
}

</script>

<template>
  <UCard class="col"
         draggable="true"
         @dragstart.self="pickupCol($event, columnIndex)"
         @dragenter.prevent
         @dragover.prevent
         @drop.stop="dropItem($event, {toColumnIndex: columnIndex})"
  >
    <template #header>
      <div class="col__header">
        <UInput v-if="editState" type="text" v-model="column.name" color="gray" />
        <h5 v-else class="title mb-2">{{column.name}}</h5>

        <div class="btn-group">
          <UButton @click="editState = !editState" color="orange" class="mr-2">Edit</UButton>
          <UButton @click="deleteCol(columnIndex)" color="red">Delete</UButton>
        </div>
      </div>
    </template>
    <div v-for="(task, taskIndex) in column.tasks" :key="task.name">
      <UCard
          class="mb-2"
          draggable="true"
          @dragstart="pickupTask($event, {
            fromTaskIndex: taskIndex,
            fromColumnIndex: columnIndex
          })"
          @drop.stop="dropItem($event, {
            toColumnIndex: columnIndex,
            toTaskIndex: taskIndex
          })"
      >
        <div class="task-holder">
          <strong @click="goToTask(task.id)" class="ticket__name">{{task.name}}</strong>

          <UButton @click="deleteTask({columnIndex, taskIndex})"
                   color="red"
                   variant="soft"
          >
            <UIcon name="i-heroicons-x-mark-16-solid" />
          </UButton>
        </div>
      </UCard>
    </div>
    <UInput
        v-model="newTaskName"
        type="text"
        placeholder="New Task Name"
        icon="i-heroicons-plus-circle-solid"
        @keyup.enter="addTask(columnIndex)"
    />
  </UCard>
</template>

