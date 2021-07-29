<template>
  <Page actionBarHidden="true">
    <!-- <ActionBar title="Dashboard"></ActionBar> -->
    <StackLayout>
      <StackLayout class="page-header bg-main">
        <Label text="Reservasi Saya" class="page-title"></Label>
        <Label
          text="Daftar reservasi yang anda buat"
          class="page-subtitle"
          textWrap="true"
        ></Label>
      </StackLayout>
      <ScrollView>
        <StackLayout
          class="page-body"
          v-if="!loading && listReservations && listReservations.length < 1"
        >
          <Label
            text="Data masih kosong. Anda belum pernah melakukan reservasi."
            textWrap="true"
            horizontalAlignment="center"
            paddingLeft="10"
            paddingRight="10"
            paddingTop="20"
            paddingBottom="20"
          />
        </StackLayout>
        <StackLayout class="page-body" v-else>
          <!-- <ListView
          class="list-view"
          for="item in listReservations"
          @itemTap="onItemTap"
          height="100%"
        >
          <v-template> -->
          <StackLayout
            class="list-view"
            v-for="item in listReservations"
            :key="item.id"
            @tap="onItemTap(item)"
          >
            <FlexboxLayout
              class="list-item package-item"
              alignItems="center"
              style="width: 100%"
            >
              <FIcon name="fa-tools" size="30" class="fas text-main mr-2" />
              <StackLayout class="pl-1" style="width: 70%">
                <FlexboxLayout
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Label
                    :text="item.package.name"
                    class="package-item--name"
                    textWrap="true"
                  />
                  <Label
                    :text="'Rp ' + toRupiah(item.package_price)"
                    class="package-item--name"
                    textWrap="true"
                  />
                </FlexboxLayout>
                <FlexboxLayout
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Label
                    :text="item.vehicle.brand + ' ' + item.vehicle.name"
                    class="package-item--name"
                    textWrap="true"
                  />
                  <!-- <Label textWrap="true" class="reservation-status">
                  <FormattedString>
                    <Span text="Status: "></Span>
                    
                  </FormattedString>
                </Label> -->
                  <Label
                    textWrap="true"
                    :text="item.service.status"
                    :class="['badge', badgeColor(item.service.status)]"
                  ></Label>
                </FlexboxLayout>
                <Label
                  :text="'Nopol: ' + item.vehicle.plate_number"
                  class="package-item--about"
                  textWrap="true"
                />
                <Label
                  v-if="
                    item.vehicle_complaint &&
                    item.vehicle_complaint.length >= 20
                  "
                  :text="
                    'Keluhan: ' +
                    item.vehicle_complaint.substr(0, 20) +
                    ' [...]'
                  "
                  class="package-item--about"
                  textWrap="true"
                />
                <Label
                  v-else
                  :text="'Keluhan: ' + item.vehicle_complaint"
                  class="package-item--about"
                  textWrap="true"
                />
                <Label
                  :text="
                    'Tanggal: ' + moment(item.created_at).format('DD/MM/YYYY')
                  "
                  class="package-item--about"
                  textWrap="true"
                />
                <Label
                  fontWeight="500"
                  :text="
                    'Jadwal : ' +
                    moment(item.reservation_date).format('DD/MM/YYYY') +
                    ' ' +
                    moment(
                      item.reservation_date + ' ' + item.reservation_time
                    ).format('HH:mm')
                  "
                  class="package-item--about"
                  textWrap="true"
                />
              </StackLayout>
            </FlexboxLayout>
          </StackLayout>
          <!-- </v-template>
        </ListView> -->
        </StackLayout>
      </ScrollView>
    </StackLayout>
  </Page>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      listReservations: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
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
    async getList() {
      const token = this.$appSettings.getString("token");
      // console.log(token);
      this.loading = true;
      this.listReservations = await this.$axios
        .get("/reservation/mine", {
          headers: {
            Authorization: "Bearer " + token,
            "Content-type": "application/json",
          },
        })
        .then(({ data }) => {
          // console.log(data);
          return data.data;
        })
        .catch((error) => {
          console.log(error);
          this.catchError(error);
          if (error.response.status == 401) {
            this.$store.commit("clearAuth", {});
            this.$appSettings.setString("token", null);
            this.$navigator.navigate("/login", { clearHistory: true });
          }
        });
      // console.log(this.listReservations);
      this.loading = false;
    },
    onItemTap(item) {
      // console.log("item tapped", item.name);
      this.$navigator.navigate("/reservation", { props: { id: item.id } });
    },
  },
};
</script>