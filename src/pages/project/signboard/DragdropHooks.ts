import { useCallback } from "react"
import { DropResult } from "react-beautiful-dnd"
import { useTaskQueryKey, useTasks, useTaskSearchParams } from "./taskHooks"
import { useReorderSignboards, useReorderTasks, useSignboardQueryKey, useSignboards } from "./signboardHooks"

export const useDragEnd = () => {
  const { data: Signboards } = useSignboards()
  const { mutate: reorderSignboards } = useReorderSignboards(useSignboardQueryKey())
  const { mutate: reorderTasks } = useReorderTasks(useTaskQueryKey())
  const { data: allTasks } = useTasks(useTaskSearchParams())
  return useCallback(({ source, destination, type }: DropResult) => {
    if (!destination) return
    if (type === "COLUMN") {
      const fromId = Signboards?.[source.index].id
      const toId = Signboards?.[destination.index].id
      if (!fromId || !toId || fromId === toId) return
      const type = destination.index > source.index ? "after" : "before"
      reorderSignboards({ fromId, referenceId: toId, type })
    }
    if (type === "ROW") {
      const formSignboardId = Number(source.droppableId)
      const toSignboardId = Number(destination.droppableId)
      const fromtask = allTasks?.filter(task => task.kanbanId === formSignboardId)[source.index]
      const toTask = allTasks?.filter(task => task.kanbanId === toSignboardId)[destination.index]
      if (!fromtask || !toTask || fromtask?.id === toTask?.id) return
      const type = formSignboardId === toSignboardId && destination.index > source.index ? "after" : "before"
      reorderTasks({
        fromId: fromtask.id,
        referenceId: toTask.id,
        formKanbanId: formSignboardId,
        toKanbanId: toSignboardId,
        type
      })
    }
  }, [Signboards, reorderSignboards, allTasks, reorderTasks])
}

