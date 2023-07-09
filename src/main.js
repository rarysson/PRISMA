import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueToast from "vue-toast-notification";
import VueI18n from "vue-i18n";
import "vue-toast-notification/dist/theme-sugar.css";
import { messages } from "./i18n/locales";

Vue.use(VueToast, { position: "top-right" });
Vue.use(VueI18n);

Vue.config.productionTip = false;

const i18n = new VueI18n({
    locale: "en",
    fallbackLocale: "en",
    messages
});

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App)
}).$mount("#app");
