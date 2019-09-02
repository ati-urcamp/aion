<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'
  import AppCard from '../../../../app/components/common/Card.vue'
  import FormSaveActions from '../../../../app/components/form/FormActions.vue'

  import PerfilApiService from '../../../services/domains/Perfil'
  import DataService from '../../../services/common/data'
  import * as notifyService from '../../../services/common/notify'
  import bus from '../../../../utils/bus'
  import helpers from '../../../../mixins/helper'

  import { required } from 'vuelidate/lib/validators'
  import { clone } from 'lodash'

  // Services
  const perfilService = new PerfilApiService()

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
          permissoes: []
        },
        dependencies: {
          permissoes: []
        }
      }
    },
    validations: {
      form: {
        nome: { required }
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
        DataService.get([{ domain: 'permissao' }]).then(result => {
          this.dependencies = { ...result }
        })
      },
      async loadItem (id) {
        if (id) {
          this.isEdit = true
          perfilService.get({ id: id, relations: ['permissoes'] })
            .then(response => {
              this.form = { ...response }
              this.form.permissoes = response.permissoes.map((permissao) => permissao.id)
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
        perfilService.save({ data: data })
          .then(() => {
            notifyService.success({ hideLoader: true })
            this.isSubmitted = false
            this.$router.push({ name: 'perfil.index' })
          })
          .catch(e => {
            console.log(e)
            this.isSubmitted = false
            bus.$emit('hide-loader')
          })
      },
      filtrarPermissao (item, queryText, itemText) {
        return item.nome.toLowerCase().includes(queryText.toString().toLowerCase())
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
                                <v-autocomplete v-model="form.permissoes"
                                                :items="dependencies.permissoes"
                                                :filter="filtrarPermissao"
                                                item-text="nome"
                                                item-value="id"
                                                label="Permissões"
                                                hide-no-data
                                                clearable
                                                chips
                                                deletable-chips
                                                multiple
                                                hint="Selecione as permissões do perfil"
                                                persistent-hint></v-autocomplete>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-form>
            </template>
        </app-card>

        <form-save-actions :event-click="onSave"
                           :is-disabled="isSubmitted"
                           :is-submitted="isSubmitted"
                           route-back-name="perfil.index"/>

    </div>
</template>
