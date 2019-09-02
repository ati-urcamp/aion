<script>
  import HtmlEditor from '../../../components/common/HtmlEditor'

  import TarefaApiService from '../../../services/domains/Tarefa'
  import DataService from '../../../services/common/data'
  import * as notifyService from '../../../services/common/notify'
  import bus from '../../../../utils/bus'
  import helpers from '../../../../mixins/helper'

  import { required, requiredIf } from 'vuelidate/lib/validators'
  import { clone } from 'lodash'

  // Services
  const tarefaService = new TarefaApiService()

  export default {
    components: { HtmlEditor },
    mixins: [helpers],
    props: {
      tarefa: {
        default: 0,
        type: Number
      },
      submitted: {
        default: false,
        type: Boolean
      },
      closeEditModal: {
        type: Function
      }
    },
    watch: {
      isSubmitted: {
        handler: async function () {
          this.$emit('update:submitted', this.isSubmitted)
        },
        immediate: true
      }
    },
    data () {
      return {
        isEdit: false,
        isSubmitted: false,
        isLoadingData: true,
        form: {
          titulo: '',
          descricao: '',
          tags: null,
          ref_tarefa_tipo: null,
          ref_tarefa_situacao: null,
          ref_projeto: null,
          esforco_estimado: '',
          dt_desejada: null,
          equipes: [],
          usuarios: [],
          ordem: ''
        },
        dependencies: {
          tipos: [],
          situacoes: [],
          projetos: [],
          equipes: [],
          usuarios: []
        },
        abrirDatepickerDtDesejada: false
      }
    },
    validations: {
      form: {
        titulo: { required },
        ref_tarefa_tipo: { required },
        ref_tarefa_situacao: { required },
        ref_projeto: { required },
        esforco_estimado: { required },
        dt_desejada: { required },
        equipes: {
          required: requiredIf(function () {
            return !this.form.usuarios.length
          })
        },
        usuarios: {
          required: requiredIf(function () {
            return !this.form.equipes.length
          })
        },
        ordem: { required }
      }
    },
    computed: {
      dt_desejada_formatada () {
        return this.form.dt_desejada ? this.dateFormat(this.form.dt_desejada, 'br') : ''
      }
    },
    async mounted () {
      await this.getDependencies()
      await this.loadItem(this.tarefa)
      bus.$emit('hide-loader')
    },
    methods: {
      async getDependencies () {
        return new Promise(resolve => {
          DataService.get([
            { domain: 'tarefa-tipo' },
            { domain: 'tarefa-situacao' },
            { domain: 'projeto' },
            { domain: 'equipe-usuario' },
            { domain: 'usuario' }
          ]).then(result => {
            this.dependencies.tipos = result.tipos_tarefa
            this.dependencies.situacoes = result.situacoes_tarefa
            this.dependencies.projetos = result.projetos
            this.dependencies.equipes = result.equipes
            this.dependencies.usuarios = result.usuarios
            resolve()
          })
        })
      },
      async loadItem (id) {
        return new Promise((resolve, reject) => {
          if (id) {
            tarefaService.get({ id: id, relations: ['equipes', 'usuarios'] })
              .then(response => {
                this.form = { ...response }
                this.form.equipes = response.equipes.map((equipe) => equipe.id)
                this.form.usuarios = response.usuarios.map((usuario) => usuario.id)
                this.isLoadingData = false

                resolve()
              })
              .catch(e => {
                console.log(e)
                this.isLoadingData = false
                reject(e)
              })
          } else {
            this.isLoadingData = false
            resolve()
          }
        })
      },
      onSave () {
        this.$v.$touch()

        if (this.$v.$invalid) {
          return
        }

        bus.$emit('show-loader')
        this.isSubmitted = true
        const data = clone(this.form)
        tarefaService.save({ data: data })
          .then(() => {
            notifyService.success({ hideLoader: true })
            this.isSubmitted = false

            if (typeof this.closeEditModal !== 'undefined') {
              this.closeEditModal()
            } else {
              this.$router.push({ name: 'tarefa.index' })
            }
          })
          .catch(e => {
            console.log(e)
            this.isSubmitted = false
            bus.$emit('hide-loader')
          })
      },
      filtrarProjeto (item, queryText, itemText) {
        return item.nome.toLowerCase().indexOf(queryText.toString().toLowerCase()) > -1
      },
      extraiEsforcoPadrao (tipo) {
        tipo = this.dependencies.tipos.find((item) => item.id === tipo)

        if (!this.form.esforco_estimado.toString().length) {
          this.form.esforco_estimado = tipo.esforco_padrao
        }
      },
      filtrarEquipe (item, queryText, itemText) {
        return item.arvore_humanizada.toLowerCase().includes(queryText.toString().toLowerCase())
      },
      filtrarUsuario (item, queryText, itemText) {
        return item.nome.toLowerCase().includes(queryText.toString().toLowerCase())
      }
    }
  }
</script>

<template>
    <v-form :model="form" v-if="!isLoadingData">
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-text-field v-model="form.titulo"
                                  :error-messages="validationMessageField($v.form.titulo)"
                                  label="Nome"></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <html-editor :model.sync="form.descricao"></html-editor>
                </v-flex>
                <v-flex xs12>
                    <v-combobox
                            v-model="form.tags"
                            label="Tags"
                            multiple
                            tags
                            chips
                            deletable-chips
                            hint="Pressione enter para criar uma nova tag"
                            persistent-hint></v-combobox>
                </v-flex>
                <v-flex xs12 class="pa-0">
                    <v-flex xs12 md6>
                        <v-select v-model="form.ref_tarefa_tipo"
                                  :items="dependencies.tipos"
                                  :error-messages="validationMessageField($v.form.ref_tarefa_tipo)"
                                  @change="extraiEsforcoPadrao"
                                  label="Tipo"
                                  item-text="nome"
                                  item-value="id"></v-select>
                    </v-flex>
                </v-flex>
                <v-flex xs12 class="pa-0">
                    <v-flex xs12 md6>
                        <v-text-field v-model="form.esforco_estimado"
                                      :error-messages="validationMessageField($v.form.esforco_estimado)"
                                      label="Esforço estimado"
                                      mask="##########"></v-text-field>
                    </v-flex>
                </v-flex>
                <v-flex xs12 class="pa-0">
                    <v-flex xs12 md6>
                        <v-select v-model="form.ref_tarefa_situacao"
                                  :items="dependencies.situacoes"
                                  :error-messages="validationMessageField($v.form.ref_tarefa_situacao)"
                                  label="Situação"
                                  item-text="nome"
                                  item-value="id"></v-select>
                    </v-flex>
                </v-flex>
                <v-flex xs12>
                    <v-autocomplete v-model="form.ref_projeto"
                                    :items="dependencies.projetos"
                                    :error-messages="validationMessageField($v.form.ref_projeto)"
                                    :filter="filtrarProjeto"
                                    item-text="nome"
                                    item-value="id"
                                    label="Projeto"
                                    hide-no-data
                                    clearable></v-autocomplete>
                </v-flex>
                <v-flex xs12 class="pa-0">
                    <v-flex xs12 md3>
                        <v-menu ref="abrirDatepickerDtDesejada"
                                :close-on-content-click="false"
                                v-model="abrirDatepickerDtDesejada"
                                :nudge-right="40"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px">
                            <v-text-field slot="activator"
                                          :value="dt_desejada_formatada"
                                          :error-messages="validationMessageField($v.form.dt_desejada)"
                                          label="Data desejada"
                                          append-icon="event"
                                          clearable
                                          readonly></v-text-field>
                            <v-date-picker v-model="form.dt_desejada"
                                           no-title
                                           @input="abrirDatepickerDtDesejada = false"
                                           locale="pt-br"></v-date-picker>
                        </v-menu>
                    </v-flex>
                </v-flex>
                <v-flex xs12>
                    <v-autocomplete v-model="form.equipes"
                                    :items="dependencies.equipes"
                                    :error-messages="validationMessageField($v.form.equipes)"
                                    :filter="filtrarEquipe"
                                    item-text="arvore_humanizada"
                                    item-value="id"
                                    label="Equipes"
                                    hide-no-data
                                    clearable
                                    chips
                                    deletable-chips
                                    multiple
                                    hint="Selecione as equipes da tarefa"
                                    persistent-hint></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                    <v-autocomplete v-model="form.usuarios"
                                    :items="dependencies.usuarios"
                                    :error-messages="validationMessageField($v.form.usuarios)"
                                    :filter="filtrarUsuario"
                                    item-text="nome"
                                    item-value="id"
                                    label="Usuários"
                                    hide-no-data
                                    clearable
                                    chips
                                    deletable-chips
                                    multiple
                                    hint="Selecione os usuários da tarefa"
                                    persistent-hint>
                    </v-autocomplete>
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
