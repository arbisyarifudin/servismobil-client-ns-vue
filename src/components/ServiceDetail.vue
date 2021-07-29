<template>
  <Page actionBarHidden="true">
    <StackLayout>
      <StackLayout class="page-header bg-main">
        <Label text="Detail Paket" class="page-title"></Label>
        <FlexboxLayout
          alignItems="center"
          justifyContent="space-between"
          class="mb-2"
        >
          <Label
            textWrap="true"
            :text="detailPackage.name"
            class="page-subtitle"
          ></Label>
          <Label
            textWrap="true"
            :text="'Rp ' + toRupiah(detailPackage.package_price)"
            class="page-subtitle text-danger"
          ></Label>
        </FlexboxLayout>
      </StackLayout>
      <ScrollView>
        <StackLayout class="page-body card">
          <Label class="h3" fontWeight="500" text="Deskripsi Paket:"></Label>
          <Label
            class="package-about--text mb-2"
            :text="detailPackage.about"
            textWrap="true"
          ></Label>
          <Label class="h3" fontWeight="500" text="Rincian Paket:"></Label>
          <!-- <ListView
            v-if="detailPackage.products"
            class="list-view mb-2"
            for="item in detailPackage.products"
            @itemTap="onItemTap"
            height="100%"
          > -->
          <!-- <v-template> -->
          <StackLayout
            class="list-view mb-2"
            v-for="item in detailPackage.products"
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
              <Image
                :src="item.picture_url"
                width="60"
                height="60"
                verticalAlignment="center"
                stretch="fill"
                class="mr-1"
              ></Image>
              <StackLayout>
                <Label
                  :text="item.name"
                  class="product-item--name"
                  textWrap="true"
                />
                <Label
                  :text="'Rp ' + toRupiah(item.price)"
                  class="product-item--price mb-1"
                  textWrap="true"
                />
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
          <!-- </v-template> -->
          <!-- </ListView> -->
          <Label class="h3" fontWeight="500" text="Reservasi Paket:"></Label>
          <StackLayout class="form-group">
            <Label class="h4" fontWeight="500" text="Tanggal Reservasi"></Label>
            <DatePickerField
              @dateChange="onDateChange"
              :minDate="moment().format('YYYY-MM-DD')"
              hint="Pilih Tanggal"
              dateFormat="dd MMMM yyyy"
              locale="id_ID"
            ></DatePickerField>
          </StackLayout>
          <!-- <DateTimePickerFields
              :minDate=""
              hintDate="Pilih Tanggal"
              hintTime="Pilih Jam"
              timeFormat="HH:mm"
              locale="id_ID"
              class="form-control"
              @dateChange="onDateTimeChange"
            ></DateTimePickerFields> -->
          <StackLayout class="form-group">
            <Label class="h4" fontWeight="500" text="Jam Reservasi"></Label>
            <TimePickerField
              @timeChange="onTimeChange"
              hint="Pilih Jam"
              timeFormat="HH:mm"
              locale="id_ID"
            ></TimePickerField>
          </StackLayout>
          <StackLayout class="form-group">
            <Label class="h4" fontWeight="500" text="Kendaraan"></Label>
            <!-- :items="
              new ValueList([
                { display: 'Laki-laki', value: 'M' },
                { display: 'Perempuan', value: 'F' },
              ])
            " -->
            <DropDown
              android
              :items="vehicles"
              selectedIndex=""
              @selectedIndexChanged="onChange"
              class="form-control"
              hint="Pilih "
            />
            <Label
              v-if="vehicles && vehicles.length < 1"
              class="text-danger smalll"
              @tap="$navigator.navigate('/vehicles')"
            >
              <FormattedString>
                <Span text="Anda belum memiliki data kendaraan. " />
                <Span text="Tambahkan" fontWeight="bold" />
              </FormattedString>
            </Label>
          </StackLayout>
          <StackLayout class="form-group">
            <Label class="h4" fontWeight="500" text="Keluhan Kendaraan"></Label>
            <TextView
              maxLength="250"
              class="form-control"
              hint="Tulis Keluhan Kendaraan"
              autocorrect="false"
              autocapitalizationType="true"
              v-model="form.vehicle_complaint"
            ></TextView>
          </StackLayout>

          <Button
            @tap="makeReservation"
            class="btn-main"
            :isEnabled="!loading && vehicles && vehicles.length > 0"
          >
            <FormattedString>
              <Span :text="loading ? 'Memproses...' : 'Buat Reservasi'" />
            </FormattedString>
          </Button>
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
      detailPackage: {},
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
      let vehicles = this.user.vehicles.map((item) => {
        return {
          display: item.brand + " - " + item.name,
          value: item.id,
        };
      });
      return new ValueList(vehicles);
    },
  },
  mounted() {
    this.getDetail();
    console.log(this.id);
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
    async getDetail() {
      this.loading = true;
      this.detailPackage = await this.$axios
        .get("/package/" + this.id)
        .then(({ data }) => {
          return data.data;
        })
        .catch(({ response }) => {
          this.catchError(response);
        });
      console.log(this.detailPackage);
      this.form.package_id = this.detailPackage.id;
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
      this.form.products = this.detailPackage.products;
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
          }
          // this.$navigator.navigate("/history", { props: { id: data.data.id }});
          this.$navigator.navigate("/reservations", { clearHistory: true });
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