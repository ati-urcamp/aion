<script>
  import AppPageHeader from '../../../components/main/PageHeader.vue'
  import AppCard from '../../../components/common/Card.vue'
  import FormSaveActions from '../../../components/form/FormActions.vue'

  import ProjetoSituacaoApiService from '../../../services/domains/ProjetoSituacao'
  import * as notifyService from '../../../services/common/notify'
  import bus from '../../../../utils/bus'
  import helpers from '../../../../mixins/helper'

  import { required } from 'vuelidate/lib/validators'
  import { clone } from 'lodash'

  // Services
  const projetoSituacaoService = new ProjetoSituacaoApiService()

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
          descricao: '',
          ordem: ''
        },
        dependencies: {}
      }
    },
    validations: {
      form: {
        nome: { required },
        ordem: { required }
      }
    },
    async mounted () {
      const id = this.$route.params.id || null
      await this.loadItem(id)
      bus.$emit('hide-loader')
    },
    methods: {
      async loadItem (id) {
        if (id) {
          this.isEdit = true
          projetoSituacaoService.get({ id: id })
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
        projetoSituacaoService.save({ data: data })
          .then(() => {
            notifyService.success({ hideLoader: true })
            this.isSubmitted = false
            this.$router.push({ name: 'projeto-situacao.index' })
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
                                <v-textarea v-model="form.descricao"
                                            label="Descrição"></v-textarea>
                            </v-flex>
                            <v-flex xs12 class="pa-0">
                                <v-flex xs12 md6>
                                    <v-text-field v-model="form.ordem"
                                                  :error-messages="validationMessageField($v.form.ordem)"
                                                  label="Ordem"
                                                  mask="##########"></v-text-field>
                                </v-flex>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-form>
            </template>
        </app-card>

        <form-save-actions :event-click="onSave"
                           :is-disabled="isSubmitted"
                           :is-submitted="isSubmitted"
                           route-back-name="projeto-situacao.index"/>

    </div>
</template>
