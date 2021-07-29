<template>
  <Page actionBarHidden="true">
    <StackLayout>
      <StackLayout class="page-header bg-main">
        <Label text="Ubah Kendaraan" class="page-title"></Label>
        <Label
          v-if="detailVehicle"
          :text="'ID # ' + detailVehicle.id"
          class="page-subtitle"
        ></Label>
      </StackLayout>
      <ScrollView>
        <StackLayout class="page-body card" v-if="detailVehicle || form">
          <StackLayout class="form-group">
            <Label class="h4" fontWeight="500" text="Nama Kendaraan"></Label>
            <TextField
              class="form-control"
              hint="Misal: Vario 125 Techno"
              autocorrect="false"
              autocapitalizationType="true"
              v-model="form.name"
            ></TextField>
          </StackLayout>
          <StackLayout class="form-group">
            <Label
              class="h4"
              fontWeight="500"
              text="Brand/Merek Kendaraan"
            ></Label>
            <TextField
              class="form-control"
              hint="Misal: Honda"
              autocorrect="false"
              autocapitalizationType="true"
              v-model="form.brand"
            ></TextField>
          </StackLayout>
          <StackLayout class="form-group">
            <Label class="h4" fontWeight="500" text="Tahun Kendaraan">
              <FormattedString>
                <Span text="Tahun Kendaraan" class=""></Span>
                <Span text=" " />
                <Span text=" " />
                <Span text="[opsional]" class="text-danger small"></Span>
              </FormattedString>
            </Label>
            <TextField
              class="form-control"
              hint="Misal: 2015"
              autocorrect="false"
              autocapitalizationType="true"
              keyboardType="number"
              v-model="form.year"
            ></TextField>
          </StackLayout>
          <StackLayout class="form-group">
            <Label
              class="h4"
              fontWeight="500"
              text="No. Polisi Kendaraan"
            ></Label>
            <TextField
              class="form-control"
              hint="Masukkan nomor polisi / plat nomor"
              autocorrect="false"
              autocapitalizationType="true"
              v-model="form.plate_number"
            ></TextField>
          </StackLayout>
          <StackLayout class="form-group">
            <Label class="h4" fontWeight="500" text="No. Rangka Kendaraan">
              <FormattedString>
                <Span text="No. Rangka Kendaraan" class=""></Span>
                <Span text=" " />
                <Span text=" " />
                <Span text="[opsional]" class="text-danger small"></Span>
              </FormattedString>
            </Label>
            <TextField
              class="form-control"
              hint="Masukkan rangka kendaraan"
              autocorrect="false"
              autocapitalizationType="true"
              v-model="form.chassis_number"
            ></TextField>
          </StackLayout>
          <Button @tap="onSubmit" class="btn-main" :isEnabled="!loading">
            <FormattedString>
              <FIcon name="fa-save" class="fas" />
              <Span text=" " />
              <Span text=" " />
              <Span :text="loading ? 'Memproses...' : 'Simpan Kendaraan'" />
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
        customer_id: "",
        name: "",
        brand: "",
        year: "",
        plate_number: "",
        chassis_number: "",
      },
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    console.log(this.id);
    this.getDetail();
  },
  methods: {
    async getDetail() {
      this.loading = true;
      this.detailVehicle = await this.$axios
        .get("/vehicle/" + this.id)
        .then(({ data }) => {
          console.log(data);
          return data.data;
        })
        .catch((error) => {
          console.log(error);
          this.catchError(error);
        });
      console.log(this.detailVehicle);
      this.form = this.detailVehicle;
      this.loading = false;
    },
    onSubmit() {
      if (!this.form.name) {
        alert({
          title: "Info",
          message: "Nama kendaraan diperlukan!",
          okButtonText: "OK",
        });
        return;
      }

      if (!this.form.brand) {
        alert({
          title: "Info",
          message: "Brand/merek kendaraan diperlukan!",
          okButtonText: "OK",
        });
        return;
      }

      if (!this.form.plate_number) {
        alert({
          title: "Info",
          message: "Nomor Polisi/Plat diperlukan!",
          okButtonText: "OK",
        });
        return;
      }

      //   this.form.customer_id = this.user.id;
      const dataSubmit = {
        name: this.form.name,
        brand: this.form.brand,
        year: this.form.year,
        plate_number: this.form.plate_number,
        chassis_number: this.form.chassis_number,
      };

      this.loading = true;
      this.$axios
        .put("vehicle/" + this.id, dataSubmit)
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
          this.$navigator.navigate("/vehicles", { clearHistory: true });
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.catchError(error);
        });
    },
  },
};
</script>