<template>
  <Page actionBarHidden="true">
    <StackLayout>
      <StackLayout class="page-header bg-main">
        <Label text="Detail Reservasi" class="page-title"></Label>
        <FlexboxLayout
          alignItems="center"
          justifyContent="space-between"
          v-if="detailReserv && !loading"
        >
          <Label
            v-if="detailReserv.id"
            textWrap="true"
            :text="'ID #' + detailReserv.id"
            class="page-subtitle"
          ></Label>
          <Label
            v-if="detailReserv.service"
            class="page-subtitle"
            textWrap="true"
            :text="'Service : ' + detailReserv.service.status"
            :class="badgeColor(detailReserv.service.status)"
          ></Label>
        </FlexboxLayout>
        <Label
          v-if="detailReserv"
          textWrap="true"
          :text="
            'Tanggal : ' + moment(detailReserv.created_at).format('DD/MM/YYYY')
          "
          class="page-subtitle"
        ></Label>
      </StackLayout>
      <ScrollView>
        <StackLayout class="page-body card" v-if="detailReserv.package">
          <Label
            v-if="haminsatu"
            text="Konfirmasi"
            class="h3"
            fontWeight="500"
            textWrap="true"
          >
            <FormattedString>
              <Span class="h3">Konfirmasi: </Span>
              <Span
                fontWeight="500"
                v-if="detailReserv.attendance_confirmation == 'Not Present'"
                >Tidak Jadi Datang</Span
              >
              <Span fontWeight="500" v-else>Akan Datang</Span>
            </FormattedString>
          </Label>
          <FlexboxLayout flexDirection="" v-if="haminsatu" class="mb-2">
            <Label
              textWrap="true"
              class="mr-2 btn btn-sm"
              @tap="confirmAttend(detailReserv.id, 'Present')"
            >
              <FormattedString>
                <FIcon name="fa-check" size="20" class="fas text-main" />
                <Span>Datang</Span>
              </FormattedString>
            </Label>
            <Label
              textWrap="true"
              @tap="confirmAttend(detailReserv.id, 'Not Present')"
              class="btn btn-sm"
            >
              <FormattedString>
                <FIcon name="fa-times" size="20" class="fas text-main" />
                <Span>Tidak Jadi</Span>
              </FormattedString>
            </Label>
          </FlexboxLayout>
          <Label class="h3" fontWeight="500" text="Keluhan :"></Label>
          <Label
            class="package-about--text mb-2"
            :text="detailReserv.vehicle_complaint"
            textWrap="true"
          ></Label>
          <Label class="h3" fontWeight="500" text="Kendaraan :"></Label>
          <FlexboxLayout
            alignItems="center"
            justifyContent="space-between"
            class="mb-2"
          >
            <Label
              class="package-about--text"
              :text="
                detailReserv.vehicle
                  ? detailReserv.vehicle.brand +
                    ' - ' +
                    detailReserv.vehicle.name
                  : '?'
              "
              textWrap="true"
            ></Label>
            <Label
              :text="'Nopol: ' + detailReserv.vehicle.plate_number"
              class="package-item--name"
              textWrap="true"
            />
          </FlexboxLayout>
          <Label class="h3" fontWeight="500" text="Jadwal :"></Label>
          <Label
            class="package-about--text mb-2"
            :text="
              moment(
                detailReserv.reservation_date +
                  ' ' +
                  detailReserv.reservation_time
              ).format('DD MMMM YYYY HH:mm')
            "
            textWrap="true"
          ></Label>
          <Label class="h3" fontWeight="500" text="Paket Layanan:"></Label>
          <FlexboxLayout
            alignItems="center"
            justifyContent="space-between"
            class="mb-2"
          >
            <Label
              class="package-about--text"
              :text="detailReserv.package ? detailReserv.package.name : '?'"
              textWrap="true"
            ></Label>
            <Label
              :text="'Rp ' + toRupiah(detailReserv.package_price)"
              class="package-item--name text-danger"
              textWrap="true"
            />
          </FlexboxLayout>
          <Label class="h3" fontWeight="500" text="Rincian Paket:"></Label>
          <StackLayout
            class="list-view mb-2"
            v-for="item in detailReserv.package.products"
            :key="item.id"
          >
            <FlexboxLayout
              class="list-item product-item"
              alignItems="center"
              marginTop="0"
              marginBottom="0"
              paddingTop="0"
              paddingBottom="0"
            >
              <!-- <Image
                :src="item.picture_url"
                width="60"
                height="60"
                verticalAlignment="center"
                stretch="fill"
                class="mr-1"
              ></Image> -->
              <StackLayout>
                <FlexboxLayout
                  justifyContent="space-between"
                  style="width: 100%"
                >
                  <Label
                    :text="item.name"
                    class="product-item--name"
                    textWrap="true"
                  />
                  <Label
                    :text="'Rp ' + toRupiah(item.price)"
                    class="product-item--price"
                    textWrap="true"
                  />
                </FlexboxLayout>
                <FlexboxLayout>
                  <FIcon name="fa-tag" size="11" class="fas text-main mr-1" />
                  <Label
                    v-if="item.category"
                    :text="item.category.name"
                    class="product-item--category"
                    textWrap="true"
                  />
                </FlexboxLayout>
              </StackLayout>
            </FlexboxLayout>
            <Label
              :text="item.about"
              class="product-item--about"
              textWrap="true"
            />
          </StackLayout>
          <FlexboxLayout
            v-if="detailReserv.service.status == 'Finish'"
            alignItems="center"
            justifyContent="space-between"
            class="mb-1"
          >
            <Label
              class="package-about--text"
              text="Tanggal Servis "
              textWrap="true"
            ></Label>
            <Label
              v-if="detailReserv.service"
              :text="
                moment(detailReserv.service.service_date).format('DD MMMM YYYY')
              "
              class="package-item--name text-info"
              textWrap="true"
            />
          </FlexboxLayout>
          <Label
            class="package-about--text"
            text="Keterangan Tambahan "
            textWrap="true"
          ></Label>
          <StackLayout
            v-if="detailReserv.service.status == 'Finish'"
            class="mb-2 card card-body"
          >
            <Label
              v-if="detailReserv.service"
              :text="
                detailReserv.service.note
                  ? detailReserv.service.note
                  : 'Tidak ada catatan'
              "
              class="package-item--about-text"
              fontStyle="italic"
              textWrap="true"
            />
          </StackLayout>
          <FlexboxLayout
            v-if="detailReserv.service.status == 'Finish'"
            alignItems="center"
            justifyContent="space-between"
            class="mb-2"
          >
            <Label
              class="package-about--text"
              text="Biaya Servis "
              textWrap="true"
            ></Label>
            <Label
              :text="'Rp ' + toRupiah(detailReserv.service.fee)"
              class="package-item--name text-danger"
              textWrap="true"
            />
          </FlexboxLayout>
          <FlexboxLayout
            v-if="detailReserv.service.status == 'Finish'"
            alignItems="center"
            justifyContent="space-between"
            class="mb-2"
          >
            <Label
              class="package-about--text"
              text="Total Tagihan "
              textWrap="true"
            ></Label>
            <Label
              v-if="detailReserv.service.payment"
              :text="'Rp ' + toRupiah(detailReserv.service.payment.bill)"
              class="package-item--name text-danger"
              fontWeight="500"
              textWrap="true"
            />
          </FlexboxLayout>
          <!-- </v-template> -->
          <!-- </ListView> -->
        </StackLayout>
      </ScrollView>
    </StackLayout>
  </Page>
</template>

<script>
import { ValueList } from "nativescript-drop-down";

export default {
  props: ["id"],
  data() {
    return {
      loading: false,
      detailReserv: {},
      datetime: "",
      form: {
        customer_id: "",
        package_id: "",
        vehicle_id: "",
        vehicle_complaint: "",
        reservation_date: "",
        reservation_time: "09:00",
        reservation_origin: "Online",
        products: [],
      },
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    vehicles() {
      return [];
      //   let vehicles = this.user.vehicles.map((item) => {
      //     return {
      //       display: item.brand + " - " + item.name,
      //       value: item.id,
      //     };
      //   });
      //   return new ValueList(vehicles);
    },
  },
  computed: {
    haminsatu() {
      return true;
    },
  },
  mounted() {
    this.getDetail();
    console.log(this.user);
  },
  methods: {
    // async getList() {
    //   this.loading = true;
    //   this.listPackages = await this.$axios
    //     .get("/package")
    //     .then(({ data }) => {
    //       return data.data;
    //     })
    //     .catch(({ response }) => {
    //       this.catchError(response);
    //     });
    //   this.loading = false;
    // },
    badgeColor(status) {
      switch (status) {
        case "Process":
          return "badge badge-info";
        case "Finish":
          return "badge badge-success";
        default:
          return "badge badge-warning";
      }
    },
    async getDetail() {
      this.loading = true;
      this.detailReserv = await this.$axios
        .get("/reservation/" + this.id)
        .then(({ data }) => {
          return data.data;
        })
        .catch(({ response }) => {
          this.catchError(response);
        });
      console.log(this.detailReserv);
      this.loading = false;
    },
    onItemTap(event) {
      console.log("item tapped", event.item);
    },
    onChange(args) {
      // console.log("args", args);
      console.log(
        `Drop Down selected index changed from ${args.oldIndex} to ${args.newIndex}`
      );
      this.form.vehicle_id = this.vehicles.getValue(args.newIndex);
      // console.log(this.form.vehicle_id);
      //   if (args.newIndex == 1) {
      //     this.form.gender = "F";
      //   } else {
      //     this.form.gender = "M";
      //   }
    },
    onDateChange(args) {
      console.log("onDateChange", args.value);
      this.form.reservation_date = this.moment(args.value).format("YYYY-MM-DD");
    },
    onTimeChange(args) {
      console.log("onTimeChange", args.value);
      this.form.reservation_time = this.moment(args.value).format("HH:mm");
    },
    makeReservation() {
      this.form.customer_id = this.user.id;
      this.form.products = this.detailReserv.products;
      console.log(this.form);

      if (!this.form.vehicle_id) {
        alert({
          title: "Info",
          message: "Mohon pilih kendaraan terlebih dahulu!",
          okButtonText: "OK",
        });
        return;
      }

      if (!this.form.vehicle_complaint) {
        alert({
          title: "Info",
          message: "Mohon isi keluhan kendaraan terlebih dahulu!",
          okButtonText: "OK",
        });
        return;
      }

      if (!this.form.reservation_date) {
        alert({
          title: "Info",
          message: "Mohon pilih tanggal reservasi terlebih dahulu!",
          okButtonText: "OK",
        });
        return;
      }

      if (!this.form.reservation_time) {
        alert({
          title: "Info",
          message: "Mohon pilih jam reservasi terlebih dahulu!",
          okButtonText: "OK",
        });
        return;
      }

      this.loading = true;
      this.$axios
        .post("reservation", this.form)
        .then(({ data }) => {
          console.log("data", data);
          if (data && data.success) {
            alert({
              title: "Sukses",
              message: data.message,
              okButtonText: "OK",
            });
            return;
          }
          // this.$navigator.navigate("/history", { props: { id: data.data.id }});
          this.$navigator.navigate("/reservations");
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.catchError(error);
        });
    },
    confirmAttend(id, status) {
      const token = this.$appSettings.getString("token");
      if (status == "Present") {
        confirm({
          title: "Konfirmasi Akan Datang",
          message: "Apakah Anda Yakin?",
          okButtonText: "Ya",
          cancelButtonText: "Kembali",
        }).then((result) => {
          if (result) {
            let dataUpdate = {
              attendance_confirmation: "Present",
            };
            this.$axios
              .put("/reservation/" + id, dataUpdate, {
                headers: {
                  Authorization: "Bearer " + token,
                  "Content-type": "application/json",
                },
              })
              .then(({ data }) => {
                console.log(data);
                if (data && data.success) {
                  this.detailReserv.attendance_confirmation = "Present";
                  alert({
                    title: "Sukses",
                    message: "Konfirmasi berhasil dikirimkan!",
                    okButtonText: "OK",
                  });
                }
              })
              .catch((error) => {
                console.log(error);
                this.catchError(error);
                //   if (error.response.status == 401) {
                //     this.$store.commit("clearAuth", {});
                //     this.$appSettings.setString("token", null);
                //     this.$navigator.navigate("/login", { clearHistory: true });
                //   }
              });
          }
        });
      } else {
        prompt({
          title: "Konfirmasi Tidak Datang",
          message: "Apakah Anda Yakin? Mohon tuliskan alasan Anda:",
          okButtonText: "Konfirmasi",
          cancelButtonText: "Kembali",
          defaultText: "",
        }).then((result) => {
          console.log(`Dialog result: ${result.result}, text: ${result.text}`);
          if (result.result) {
            let dataUpdate = {
              attendance_confirmation: "Not Present",
              attendance_message: result.text,
            };
            this.$axios
              .put("/reservation/" + id, dataUpdate, {
                headers: {
                  Authorization: "Bearer " + token,
                  "Content-type": "application/json",
                },
              })
              .then(({ data }) => {
                console.log(data);
                if (data && data.success) {
                  this.detailReserv.attendance_confirmation = "Not Present";
                  alert({
                    title: "Sukses",
                    message: "Konfirmasi berhasil dikirimkan!",
                    okButtonText: "OK",
                  });
                }
              })
              .catch((error) => {
                console.log(error);
                this.catchError(error);
                //   if (error.response.status == 401) {
                //     this.$store.commit("clearAuth", {});
                //     this.$appSettings.setString("token", null);
                //     this.$navigator.navigate("/login", { clearHistory: true });
                //   }
              });
          }
        });
      }
    },
  },
};
</script>