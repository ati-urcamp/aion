<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'
  import AppCard from '../../../../app/components/common/Card.vue'
  import AppChildCard from '../../../../app/components/common/ChildCard.vue'
  import FormSaveActions from '../../../../app/components/form/FormActions.vue'

  import UsuarioApiService from '../../../services/domains/Usuario'
  import DataService from '../../../services/common/data'
  import * as notifyService from '../../../services/common/notify'
  import bus from '../../../../utils/bus'
  import helpers from '../../../../mixins/helper'

  import { email, maxLength, minLength, required, requiredIf, sameAs } from 'vuelidate/lib/validators'
  import { clone } from 'lodash'
  import moment from 'moment'

  // Services
  const usuarioService = new UsuarioApiService()

  export default {
    components: { AppPageHeader, AppCard, AppChildCard, FormSaveActions },
    mixins: [helpers],
    data () {
      return {
        isEdit: false,
        isSubmitted: false,
        isLoadingData: true,
        form: {
          nome: '',
          email: '',
          login: '',
          senha: '',
          senha_confirmation: '',
          fl_ativo: true,
          ref_equipe: null,
          valor_hora: 0,
          horarios: [],
          perfis: []
        },
        formHorario: {
          dia_semana: null,
          hora_entrada: '',
          hora_saida: ''
        },
        dependencies: {
          equipes: [],
          dias_semana: [],
          perfis: []
        },
        abrirModalHorario: false,
        moneyMask: {
          decimal: ',',
          thousands: '.',
          prefix: 'R$ ',
          suffix: '',
          precision: 2,
          masked: false
        }
      }
    },
    validations: {
      form: {
        nome: { required },
        email: { email },
        login: {
          required,
          maxLength: maxLength(15)
        },
        senha: {
          required: requiredIf(function () {
            return !this.isEdit
          }),
          minLength: minLength(6)
        },
        senha_confirmation: {
          sameAsPassword: sameAs('senha')
        },
        fl_ativo: { required },
        ref_equipe: { required }
      },
      formHorario: {
        dia_semana: { required },
        hora_entrada: { required },
        hora_saida: { required }
      }
    },
    computed: {
      totalCargaHoraria: function () {
        let cargaHoraria = 0

        this.form.horarios.forEach((horario) => {
          const start = moment('2018-01-01 ' + horario.hora_entrada)
          const end = moment('2018-01-01 ' + horario.hora_saida)
          const duration = moment.duration(end.diff(start))
          const hours = duration.asHours()

          cargaHoraria += hours
        })

        return cargaHoraria
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
          DataService.get([{ domain: 'equipe' }, { domain: 'dia-semana' }, { domain: 'perfil' }]).then(result => {
            this.dependencies = { ...this.dependencies, ...result }
            resolve()
          })
        })
      },
      async loadItem (id) {
        if (id) {
          this.isEdit = true
          usuarioService.get({ id: id, relations: ['horarios', 'perfis', 'equipe'] })
            .then(response => {
              this.form = { ...response }
              this.form.perfis = response.perfis.map((perfil) => perfil.id)
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
        this.$v.form.$touch()

        if (this.$v.form.$invalid) {
          return
        }

        bus.$emit('show-loader')
        this.isSubmitted = true
        const data = clone(this.form)
        usuarioService.save({ data: data })
          .then(() => {
            notifyService.success({ hideLoader: true })
            this.isSubmitted = false
            this.$router.push({ name: 'usuario.index' })
          })
          .catch(e => {
            console.log(e)
            this.isSubmitted = false
            bus.$emit('hide-loader')
          })
      },
      filtrarEquipe (item, queryText, itemText) {
        return item.arvore_humanizada.toLowerCase().indexOf(queryText.toString().toLowerCase()) > -1
      },
      filtrarPerfil (item, queryText, itemText) {
        return item.nome.toLowerCase().indexOf(queryText.toString().toLowerCase()) > -1
      },
      cadastrarHorario () {
        this.$v.formHorario.$touch()

        if (this.$v.formHorario.$invalid) {
          return
        }

        this.form.horarios.push(this.formHorario)
        this.abrirModalHorario = false
      },
      abrirCadastrarHorario () {
        this.formHorario = {
          dia_semana: null,
          hora_entrada: '',
          hora_saida: ''
        }

        this.$v.formHorario.$reset()
        this.abrirModalHorario = true
      },
      removerHorario (horario) {
        this.$swal({
          title: 'Deseja realmente remover esse registro?',
          text: 'Essa ação não pode ser revertida!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#4caf50',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim, continuar!',
          cancelButtonText: 'Cancelar'
        }).then(() => {
          this.form.horarios.splice(this.form.horarios.indexOf(horario), 1)
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
                <v-text-field v-model="form.login"
                              :error-messages="validationMessageField($v.form.login, ['required', 'maxLength'])"
                              label="Login"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="form.senha"
                              :error-messages="validationMessageField($v.form.senha)"
                              :type="'password'"
                              label="Senha"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="form.senha_confirmation"
                              :error-messages="validationMessageField($v.form.senha_confirmation, ['sameAsPassword'])"
                              :type="'password'"
                              label="Confirme a senha"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-autocomplete v-model="form.ref_equipe"
                                :items="dependencies.equipes"
                                :error-messages="validationMessageField($v.form.ref_equipe)"
                                :filter="filtrarEquipe"
                                item-text="arvore_humanizada"
                                item-value="id"
                                label="Equipe"
                                hide-no-data
                                clearable></v-autocomplete>
              </v-flex>
              <v-flex xs12>
                <v-autocomplete v-model="form.perfis"
                                :items="dependencies.perfis"
                                :filter="filtrarPerfil"
                                item-text="nome"
                                item-value="id"
                                label="Perfis"
                                hide-no-data
                                clearable
                                chips
                                deletable-chips
                                multiple
                                hint="Selecione os perfis do usuário"
                                persistent-hint></v-autocomplete>
              </v-flex>
              <v-flex xs12>
                <v-switch v-model="form.fl_ativo"
                          :error-messages="validationMessageField($v.form.fl_ativo)"
                          label="Ativo"></v-switch>
              </v-flex>
              <v-flex xs12>
                <v-currency-field v-model="form.valor_hora"
                                  label="Valor/hora"
                                  v-bind="moneyMask"></v-currency-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>

        <app-child-card title="Horários">
          <v-dialog v-model="abrirModalHorario" persistent max-width="640px">
            <v-card>
              <v-toolbar dark color="primary">
                <v-toolbar-title>Cadastrar horário</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="abrirModalHorario = false">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-form :model="formHorario">
                  <v-container grid-list-lg fluid>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-select v-model="formHorario.dia_semana"
                                  :items="dependencies.dias_semana"
                                  :error-messages="validationMessageField($v.formHorario.dia_semana)"
                                  label="Dia semana"></v-select>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field v-model="formHorario.hora_entrada"
                                      :error-messages="validationMessageField($v.formHorario.hora_entrada)"
                                      label="Hora entrada"
                                      mask="time"
                                      return-masked-value></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field v-model="formHorario.hora_saida"
                                      :error-messages="validationMessageField($v.formHorario.hora_saida)"
                                      label="Hora saída"
                                      mask="time"
                                      return-masked-value></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="abrirModalHorario = false" class="elevation-0">Cancelar</v-btn>
                <v-btn @click="cadastrarHorario" color="primary" dark class="elevation-0">
                  Cadastrar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-layout align-center>
            <v-flex xs6>
              <strong>{{ totalCargaHoraria.toString().replace('.', ',') }}</strong> horas cadastradas
            </v-flex>

            <v-flex xs6 class="text-xs-right">
              <v-btn color="primary" dark @click="abrirCadastrarHorario" class="mr-0 elevation-0">
                Novo cadastro
              </v-btn>
            </v-flex>
          </v-layout>
          <div class="v-table__overflow">
            <table class="v-datatable v-table theme--light">
              <thead>
              <tr>
                <th class="column">Dia da semana</th>
                <th class="column">Hora entrada</th>
                <th class="column">Hora saída</th>
                <th class="column-action column">Ações</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(horario, index) in form.horarios" :key="`horario-${index}`">
                <td>
                  {{dependencies.dias_semana.find((item) => item.value === horario.dia_semana).text}}
                </td>
                <td>{{horario.hora_entrada | time}}</td>
                <td>{{horario.hora_saida | time}}</td>
                <td class="v-table-actions v-table-nowrap">
                  <v-icon small @click="removerHorario(horario)">delete</v-icon>
                </td>
              </tr>
              <tr v-if="!form.horarios.length">
                <td colspan="4" class="text-xs-center">Nenhum horário cadastrado.</td>
              </tr>
              </tbody>
            </table>
          </div>
        </app-child-card>

      </template>
    </app-card>

    <form-save-actions :event-click="onSave"
                       :is-disabled="isSubmitted"
                       :is-submitted="isSubmitted"
                       route-back-name="usuario.index"/>

  </div>
</template>
