export const COACH_ROUTES = {
  rooms: "/dashboard/rooms",
  landing: "/dashboard/rooms/coach",
  setup: (level) => `/dashboard/rooms/coach/setup?level=${level}`,
  battle: "/dashboard/rooms/coach/battle",
  results: "/dashboard/rooms/coach/results",
};