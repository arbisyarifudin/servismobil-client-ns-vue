import Vue from "nativescript-vue";
import Navigator from "nativescript-vue-navigator";
import { routes } from "../routes";
Vue.use(Navigator, { routes });

if (!Vue.__my_mixin__) {
  Vue.__my_mixin__ = true;
  Vue.mixin({
    created() {
      // console.log("mixin created hooks");
      // if (this.$navigator.route.meta.needsAuth) {
      //   console.log("verifying..");
      // }
    },
    methods: {
      toRupiah(x) {
        if (x) {
          x = x.toString();
          var pattern = /(-?\d+)(\d{3})/;
          while (pattern.test(x)) x = x.replace(pattern, "$1.$2");
        }
        return x;
      },
      async catchError({ response }) {
        console.log("catchError", response);
        if (response && response.status == 401) {
          alert({
            title: "Warning",
            message: response.data.message ?? response.data.error,
            okButtonText: "OK",
          });
          // this.$store.commit("clearAuth", {});
          // this.$appSettings.setString("token", null);
          // this.$navigator.navigate("/login", { clearHistory: true });
          // return false;
          // return this.logout();
        } else if (response && response.status == 403) {
          alert({
            title: "Forbidden",
            message: response.data.message ?? response.data.error,
            okButtonText: "OK",
          });
        } else if (response && response.status == 500) {
          alert({
            title: "Error",
            message: "Ups! Terjadi kesalahan. Mohon ulangi kembali.",
            okButtonText: "OK",
          });
        } else if (response && response.status == 504) {
          alert({
            title: "Error",
            message: "Ups! Mohon periksa koneksi Anda.",
            okButtonText: "OK",
          });
        } else if (response && response.status == 422) {
          for (let key in response.data.errors) {
            alert({
              title: "Warning",
              message: response.data.errors[key][0],
              okButtonText: "OK",
            });
          }
        } else {
          alert({
            title: "Error",
            message: "Ups! Terjadi kesalahan. Mohon ulangi kembali.",
            okButtonText: "OK",
          });
        }
        return "error";
      },
    },
  });
}
