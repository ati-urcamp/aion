<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'app-notification',
    data () {
      return {
        showSnackbar: false,
        title: 'Sucesso',
        message: '',
        type: 'success',
        timeout: 2000
      }
    },
    computed: {
      ...mapGetters(['notification'])
    },
    watch: {
      notification: function (newValue) {
        this.title = newValue.title || 'Sucesso!'
        this.message = newValue.message || ''
        this.type = newValue.type || 'success'
        this.timeout = (newValue.timeout === 0 ? 0 : (newValue.timeout || 2000))
        this.showSnackbar = true
      }
    },
    methods: {
      ...mapActions(['showNotification'])
    }
  }
</script>

<template>
    <v-snackbar v-model="showSnackbar"
                class="notification-alert"
                :color="type"
                :right="true"
                :top="true"
                :multi-line="true"
                :timeout="timeout">
        <div>
            <div class="notification-alert-title" v-if="title">{{ title }}</div>
            <div class="notification-alert-message" v-if="message">{{ message }}</div>
        </div>
        <v-btn dark
               flat
               @click="showSnackbar = false">
            <i class="fas fa-times"></i>
        </v-btn>
    </v-snackbar>
</template>

<style lang="scss">
    .notification-alert {
        .notification-alert-title {
            font-size: 15px;
            font-weight: 500;
            padding-bottom: 8px;
            color: rgba(255, 255, 255, .8);
        }

        .notification-alert-title,
        .notification-alert-message {
            display: block;
        }
    }
</style>
