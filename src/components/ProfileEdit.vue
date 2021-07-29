<template>
  <Page actionBarHidden="true">
    <StackLayout>
      <StackLayout class="page-header bg-main">
        <Label text="Akun Saya" class="page-title"></Label>
        <!-- <Label
          text=""
          class="page-subtitle"
        ></Label> -->
      </StackLayout>
      <ScrollView>
        <StackLayout class="page-body card" v-if="form">
          <StackLayout class="form-group">
            <Label class="h4" fontWeight="500" text="Nama Lengkap"></Label>
            <TextField
              class="form-control"
              autocorrect="false"
              autocapitalizationType="true"
              v-model="form.name"
            ></TextField>
          </StackLayout>
          <StackLayout class="form-group">
            <Label class="h4" fontWeight="500" text="Jenis Kelamin"></Label>
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
            <Label class="h4" fontWeight="500" text="No. Telp/HP/WA"></Label>
            <TextField
              class="form-control"
              keyboardType="number"
              autocorrect="false"
              autocapitalizationType="true"
              v-model="form.phone"
            ></TextField>
          </StackLayout>
          <StackLayout class="form-group">
            <Label class="h4" fontWeight="500" text="Alamat Lengkap"></Label>
            <TextView
              maxLength="250"
              class="form-control"
              autocorrect="false"
              autocapitalizationType="true"
              v-model="form.address"
            ></TextView>
          </StackLayout>
          <!-- <StackLayout class="form-group">
            <Label class="h4" fontWeight="500" text="Foto"></Label>
            <TextField
              class="form-control"
              autocorrect="false"
              autocapitalizationType="true"
              v-model="form.photo"
            ></TextField>
          </StackLayout> -->

          <Button @tap="onSubmit" class="btn-main" :isEnabled="!loading">
            <FormattedString>
              <FIcon name="fa-save" class="fas" />
              <Span text=" " />
              <Span text=" " />
              <Span :text="loading ? 'Memproses...' : 'Simpan Perubahan'" />
            </FormattedString>
          </Button>
        </StackLayout>
      </ScrollView>
    </StackLayout>
  </Page>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      loading: false,
      detailVehicle: {},
      form: {
        name: "",
        phone: "",
        gender: "",
        address: "",
        // photo: "",
      },
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    // this.getDetail();
    this.form = this.user;
  },
  methods: {
    // async getDetail() {
    //   this.loading = true;
    //   this.detailVehicle = await this.$axios
    //     .get("/vehicle/" + this.id)
    //     .then(({ data }) => {
    //       console.log(data);
    //       return data.data;
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       this.catchError(error);
    //     });
    //   console.log(this.detailVehicle);
    //   this.form = this.detailVehicle;
    //   this.loading = false;
    // },
    onSubmit() {
      if (!this.form.name) {
        alert({
          title: "Info",
          message: "Nama lengkap diperlukan!",
          okButtonText: "OK",
        });
        return;
      }

      if (!this.form.gender) {
        alert({
          title: "Info",
          message: "Jenis Kelamin diperlukan!",
          okButtonText: "OK",
        });
        return;
      }

      if (!this.form.phone) {
        alert({
          title: "Info",
          message: "Nomor Telp/HP/WA diperlukan!",
          okButtonText: "OK",
        });
        return;
      }

      if (!this.form.address) {
        alert({
          title: "Info",
          message: "Alamat diperlukan!",
          okButtonText: "OK",
        });
        return;
      }

      //   this.form.customer_id = this.user.id;
      const dataSubmit = {
        name: this.form.name,
        phone: this.form.phone,
        address: this.form.address,
        gender: this.form.gender,
      };

      const token = this.$appSettings.getString("token");

      this.loading = true;
      this.$axios
        .put("customer/profile", dataSubmit, {
          headers: {
            Authorization: "Bearer " + token,
            "Content-type": "application/json",
          },
        })
        .then(({ data }) => {
          console.log("data", data);
          if (data && data.success) {
            alert({
              title: "Sukses",
              message: data.message,
              okButtonText: "OK",
            });
          }
          // this.$navigator.navigate("/history", { props: { id: data.data.id }});
          this.$navigator.navigate("/dashboard");
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.catchError(error);
          if (error.response.status == 401) {
            console.log("401 errornya");
            this.$store.commit("clearAuth", {});
            this.$appSettings.setString("token", null);
            this.$navigator.navigate("/login", { clearHistory: true });
            return;
          }
        });
    },
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
  },
};
</script>