import { features } from "@ava-pro/moodle-client-js"
import { makeStorageMutator } from "@ava-pro/shared/lib/features/storage"
import { updateRoom } from "@ava-pro/shared/lib/features/storage/schemas/rooms"
import { IRoom } from "@ava-pro/shared/lib/features/storage/schemas/rooms/room"
import { IRoomCacheCourse } from "@ava-pro/shared/lib/features/storage/schemas/rooms/room/cache/courses/course"
import { useCallback, useEffect } from "react"
import { useAsync } from "react-async"
import { useContextSelector } from "use-context-selector"
import { RoomContext } from "../Components/RoomContext"
import { RoomAuthedContext } from "../Components/RoomAuthedContext"

const handleUpdateRoom = makeStorageMutator(updateRoom)

const handleUpdateRoomCoursesCache = (
  id: IRoom["id"],
  pageCourses: features.course.IGetEnrolledCoursesByTimelineClassificationCourseDto[]
) =>
  handleUpdateRoom({
    id,
    recipe: (room) => {
      room.cache.courses = pageCourses as unknown as IRoomCacheCourse[]
    }
  })

export const useRoomCachedCourses = () => {
  const moodleClient = useContextSelector(
    RoomContext,
    ({ moodleClient }) => moodleClient
  )

  const roomId = useContextSelector(RoomContext, ({ room: { id } }) => id)

  const userId = useContextSelector(RoomAuthedContext, ({ userId }) => userId)

  const coursesCache = useContextSelector(
    RoomContext,
    ({
      room: {
        cache: { courses }
      }
    }) => courses
  )

  const hasCache = coursesCache !== null

  const updateCoursesCache = useCallback(async () => {
    const { courses } =
      await moodleClient.getEnrolledCoursesByTimelineClassification()
    await handleUpdateRoomCoursesCache(roomId, courses)
  }, [hasCache, moodleClient])

  const { run, error, isLoading } = useAsync({ deferFn: updateCoursesCache })

  const reload = useCallback(() => run(), [run])

  useEffect(() => {
    if (!hasCache) {
      reload()
    }
  }, [reload, hasCache])

  useEffect(() => {
    if (userId !== null) {
      reload()
    }
  }, [reload, userId])

  const loadCacheError = !hasCache && error

  return {
    coursesCache,
    hasCache,
    isLoadingCache: isLoading,
    loadCacheError,
    reload
  }
}
