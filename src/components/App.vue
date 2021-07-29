<template>
  <Navigator :defaultRoute="isAuthenticated ? '/dashboard' : '/login'" />
  <!-- <Page actionBarHidden="true">
    <StackLayout>
      <Label text="Hello world!"></Label>
      <button text="ke Dashboard" @tap="$navigateTo(dashboardPage)"></button>
      <button text="ke Login" @tap="$navigateTo(loginPage)"></button>
    </StackLayout>
  </Page> -->
</template>

<script >
export default {
  data() {
    return {
      isLoggedIn: false,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  created() {
    console.log("isAuthenticated", this.isAuthenticated);
    const token = this.$appSettings.getString("token");
    if (token) {
      this.$axios
        .get("customer/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then(({ data }) => {
          console.log("data", data);
          if (data && data.data) {
            this.$store.commit("setAuth", data.data);
            console.log("isAuthenticated", this.isAuthenticated);
            this.$appSettings.setString("user", JSON.stringify(data.data));
            this.$navigator.navigate("/dashboard", { clearHistory: true });
          }
        })
        .catch(({ response }) => {
          console.log("error", response);
          if (response.status == 401) {
            this.$store.commit("clearAuth", {});
            this.$appSettings.setString("token", null);
            this.$navigator.navigate("/login", { clearHistory: true });
          }
        });
    }
  },
};

// import Login from "./Login";
// import Dashboard from "./Dashboard";

// export default {
//   data() {
//     return {
//       loginPage: Login,
//       dashboardPage: Dashboard,
//       isLoggedIn: false,
//     };
//   },
//   moutend() {
//     console.log(this.$navigator.path);
//   },
//   methods: {},
// };
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
</style>
