<template>
  <Page actionBarHidden="true">
    <FlexboxLayout class="login-page">
      <StackLayout class="login-form">
        <Image src="~/assets/images/denso.png" class="login-logo" />
        <StackLayout class="form-group">
          <TextField
            class="form-control"
            hint="Email"
            keyboardType="email"
            autocorrect="false"
            autocapitalizationType="none"
            v-model="form.email"
          ></TextField>
        </StackLayout>

        <StackLayout class="form-group">
          <TextField
            class="form-control"
            hint="Password"
            v-model="form.password"
            secure
          ></TextField>
        </StackLayout>

        <Button class="btn-main" @tap="doLogin" :isEnabled="!loading">
          <FormattedString>
            <!-- <FIcon name="fa-spinner" class="fas fa-spinner mr-2" />
            <Span text=" " />
            <Span text=" " /> -->
            <Span :text="loading ? 'Memproses...' : 'Masuk'" />
          </FormattedString>
        </Button>
        <!-- <ActivityIndicator
          rowSpan="3"
          :busy="loading"
          v-if="loading"
        ></ActivityIndicator> -->
      </StackLayout>
      <!-- <Label :text="'Hits:' + hits"></Label> -->
      <!-- <Label :text="'Token:' + token"></Label> -->
      <!-- <button
        text="to Dashboard" 
        @tap="$navigator.navigate('/dashboard', { clearHistory: true })"
      ></button> -->
      <Label class="login-text--bottom" @tap="$navigator.navigate('/register')">
        <FormattedString>
          <Span text="Belum punya akun? " />
          <Span text="Daftar" fontWeight="bold" />
        </FormattedString>
      </Label>
    </FlexboxLayout>
  </Page>
</template>

<script >
// const appSettings = require("tns-core-modules/application-settings");

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      loading: false,
      buttonDisabled: true,
      hits: 0,
      token: "",
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  created() {
    // console.log(this.$axios.defaults.baseURL);
    console.log("isAuthenticated", this.isAuthenticated);
    const token = this.$appSettings.getString("token");
    if (this.isAuthenticated) {
      this.$navigator.navigate("/dashboard", { clearHistory: true });
    } else {
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
        });
    }
  },
  methods: {
    async doLogin() {
      if (!this.form.email) {
        alert({
          title: "Info",
          message: "Mohon isi email terlebih dahulu!",
          okButtonText: "OK",
        });
        return;
      }
      if (!this.form.password) {
        alert({
          title: "Info",
          message: "Mohon isi password terlebih dahulu!",
          okButtonText: "OK",
        });
        return;
      }

      this.loading = true;
      this.$axios
        .post("customer/login", this.form)
        .then((response) => {
          // return console.log("data", response);
          const data = response.data;
          if (data && data.success) {
            this.$appSettings.setString("token", data.data.token);
            this.$appSettings.setString("user", JSON.stringify(data.data.user));
            this.$store.commit("setAuth", data.data.user);
            console.log("isAuthenticated", this.isAuthenticated);
            this.$navigator.navigate("/dashboard", { clearHistory: true });
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.log("error", error);
          if (error.response.status == 403) {
            alert({
              title: "Info",
              message: "Email / password salah!",
              okButtonText: "OK",
            });
          } else if (error.response.status == 422) {
            console.log("422 bro");
            for (let key in response.data.errors) {
              alert({
                title: "Info",
                message: response.data.errors[key][0],
                okButtonText: "OK",
              });
            }
          } else {
            this.catchError(error);
          }
        });

      // console.log("baseurl", this.baseUrl + "/api/customer/login");

      // var rawResponse = await fetch(this.baseUrl + "/api/customer/login", {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(this.form),
      // }).catch(error);

      // var dataResponse = await rawResponse.json();

      // console.log(dataResponse);
    },
  },
};
</script>

<style scoped>
</style>
