<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'
  import AppCard from '../../../../app/components/common/Card.vue'
  import FormSaveActions from '../../../../app/components/form/FormActions.vue'

  import EquipeApiService from '../../../services/domains/Equipe'
  import PessoaApiService from '../../../services/domains/Pessoa'
  import DataService from '../../../services/common/data'
  import * as notifyService from '../../../services/common/notify'
  import bus from '../../../../utils/bus'
  import helpers from '../../../../mixins/helper'

  import { email, required } from 'vuelidate/lib/validators'
  import { clone, debounce, isNaN } from 'lodash'

  // Services
  const equipeService = new EquipeApiService()
  const pessoaService = new PessoaApiService()

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
          encarregado: ''
        },
        dependencies: {
          equipes: []
        }
      }
    },
    validations: {
      form: {
        nome: { required },
        email: { email },
        encarregado: { required }
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
        return new Promise(resolve => {
          DataService.get([{ domain: 'equipe' }]).then(result => {
            this.dependencies = { ...this.dependencies, ...result }
            resolve()
          })
        })
      },
      async loadItem (id) {
        if (id) {
          this.isEdit = true
          equipeService.get({ id: id })
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
        equipeService.save({ data: data })
          .then(() => {
            notifyService.success({ hideLoader: true })
            this.isSubmitted = false
            this.$router.push({ name: 'equipe.index' })
          })
          .catch(e => {
            console.log(e)
            this.isSubmitted = false
            bus.$emit('hide-loader')
          })
      },
      filtrarEquipe (item, queryText, itemText) {
        return item.arvore_humanizada.toLowerCase().indexOf(queryText.toString().toLowerCase()) > -1
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
                            <v-flex xs12>
                                <v-text-field v-model="form.email"
                                              :error-messages="validationMessageField($v.form.email, ['email'])"
                                              label="E-mail"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                              <v-text-field v-model="form.encarregado"
                                            :error-messages="validationMessageField($v.form.encarregado)"
                                            label="Encarregado"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-autocomplete v-model="form.ref_equipe"
                                                :items="dependencies.equipes"
                                                :filter="filtrarEquipe"
                                                item-text="arvore_humanizada"
                                                item-value="id"
                                                label="Equipe pai"
                                                hide-no-data
                                                clearable></v-autocomplete>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-form>
            </template>
        </app-card>

        <form-save-actions :event-click="onSave"
                           :is-disabled="isSubmitted"
                           :is-submitted="isSubmitted"
                           route-back-name="equipe.index"/>

    </div>
</template>
