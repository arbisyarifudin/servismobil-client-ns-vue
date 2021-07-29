<template>
  <Page actionBarHidden="true">
    <ActionBar title="Dashboard"></ActionBar>
    <GridLayout rows="*,50" columns="*">
      <StackLayout row="0" col="1">
        <StackLayout class="page-header bg-main">
          <Label text="Dashboard" class="page-title"></Label>
          <Label
            :text="`Selamat datang, ${user.name}!`"
            class="page-subtitle"
          ></Label>
        </StackLayout>
        <StackLayout class="page-body">
          <GridLayout columns="*, *" rows="150, 150" class="card-group">
            <FlexboxLayout
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              row="0"
              col="0"
              class="card"
              @tap="$navigator.navigate('/services')"
            >
              <FIcon name="fa-tools" size="30" class="fas text-main mb-1" />
              <Label text="Layanan" class="card-title"></Label>
            </FlexboxLayout>
            <FlexboxLayout
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              row="0"
              col="1"
              class="card"
              @tap="$navigator.navigate('/reservations')"
            >
              <FIcon name="fa-history" size="30" class="fas text-main mb-1" />
              <Label text="Riwayat" class="card-title"></Label>
            </FlexboxLayout>
            <FlexboxLayout
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              row="1"
              col="0"
              class="card"
              @tap="$navigator.navigate('/vehicles')"
            >
              <FIcon name="fa-car" size="30" class="fas text-main mb-1" />
              <Label text="Kendaraan" class="card-title"></Label>
            </FlexboxLayout>
            <FlexboxLayout
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              row="1"
              col="1"
              class="card"
              @tap="$navigator.navigate('/account')"
            >
              <FIcon name="fa-user" size="30" class="fas text-main mb-1" />
              <Label text="Akun" class="card-title"></Label>
            </FlexboxLayout>
          </GridLayout>
        </StackLayout>
        <Button
          text="Logout"
          @tap="doLogout"
          class="btn-main"
          :isEnabled="!loading"
        >
          <FormattedString>
            <!-- <FIcon name="fa-spinner" class="fas fa-spinner mr-2" />
            <Span text=" " />
            <Span text=" " /> -->
            <Span :text="loading ? 'Memproses...' : 'Keluar'" />
          </FormattedString>
        </Button>
      </StackLayout>
      <StackLayout row="1" col="0">
        <!-- <Label
          class="login-text--bottom"
          horizontalAlignment="center"
          paddingLeft="10"
          paddingRight="10"
          paddingTop="5"
          paddingBottom="5"
        >
          <FormattedString>
            <Span text="Environment: " />
            <Span :text="env" fontWeight="bold" />
          </FormattedString>
        </Label> -->
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script >
export default {
  data() {
    return {
      loading: false,
      env: TNS_ENV,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    if (this.$navigator.route.meta.needsAuth) {
      console.log("need auth");
    }
  },
  methods: {
    async doLogout() {
      const token = this.$appSettings.getString("token");
      // const user = {};
      this.loading = true;
      await this.$axios
        .post(
          "customer/logout",
          {},
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .catch((err) => console.log(err));
      this.$store.commit("clearAuth", null);
      this.$appSettings.setString("token", "");
      this.$navigator.navigate("/login", { clearHistory: true });
    },
  },
};
</script>

<style scoped>
</style>