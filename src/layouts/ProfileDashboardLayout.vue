<template>
  <q-layout view="hHh Lpr lFf" class="bg-grey-1">
    <q-header elevated class="bg-light-green text-white">
      <q-toolbar class="GNL__toolbar">
        <q-btn
          flat
          dense
          round
          to="/"
          icon="home"
          class="q-mr-sm"
        />
        <q-toolbar-title shrink class="row items-center no-wrap">
          <span class="q-ml-sm" v-if="user">{{ user.username }}</span>
        </q-toolbar-title>
        <q-space />
        <q-space />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      bordered
      class="bg-white"
      :width="280"
    >

        <q-list padding class="text-grey-8">
          <q-item class="GNL__drawer-item" clickable to="/profile/personal">
            <q-item-section avatar/>
            <q-item-section>
              <q-item-label>Személyes adatok</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator inset class="q-my-sm" />

          <q-item class="GNL__drawer-item" clickable to="/">
            <q-item-section avatar/>
            <q-item-section>
              <q-item-label>Beállítások</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator inset class="q-my-sm" />

          <q-item class="GNL__drawer-item" clickable to="/profile/events">
            <q-item-section avatar/>
            <q-item-section>
              <q-item-label>Események</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator inset class="q-my-sm" />

          <q-item class="GNL__drawer-item justify-center">
            <q-btn class="q-justify-center" label="Kijelentkezés" color="red" @click="logout"/>
          </q-item>
        </q-list>
    </q-drawer>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import useAuth from 'src/composables/useAuth';
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      user: null,
    };
  },
  mounted() {
    const storedUser = Cookies.get('user')
    this.user = storedUser ? JSON.parse(storedUser) : null;
  },
  methods: {
    logout() {
      useAuth.isLoggedIn.value = false;
      Cookies.remove('token', {path: '/'});
      Cookies.remove('user', {path: '/'});
      this.user = null;
      this.$router.push('/login');
    }
  }
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