import { Ruty } from "ruty";

const { route } = Ruty.configure();

export const routes = {
  addRoom: route("/room/add").build(),
  listRooms: route("/room").build(),

  viewRoom: route("/room/view/:id").build<{ id: string }>(),

  viewRoomCourses: route("/room/view/:id/courses").build<{
    id: string;
  }>(),

  viewRoomCoursesSearch: route("/room/view/:id/courses/search").build<{
    id: string;
  }>(),

  viewRoomChats: route("/room/view/:id/chat").build<{ id: string }>(),

  viewRoomChatsSearch: route("/room/view/:id/chat/seach").build<{
    id: string;
  }>(),

  viewRoomCredentials: route("/room/view/:id/credentials").build<{
    id: string;
  }>(),

  settings: route("/settings").build(),
};
