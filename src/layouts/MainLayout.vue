<script>
import { ref } from "vue";
import useAuth from "src/composables/useAuth";
import Cookies from "js-cookie";

export default {
  setup() {
    const toggleDrawer = ref(false);
    return {
      useAuth,
      toggleDrawer,
      tab: null,
    };
  },
  methods: {
    logout() {
      this.toggleDrawer = false;
      useAuth.isLoggedIn.value = false;
      Cookies.remove("token", { path: "/" });
      Cookies.remove("user", { path: "/" });
      this.user = null;
      this.$router.push("/login");
    },
  },
};
</script>

<template>
  <q-layout view="hHh Lpr lFf" class="bg-grey-1">
    <div>
      <q-header elevated class="bg-light-green text-white">
        <q-toolbar class="GNL__toolbar">
          <q-btn flat label="Főoldal" to="/" />
          <q-space />
          <q-tabs v-model="tab" shrink>
            <q-route-tab
              v-if="useAuth.isLoggedIn.value"
              label="Események"
              to="/events"
            />
            <q-route-tab
              v-if="useAuth.isLoggedIn.value"
              label="Felhasználók"
              to="/users"
            />
            <q-route-tab
              v-if="useAuth.isLoggedIn.value"
              label="Lerakók"
              to="/dumps"
            />
            <q-route-tab
              v-if="!useAuth.isLoggedIn.value"
              label="Regisztráció / Bejelentkezés"
              to="/register"
            />
            <q-route-tab v-else flat icon="person" to="/profile/personal" />
          </q-tabs>
        </q-toolbar>
      </q-header>
    </div>
    <q-page-container>
      <q-page padding>
        <router-view></router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

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
