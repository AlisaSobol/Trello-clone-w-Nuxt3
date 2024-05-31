import { v4 as uuid } from 'uuid'
import { defineStore } from "pinia"
import { useStorage } from '@vueuse/core'
import boardData from '~/data/board.json'

export const useBoardStore = defineStore('boardStore', () => {
 const board = useStorage('board', boardData);

 // getters IS a computed properties:
 const getTask = computed(() => taskId => {
  for (const column of board.value.columns) {
   const task = column.tasks.find( task => task.id === taskId )
   if (task) return task
  }
 })

 function addColumn(colName: String) {
  board.value.columns.push({
   id: uuid(),
   name: colName,
   tasks: []
  })
 }

 function addNewTask({ columnIndex, taskName }) {
  board.value.columns[columnIndex].tasks.push({
   id: uuid(),
   name: taskName,
   description: ''
   })
 }

 function deleteColumn(colIndex: Number) {
  board.value.columns.splice(colIndex, 1)
 }

 function deleteTask({columnIndex, taskIndex}) {
  board.value.columns[columnIndex].tasks.splice(taskIndex, 1)
 }

 function moveTask ({ taskIndex, toTaskIndex, fromColumnIndex, toColumnIndex }) {
  const task = board.value.columns[fromColumnIndex].tasks.splice(taskIndex, 1)[0]

  board.value.columns[toColumnIndex].tasks.splice(toTaskIndex, 0, task)
 }

 function moveColumn ({ fromColumnIndex, toColumnIndex }) {
  const column = board.value.columns.splice(fromColumnIndex, 1)[0]

  board.value.columns.splice(toColumnIndex, 0, column)
 }

 return {
  board,
  getTask,
  addColumn,
  deleteColumn,
  addNewTask,
  deleteTask,
  moveTask,
  moveColumn
 }
})
