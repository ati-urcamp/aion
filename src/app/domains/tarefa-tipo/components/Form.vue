<script>
  import AppPageHeader from '../../../components/main/PageHeader.vue'
  import AppCard from '../../../components/common/Card.vue'
  import FormSaveActions from '../../../components/form/FormActions.vue'

  import TarefaTipoApiService from '../../../services/domains/TarefaTipo'
  import * as notifyService from '../../../services/common/notify'
  import bus from '../../../../utils/bus'
  import helpers from '../../../../mixins/helper'

  import { required } from 'vuelidate/lib/validators'
  import { clone } from 'lodash'
  import Swatches from 'vue-swatches'
  // Import the styles too, globally
  import 'vue-swatches/dist/vue-swatches.min.css'

  // Services
  const tarefaTipoService = new TarefaTipoApiService()

  export default {
    components: { AppPageHeader, AppCard, FormSaveActions, Swatches },
    mixins: [helpers],
    data () {
      return {
        isEdit: false,
        isSubmitted: false,
        isLoadingData: true,
        form: {
          nome: '',
          descricao: '',
          esforco_padrao: '',
          cor: ''
        },
        dependencies: {}
      }
    },
    validations: {
      form: {
        nome: { required },
        esforco_padrao: { required }
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
          tarefaTipoService.get({ id: id })
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
        tarefaTipoService.save({ data: data })
          .then(() => {
            notifyService.success({ hideLoader: true })
            this.isSubmitted = false
            this.$router.push({ name: 'tarefa-tipo.index' })
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
                <v-form :model="form" @submit.prevent>
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
                                    <v-text-field v-model="form.esforco_padrao"
                                                  :error-messages="validationMessageField($v.form.esforco_padrao)"
                                                  label="Esforço padrão"
                                                  mask="##########"></v-text-field>
                                </v-flex>
                            </v-flex>
                            <v-flex xs12 class="pa-0">
                                <v-flex xs12>
                                    <div class="v-swatches-form-group">
                                        <div class="v-swatches-form-label">Cor:</div>
                                        <div class="v-swatches-form-input">
                                            <swatches v-model="form.cor"
                                                      show-border
                                                      show-fallback
                                                      fallbackOkText="Selecionar"
                                                      colors="material-dark"
                                                      row-length="6"></swatches>
                                        </div>
                                    </div>
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
                           route-back-name="tarefa-tipo.index"/>

    </div>
</template>
