const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "register",
        component: () => import("pages/RegisterPage.vue"),
      },
      {
        path: "login",
        component: () => import("pages/LoginPage.vue"),
      },
      {
        path: "events",
        component: () => import("pages/EventsPage.vue"),
      }
    ]
  },
  {
    path: "/profile",
    component: () => import("layouts/ProfileDashboardLayout.vue"),
    children: [
      {
        path: "personal",
        component: () => import("pages/ProfilePersonalPage.vue"),
      },
      {
        path: "events",
        component: () => import("pages/ProfileEventsPage.vue"),
      },
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
