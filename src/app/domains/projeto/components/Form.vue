<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'
  import AppCard from '../../../../app/components/common/Card.vue'
  import FormSaveActions from '../../../../app/components/form/FormActions.vue'
  import HtmlEditor from '../../../components/common/HtmlEditor'

  import ProjetoApiService from '../../../services/domains/Projeto'
  import DataService from '../../../services/common/data'
  import * as notifyService from '../../../services/common/notify'
  import bus from '../../../../utils/bus'
  import helpers from '../../../../mixins/helper'

  import { required } from 'vuelidate/lib/validators'
  import { clone } from 'lodash'

  // Services
  const projetoService = new ProjetoApiService()

  export default {
    components: { AppPageHeader, AppCard, FormSaveActions, HtmlEditor },
    mixins: [helpers],
    data () {
      return {
        isEdit: false,
        isSubmitted: false,
        isLoadingData: true,
        form: {
          nome: '',
          descricao: '',
          ref_cliente: null,
          ref_projeto_tipo: null,
          ref_projeto_situacao: null,
          ordem: ''
        },
        dependencies: {
          clientes: [],
          tipos: [],
          situacoes: []
        },
        buscandoCliente: false,
        cliente: ''
      }
    },
    validations: {
      form: {
        nome: { required },
        ref_cliente: { required },
        ref_projeto_tipo: { required },
        ref_projeto_situacao: { required },
        ordem: { required }
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
        DataService.get([{ domain: 'cliente' }, { domain: 'projeto-tipo' }, { domain: 'projeto-situacao' }]).then(result => {
          this.dependencies.clientes = result.clientes
          this.dependencies.tipos = result.tipos_projeto
          this.dependencies.situacoes = result.situacoes_projeto
        })
      },
      async loadItem (id) {
        if (id) {
          this.isEdit = true
          projetoService.get({ id: id })
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
        projetoService.save({ data: data })
          .then(() => {
            notifyService.success({ hideLoader: true })
            this.isSubmitted = false
            this.$router.push({ name: 'projeto.index' })
          })
          .catch(e => {
            console.log(e)
            this.isSubmitted = false
            bus.$emit('hide-loader')
          })
      },
      filtrarCliente (item, queryText, itemText) {
        return item.nome.toLowerCase().indexOf(queryText.toString().toLowerCase()) > -1
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
                                <html-editor :model.sync="form.descricao"></html-editor>
                            </v-flex>
                            <v-flex xs12>
                                <v-autocomplete v-model="form.ref_cliente"
                                                :items="dependencies.clientes"
                                                :error-messages="validationMessageField($v.form.ref_cliente)"
                                                :filter="filtrarCliente"
                                                item-text="nome"
                                                item-value="id"
                                                label="Cliente"
                                                hide-no-data
                                                clearable></v-autocomplete>
                            </v-flex>
                            <v-flex xs12 class="pa-0">
                                <v-flex xs12 md6>
                                    <v-select v-model="form.ref_projeto_tipo"
                                              :items="dependencies.tipos"
                                              :error-messages="validationMessageField($v.form.ref_projeto_tipo)"
                                              label="Tipo"
                                              item-text="nome"
                                              item-value="id"></v-select>
                                </v-flex>
                            </v-flex>
                            <v-flex xs12 class="pa-0">
                                <v-flex xs12 md6>
                                    <v-select v-model="form.ref_projeto_situacao"
                                              :items="dependencies.situacoes"
                                              :error-messages="validationMessageField($v.form.ref_projeto_situacao)"
                                              label="Situação"
                                              item-text="nome"
                                              item-value="id"></v-select>
                                </v-flex>
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
                           route-back-name="projeto.index"/>

    </div>
</template>
