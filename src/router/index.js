import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../pages/Home.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/registration",
        name: "Registration",
        component: () => import("../pages/Registration.vue")
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../pages/Login.vue")
    },
    {
        path: "/user",
        name: "User",
        component: () => import("../pages/User.vue")
    }
];

routes.push({
    path: "*",
    name: "Page404",
    component: () => import("../pages/Page404.vue")
});

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
