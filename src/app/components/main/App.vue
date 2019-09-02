<script>
  import AppGlobalLoader from './GlobalLoader'
  import AppHeader from './AppHeader'
  import AppSidebar from './AppSidebar'
  import AppNotification from './AppNotification'

  import { mapActions, mapGetters } from 'vuex'
  import bus from '../../../utils/bus'

  const NETWORK_EVENTS = ['online', 'offline', 'load']

  export default {
    name: 'App',
    components: { AppGlobalLoader, AppHeader, AppSidebar, AppNotification },
    data () {
      return {
        loaderMessage: 'Carregando Dados',
        internetAtiva: true
      }
    },
    computed: {
      ...mapGetters(['isLogged', 'isLoading', 'currentUser'])
    },
    mounted () {
      NETWORK_EVENTS.forEach(event => window.addEventListener(event, this.conexaoInternetAlterada))
      bus.$on('show-loader', (message) => {
        message = message || null
        this.showLoader(message)
      })
      bus.$on('hide-loader', () => this.hideLoader())
      setTimeout(() => {
        this.hideLoader()
      }, 300)
    },
    methods: {
      ...mapActions(['showLoader', 'hideLoader', 'showNotification']),
      conexaoInternetAlterada () {
        let internetAtiva = navigator.onLine || false
        if (!this.internetAtiva && internetAtiva) {
          this.showNotification({
            title: 'Conexão ativa',
            message: 'Sua internet está funcionando',
            timeout: 2000
          })
        } else if (this.internetAtiva && !internetAtiva) {
          this.showNotification({
            title: 'Conexão interrompida',
            message: 'Sua internet não parece estar funcionando',
            type: 'error',
            timeout: 0
          })
        }
        this.internetAtiva = internetAtiva
      }
    },
    beforeDestroy () {
      NETWORK_EVENTS.forEach(event => window.removeEventListener(event, this.conexaoInternetAlterada))
    }
  }
</script>

<template>
    <v-app>
        <AppGlobalLoader/>
        <AppNotification/>
        <AppSidebar v-if="isLogged"/>
        <AppHeader v-if="isLogged"/>
        <v-content class="main-content" :class="{'-not-logged': !isLogged}">
            <v-container class="main-content-container"
                         fluid
                         :fill-height="!isLogged">
                <router-view></router-view>
            </v-container>
        </v-content>
    </v-app>
</template>

<style src="../../../assets/sass/app.scss" lang="scss"></style>
<style src="../../../assets/sass/responsive.scss" lang="scss"></style>
