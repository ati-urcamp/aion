<script>
  import AuthApiService from '../../services/domains/Auth'

  import bus from '../../../utils/bus'
  import { mapActions, mapGetters } from 'vuex'

  // Services
  const authService = AuthApiService.build({})

  export default {
    name: 'app-header',
    data () {
      return {}
    },
    computed: {
      ...mapGetters(['currentUser', 'isLogged', 'showSidebar', 'pageTitle']),
      userFullName: function () {
        return this.currentUser.name
      },
      firstName: function () {
        const name = (this.userFullName.indexOf(' ') !== -1 ? (this.userFullName.split(' ')[0] || '') : this.userFullName).toLowerCase()
        return name.charAt(0).toUpperCase() + name.slice(1)
      },
      initials: function () {
        if (this.userFullName.indexOf(' ') !== -1) {
          const name = this.userFullName.split(' ')
          return name[0].charAt(0).toUpperCase() + (name[name.length - 1].charAt(0).toUpperCase() || '')
        }
        return this.userFullName.charAt(0).toUpperCase()
      },
      avatar: function () {
        return this.currentUser.avatar
      }
    },
    methods: {
      ...mapActions(['toggleSidebar', 'logout']),
      async onLogout () {
        bus.$emit('show-loader')
        await authService.logout()
        await this.logout()
        this.$router.push({ name: 'login' })
      }
    }
  }
</script>

<template>
    <v-toolbar class="header-toolbar-color" app clipped-left fixed>
        <v-toolbar-side-icon @click="toggleSidebar(!showSidebar)"
                             class="white--text"/>
        <v-spacer class="hidden-sm-and-up"></v-spacer>
        <div class="title ml-3 mr-5 hidden-xs-only">
            <router-link :to="{name: 'home'}" class="header-logo">
                <img src="https://www.urcamp.edu.br/site/img/logos/logo-branco.png" alt="">
            </router-link>
        </div>
        <v-toolbar-title class="hidden-sm-and-up white--text">{{pageTitle}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn flat
                   style="color:#FFF !important"
                   disabled
                   v-if="$vuetify.breakpoint.smAndUp">
                {{firstName}}
            </v-btn>
            <v-menu offset-y :open-on-hover="true">
                <v-btn icon slot="activator"
                       class="user-avatar"
                       :title="userFullName">
                    <v-avatar size="38px" v-if="avatar">
                        <img :src="avatar">
                    </v-avatar>
                    <span class="white--text title"
                          v-if="!avatar">{{initials}}</span>
                </v-btn>
                <v-list>
                    <v-list-tile @click="onLogout">
                        <v-list-tile-title>Sair</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar-items>
    </v-toolbar>
</template>

<style src="../../../assets/sass/header.scss" lang="scss"></style>
