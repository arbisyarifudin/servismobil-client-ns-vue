<template>
  <Page actionBarHidden="true">
    <!-- <ScrollView> -->
    <ScrollView>
      <StackLayout>
        <FlexboxLayout class="login-page" paddingTop="30">
          <StackLayout class="login-form" paddingBottom="5">
            <Image
              src="~/assets/images/denso.png"
              class="login-logo"
              marginBottom="0"
            />
            <StackLayout>
              <Label
                text="Pendaftaran"
                class="h3 mb-1"
                margin="0"
                horizontalAlignment="center"
              ></Label>
            </StackLayout>

            <StackLayout class="form-group">
              <TextField
                class="form-control"
                hint="Nama Lengkap"
                autocorrect="false"
                autocapitalizationType="true"
                v-model="form.name"
              ></TextField>
            </StackLayout>

            <StackLayout class="form-group">
              <!-- :items="
              new ValueList([
                { display: 'Laki-laki', value: 'M' },
                { display: 'Perempuan', value: 'F' },
              ])
            " -->
              <DropDown
                android
                :items="['Laki-laki', 'Perempuan']"
                selectedIndex="0"
                @selectedIndexChanged="onGenderChange"
                class="form-control"
                hint="Jenis Kelamin"
              />
            </StackLayout>

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

            <StackLayout class="form-group">
              <TextField
                class="form-control"
                hint="Konfirmasi Password"
                v-model="form.password_confirmation"
                secure
              ></TextField>
            </StackLayout>

            <StackLayout class="form-group">
              <TextField
                class="form-control"
                hint="No. Telp/HP/WA"
                keyboardType="phone"
                autocorrect="false"
                autocapitalizationType="true"
                v-model="form.phone"
              ></TextField>
            </StackLayout>

            <StackLayout class="form-group">
              <TextView
                maxLength="150"
                class="form-control"
                hint="Alamat"
                autocorrect="false"
                autocapitalizationType="true"
                v-model="form.address"
              ></TextView>
            </StackLayout>

            <Button class="btn-main" @tap="doRegister" :isEnabled="!loading">
              <FormattedString>
                <!-- <FIcon name="fa-spinner" class="fas fa-spinner mr-2" />
            <Span text=" " />
            <Span text=" " /> -->
                <Span :text="loading ? 'Memproses...' : 'Daftar'" />
              </FormattedString>
            </Button>
          </StackLayout>
          <Label
            class="login-text--bottom"
            @tap="$navigator.navigate('/login')"
          >
            <FormattedString>
              <Span text="Sudah punya akun? " />
              <Span text="Masuk" fontWeight="bold" />
            </FormattedString>
          </Label>
        </FlexboxLayout>
      </StackLayout>
    </ScrollView>
    <!-- </ScrollView> -->
    <!-- <Label :text="'Hits:' + hits"></Label> -->
    <!-- <Label :text="'Token:' + token"></Label> -->
    <!-- <button
        text="to Dashboard" 
        @tap="$navigator.navigate('/dashboard', { clearHistory: true })"
      ></button> -->
  </Page>
</template>

<script >
// const appSettings = require("tns-core-modules/application-settings");
// import { ValueList } from "nativescript-drop-down";
// import { SelectedIndexChangedEventData } from "nativescript-drop-down";

export default {
  data() {
    return {
      form: {
        name: "",
        phone: "",
        gender: "M",
        address: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      loading: false,
      buttonDisabled: true,
      hits: 0,
      token: "",
      // ValueList,
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
    onGenderChange(args) {
      console.log(
        `Drop Down selected index changed from ${args.oldIndex} to ${args.newIndex}`
      );
      if (args.newIndex == 1) {
        this.form.gender = "F";
      } else {
        this.form.gender = "M";
      }
    },
    onClose(args) {
      console.log("onClose", args);
    },
    async doRegister() {
      if (!this.form.name) {
        alert({
          title: "Info",
          message: "Mohon isi nama terlebih dahulu!",
          okButtonText: "OK",
        });
        return;
      }
      if (!this.form.gender) {
        alert({
          title: "Info",
          message: "Mohon pilih jenis kelamin terlebih dahulu!",
          okButtonText: "OK",
        });
        return;
      }
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
      if (!this.form.password_confirmation) {
        alert({
          title: "Info",
          message: "Mohon isi konfirmasi password terlebih dahulu!",
          okButtonText: "OK",
        });
        return;
      }
      if (!this.form.phone) {
        alert({
          title: "Info",
          message: "Mohon isi telp/no HP terlebih dahulu!",
          okButtonText: "OK",
        });
        return;
      }
      if (!this.form.address) {
        alert({
          title: "Info",
          message: "Mohon isi alamat terlebih dahulu!",
          okButtonText: "OK",
        });
        return;
      }

      this.loading = true;
      this.$axios
        .post("customer/register", this.form)
        .then(({ data }) => {
          console.log("data", data);
          this.$appSettings.setString("token", data.data.token);
          this.$appSettings.setString("user", JSON.stringify(data.data.user));
          this.$store.commit("setAuth", data.data.user);
          console.log("isAuthenticated", this.isAuthenticated);
          this.$navigator.navigate("/dashboard", { clearHistory: true });
        })
         .catch((error) => {
          this.loading = false;
          console.log("error", error.response);
          if (error.response.status == 403) {
            alert({
              title: "Info",
              message: "Email / password salah!",
              okButtonText: "OK",
            });
          } else if (error.response.status == 422) {
            console.log("422 bro");
            for (let key in error.response.data.errors) {
              alert({
                title: "Info",
                message: error.response.data.errors[key][0],
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
.login-logo {
  width: 100;
  margin-bottom: 30;
}

.login-page {
  flex-direction: column;
  align-items: center;
}

.login-form {
  width: 100%;
  padding-left: 30;
  padding-right: 30;
  flex-grow: 2;
  vertical-align: middle;
}

.login-btn {
  margin-top: 20;
}

.form-group {
  margin-bottom: 15;
}

.form-control {
  padding: 10;
  placeholder-color: #afafaf;
  border-bottom-color: #e0e0e0;
}

.login-btn {
  background-color: #53ba82;
  color: #fff;
}

.login-btn:disabled {
  background-color: #a4a5a4;
}

.login-text--bottom {
  padding-bottom: 30;
}

DropDown.form-control {
  placeholder-color: #afafaf;
  border-style: solid;
  border-bottom-color: #e0e0e0;
  border-bottom-width: 1;
  margin-left: 18;
  margin-right: 18;
  padding: 1 5 5;
}

/* TextView.form-control {
  max-height: 50;
} */
</style>
