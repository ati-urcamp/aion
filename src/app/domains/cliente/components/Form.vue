<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'
  import AppCard from '../../../../app/components/common/Card.vue'
  import FormSaveActions from '../../../../app/components/form/FormActions.vue'

  import ClienteApiService from '../../../services/domains/Cliente'
  import * as notifyService from '../../../services/common/notify'
  import bus from '../../../../utils/bus'
  import helpers from '../../../../mixins/helper'

  import { email, required } from 'vuelidate/lib/validators'
  import { clone } from 'lodash'

  // Services
  const clienteService = new ClienteApiService()

  export default {
    components: { AppPageHeader, AppCard, FormSaveActions },
    mixins: [helpers],
    data () {
      return {
        isEdit: false,
        isSubmitted: false,
        isLoadingData: true,
        form: {
          nome: '',
          email: '',
          responsavel: ''
        }
      }
    },
    validations: {
      form: {
        nome: { required },
        email: { email },
        responsavel: { required }
      }
    },
    async mounted () {
      const id = this.$route.params.id || null
      await this.getDependencies()
      await this.loadItem(id)
      bus.$emit('hide-loader')
    },
    methods: {
      async getDependencies () {
      },
      async loadItem (id) {
        if (id) {
          this.isEdit = true
          clienteService.get({ id: id })
            .then(response => {
              this.form = { ...response }
              this.isLoadingData = false
            })
            .catch(e => {
              console.log(e)
              this.isLoadingData = false
            })
        } else {
          this.isLoadingData = false
        }
      },
      onSave () {
        this.$v.$touch()

        if (this.$v.$invalid) {
          return
        }

        bus.$emit('show-loader')
        this.isSubmitted = true
        const data = clone(this.form)
        clienteService.save({ data: data })
          .then(() => {
            notifyService.success({ hideLoader: true })
            this.isSubmitted = false
            this.$router.push({ name: 'cliente.index' })
          })
          .catch(e => {
            console.log(e)
            this.isSubmitted = false
            bus.$emit('hide-loader')
          })
      }
    }
  }
</script>

<template>
    <div class="page-content">

        <app-page-header/>

        <app-card title="Dados do Cadastro" icon="fas fa-file-alt">
            <template slot="content">
                <v-form :model="form">
                    <v-container grid-list-md>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-text-field v-model="form.nome"
                                              :error-messages="validationMessageField($v.form.nome)"
                                              label="Nome"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="form.email"
                                              :error-messages="validationMessageField($v.form.email, ['email'])"
                                              label="E-mail"></v-text-field>
                            </v-flex>
                          <v-flex xs12>
                            <v-text-field v-model="form.responsavel"
                                          :error-messages="validationMessageField($v.form.responsavel)"
                                          label="Responsável"></v-text-field>
                          </v-flex>
                        </v-layout>
                    </v-container>
                </v-form>
            </template>
        </app-card>

        <form-save-actions :event-click="onSave"
                           :is-disabled="isSubmitted"
                           :is-submitted="isSubmitted"
                           route-back-name="cliente.index"/>

    </div>
</template>
