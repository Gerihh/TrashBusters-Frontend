<script>
import { ref } from 'vue';
import useAuth from 'src/composables/useAuth';
import Cookies from 'js-cookie'

export default {
  setup() {
    const toggleDrawer = ref(false);
    return {
      useAuth,
      toggleDrawer,
    };
  },
  methods: {
    logout() {
      this.toggleDrawer = false;
      useAuth.isLoggedIn.value = false;
      Cookies.remove('token', {path: '/'});
      Cookies.remove('user', {path: '/'});
      this.user = null;
      this.$router.push('/login');
    }
  }
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
                <q-route-tab v-if="useAuth.isLoggedIn.value" label="Események" to="/events"/>
                <q-route-tab v-if="!useAuth.isLoggedIn.value" label="Regisztráció / Bejelentkezés" to="/register"/>
                <q-btn v-else flat icon="person" @click="toggleDrawer = !toggleDrawer"/>
              </q-tabs>
            </q-toolbar>
          </q-header>
      <q-drawer v-model="toggleDrawer" elevated side="right">
      <q-tabs inline-tabs vertical>
        <q-route-tab to="/profile/personal" label="Profil" @click="toggleDrawer = !toggleDrawer" />
        <q-route-tab
          href="https://vuejs.org/"
          label="Vue.JS"
          no-caps
          target="_blank"
        />
        <q-item class="justify-center">
          <q-btn label="Kijelentkezés" color="red" @click="logout"/>
        </q-item>
        </q-tabs>
      </q-drawer>
    </div>
    <q-page-container>
      <router-view></router-view>
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