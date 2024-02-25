<template>
  <q-layout view="hHh Lpr lFf" class="bg-grey-1">
    <q-header elevated class="bg-light-green text-white">
      <q-toolbar class="GNL__toolbar">
        <q-btn flat dense round to="/" icon="home" class="q-mr-sm" />
        <q-toolbar-title shrink class="row items-center no-wrap">
          <span class="q-ml-sm" v-if="user">{{ user.username }}</span>
        </q-toolbar-title>
        <q-space />
        <q-space />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-if="user" :breakpoint="drawerBreakpoint" bordered class="bg-white" :width="drawerWidth" style="min-width: 250px;">
      <q-list padding class="text-grey-8">
        <q-item class="GNL__drawer-item" clickable to="/profile/personal">
          <q-item-section avatar />
          <q-item-section>
            <q-item-label>Eseményeim</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset class="q-my-sm" />

        <q-item class="GNL__drawer-item" clickable to="/profile/settings">
          <q-item-section avatar />
          <q-item-section>
            <q-item-label>Beállítások</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset class="q-my-sm" />

        <q-item class="GNL__drawer-item" clickable to="/profile/events">
          <q-item-section avatar />
          <q-item-section>
            <q-item-label>Esemény készítés</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset class="q-my-sm" />

        <q-item class="GNL__drawer-item justify-center">
          <q-btn
            class="q-justify-center"
            label="Kijelentkezés"
            color="red"
            @click="showLogouteConfirmation()"
          />
        </q-item>
      </q-list>
    </q-drawer>

    <q-dialog v-model="logoutConfirmationVisible">
      <q-card>
        <q-card-section class="text-h6">
          Biztosan szeretne kijelentkezni?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Nem" color="grey" @click="cancelLogout()" />
          <q-space />
          <q-btn label="Igen" color="red" @click="confirmLogout()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import useAuth from "src/composables/useAuth";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      user: null,
      logoutConfirmationVisible: false,
      drawerOpen: false,
      drawerWidth: 280,
      drawerBreakpoint: 600,
      isMediumScreen: false,
    };
  },
  mounted() {
    const storedUser = Cookies.get("user");
    this.user = storedUser ? JSON.parse(storedUser) : null;

    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  methods: {
    async showLogouteConfirmation() {
      this.logoutConfirmationVisible = true;
    },
    async cancelLogout() {
      this.logoutConfirmationVisible = false;
    },
    async confirmLogout() {
      useAuth.isLoggedIn.value = false;
      Cookies.remove("token", { path: "/" });
      Cookies.remove("user", { path: "/" });
      this.user = null;
      this.$router.push("/login");
    },
    async logoutProfile() {
      this.showLogouteConfirmation();
    },
    checkScreenSize() {
      this.drawerOpen = this.$q.screen.width >= this.drawerBreakpoint;
      this.drawerWidth = this.drawerOpen ? 280 : 56;
    },
    beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  },
};
</script>
<style lang="sass">
.GNL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 55%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      .q-icon
        color: #5f6368

    .q-item__label
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000
</style>