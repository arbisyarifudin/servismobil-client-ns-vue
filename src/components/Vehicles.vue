<template>
  <Page actionBarHidden="true">
    <!-- <ActionBar title="Dashboard"></ActionBar> -->
    <StackLayout>
      <StackLayout class="page-header bg-main">
        <Label text="Kendaraan Saya" class="page-title"></Label>
        <Label
          text="Daftar kendaraan yang anda daftarkan ke sistem"
          class="page-subtitle"
          textWrap="true"
        ></Label>
      </StackLayout>
      <ScrollView>
        <StackLayout
          class="page-body"
          v-if="!loading && listVehicles && listVehicles.length < 1"
        >
          <Label
            text="Data masih kosong. Anda menambahkan kendaraan."
            textWrap="true"
            horizontalAlignment="center"
            paddingLeft="10"
            paddingRight="10"
            paddingTop="20"
            paddingBottom="20"
          />
          <Button class="btn-main" @tap="$navigator.navigate('/vehicle-add')">
            <FormattedString>
              <FIcon name="fa-plus" class="mr-2" />
              <Span text=" " />
              <Span text=" " />
              <Span text="Tambah Kendaraan" />
            </FormattedString>
          </Button>
        </StackLayout>
        <StackLayout class="page-body" v-else>
          <!-- <ListView
          class="list-view"
          for="item in listVehicles"
          @itemTap="onItemTap"
          height="100%"
        >
          <v-template> -->
          <StackLayout
            class="list-view"
            v-for="(item, i) in listVehicles"
            :key="item.id"
          >
            <FlexboxLayout
              class="list-item package-item"
              alignItems="center"
              style="width: 100%"
            >
              <FIcon name="fa-car" size="30" class="fas text-main mr-2" />
              <StackLayout class="pl-1" style="width: 70%">
                <FlexboxLayout
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Label
                    :text="item.brand + ' - ' + item.name"
                    class="package-item--name"
                    textWrap="true"
                  />
                  <FlexboxLayout flexDirection="">
                    <Label
                      textWrap="true"
                      class="mr-2 btn btn-sm"
                      @tap="
                        $navigator.navigate('/vehicle-edit', {
                          props: { id: item.id },
                        })
                      "
                    >
                      <FormattedString>
                        <FIcon name="fa-edit" size="20" class="fas text-main" />
                      </FormattedString>
                    </Label>
                    <Label
                      textWrap="true"
                      class="btn btn-sm"
                      @tap="deleteItem(item.id, i)"
                    >
                      <FormattedString>
                        <FIcon
                          name="fa-times"
                          size="20"
                          class="fas text-main"
                        />
                      </FormattedString>
                    </Label>
                  </FlexboxLayout>
                </FlexboxLayout>
                <Label
                  v-if="item.year"
                  :text="'Tahun: ' + item.year"
                  class="package-item--about"
                  textWrap="true"
                />
                <Label
                  :text="'No. Plat: ' + item.plate_number"
                  class="package-item--about"
                  textWrap="true"
                />
                <Label
                  v-if="item.chassis_number"
                  :text="'No. Rangka: ' + item.chassis_number"
                  class="package-item--about"
                  textWrap="true"
                />
              </StackLayout>
            </FlexboxLayout>
          </StackLayout>
          <Button
            v-if="listVehicles && listVehicles.length > 0"
            class="btn-main mt-1"
            @tap="$navigator.navigate('/vehicle-add')"
          >
            <FormattedString>
              <FIcon name="fa-plus" class="fas mr-2" />
              <Span text=" " />
              <Span text=" " />
              <Span text="Tambah" />
            </FormattedString>
          </Button>
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
      listVehicles: [],
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
      this.listVehicles = await this.$axios
        .get("/vehicle/mine", {
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
      // console.log(this.listVehicles);
      this.loading = false;
    },
    onItemTap(item) {
      // console.log("item tapped", item.name);
      this.$navigator.navigate("/reservation", { props: { id: item.id } });
    },
    deleteItem(id, index) {
      confirm({
        title: "Hapus Kendaraan",
        message:
          "Apakah Anda yakin ingin menghapus kendaraan ini? Apabila kendaraan sudah terdaftar pada data reservasi & servis, maka data tidak dapat dihapus.",
        okButtonText: "Hapus",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result) {
          const token = this.$appSettings.getString("token");
          this.$axios
            .delete("/vehicle/" + id, {
              headers: {
                Authorization: "Bearer " + token,
                "Content-type": "application/json",
              },
            })
            .then(({ data }) => {
              console.log(data);
              if (data && data.success) {
                this.listVehicles.splice(index, 1);
                alert({
                  title: "Sukses",
                  message: data.message,
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
    },
  },
};
</script>