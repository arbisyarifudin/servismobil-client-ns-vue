<template>
  <Page actionBarHidden="true">
    <!-- <ActionBar title="Dashboard"></ActionBar> -->
    <StackLayout>
      <StackLayout class="page-header bg-main">
        <Label text="Paket Layanan" class="page-title"></Label>
        <Label
          text="Paket layanan servis yang bisa anda pilih"
          class="page-subtitle"
          textWrap="true"
        ></Label>
      </StackLayout>
      <ScrollView>
        <StackLayout class="page-body">
          <!-- <ListView
          class="list-view"
          for="item in listPackages"
          @itemTap="onItemTap"
          height="100%"
        >
          <v-template> -->
          <StackLayout
            class="list-view"
            v-for="item in listPackages"
            :key="item.id"
            @tap="onItemTap(item)"
          >
            <FlexboxLayout class="list-item package-item" alignItems="center">
              <FIcon name="fa-tools" size="30" class="fas text-main mr-1" />
              <StackLayout class="pl-1">
                <Label
                  :text="item.name"
                  class="package-item--name"
                  textWrap="true"
                />
                <Label
                  :text="item.about.substr(0, 50) + '...'"
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
      listPackages: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      this.listPackages = await this.$axios
        .get("/package")
        .then(({ data }) => {
          return data.data;
        })
        .catch((error) => {
          this.catchError(error);
        });
      this.loading = false;
    },
    onItemTap(item) {
      console.log("item tapped", item.name);
      this.$navigator.navigate("/service", { props: { id: item.id } });
    },
  },
};
</script>