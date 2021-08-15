import Vue from "nativescript-vue";
import App from "./components/App";
import store from "./store";
import axios from "axios";
import moment from "moment";

import DateTimePicker from "@nativescript/datetimepicker/vue";
import FontIcon from "nativescript-vue-fonticon";
import "./style.scss";
require("./plugins/app-mixins");

Vue.config.silent = TNS_ENV === "production";

Vue.use(FontIcon, {
  componentName: "FIcon", // <-- Optional. Will be the name for component icon.
  debug: false, // <-- Optional. Will output the css mapping to console.
  paths: {
    fa: "./assets/css/fontawesome.css",
    far: "./assets/css/regular.css",
    fas: "./assets/css/solid.css",
    fab: "./assets/css/brands.css",
  },
});
Vue.use(DateTimePicker);

Vue.prototype.$appSettings = require("tns-core-modules/application-settings");

moment.locale("id");
Vue.prototype.moment = moment;

Vue.prototype.$axios = axios;
// Vue.prototype.$axios.defaults.baseURL = "https://servisdenso.pandalas.id/api/";
Vue.prototype.$axios.defaults.baseURL = "http://192.168.123.91:8000/api/";
// Vue.prototype.$axios.defaults.baseURL =
//   TNS_ENV == "production"
//     ? "http://servisdenso.pandalas.id/api/"
//     : "http://192.168.123.91:8000/api/";

// router
import Navigator from "nativescript-vue-navigator";
import { routes } from "./routes";
Vue.use(Navigator, { routes });

Vue.registerElement(
  "DropDown",
  () => require("nativescript-drop-down/drop-down").DropDown
);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === "production";

new Vue({
  store,
  // render: h => h('frame', App),
  render: (h) => h(App),
}).$start();
