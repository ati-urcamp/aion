<script>
  import AuthApiService from '../../../services/domains/Auth'

  import bus from '../../../../utils/bus'
  import helpers from '../../../../mixins/helper'
  import { mapActions, mapGetters } from 'vuex'

  import { required } from 'vuelidate/lib/validators'
  import { clone } from 'lodash'
  import swal from 'sweetalert2'

  const authService = AuthApiService.build({})

  export default {
    mixins: [helpers],
    data () {
      return {
        isSubmitted: false,
        showLoginPage: true,
        form: {
          login: '',
          password: ''
        }
      }
    },
    validations: {
      form: {
        login: { required },
        password: { required }
      }
    },
    computed: {
      ...mapGetters(['currentUser'])
    },
    mounted () {
      this.startLogin(100)
    },
    methods: {
      ...mapActions(['login']),
      startLogin (timeout) {
        timeout = timeout || 800
        setTimeout(() => {
          if (this.$refs.login) {
            this.$refs.login.focus()
          }
          bus.$emit('hide-loader')
        }, timeout)
      },
      async onLogin () {
        if (this.$v.form.$invalid) {
          swal.fire({
            title: 'Atenção',
            text: 'Preencha o login e a senha',
            type: 'warning'
          })
          return
        }

        bus.$emit('show-loader', { message: 'Estamos verificando seus dados' })
        this.isSubmitted = true
        const formData = clone(this.form)

        authService.login(formData).then(async (response) => {
          await this.login({
            user: {
              id: response.usuario.id,
              name: response.usuario.nome,
              avatar: response.usuario.avatar
            },
            token: response.token,
            permissions: response.usuario.permissoes,
            teamPermissions: response.usuario.permissoes_equipes
          })

          this.showLoginPage = false
          this.isSubmitted = false
          bus.$emit('hide-loader')
          this.$router.push({ name: 'home' })
        }).catch(() => {
          bus.$emit('hide-loader')
          this.isSubmitted = false
        })
      }
    }
  }
</script>

<template>
    <v-layout align-center
              justify-center
              class="bg-login"
              v-if="showLoginPage">
        <v-flex xs10 sm6 md3>
            <figure class="logo">
                <img src="https://www.urcamp.edu.br/site/img/logos/logo-branco.png" alt="">
            </figure>
            <v-form light>
                <div class="login-form-item">
                    <div class="icon">
                        <i class="fas fa-user"></i>
                    </div>
                    <input type="tel"
                           v-model="form.login"
                           ref="login"
                           @keyup.enter="onLogin"
                           placeholder="Matrícula">
                </div>
                <div class="login-form-item">
                    <div class="icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <input type="password"
                           v-model="form.password"
                           ref="password"
                           @keyup.enter="onLogin"
                           placeholder="Senha">
                </div>

            </v-form>
            <v-btn class="white--text btn-login"
                   large
                   block
                   :disabled="isSubmitted"
                   @click="onLogin">ENTRAR
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<style src="../../../../assets/sass/login.scss" lang="scss"></style>
