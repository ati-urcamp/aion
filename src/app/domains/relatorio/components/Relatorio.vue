<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'

  import RelatorioApiService from '../../../services/domains/Relatorio'
  import helpers from '../../../../mixins/helper'
  import bus from '../../../../utils/bus'
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  // Services
  const relatorioService = new RelatorioApiService()

  export default {
    components: { AppPageHeader },
    mixins: [helpers],
    data () {
      return {
        isLoadingData: false,
        relatorio: {
          dt_inicial: '',
          dt_final: ''
        },
        abrirDatepickerDtInicial: false,
        abrirDatepickerDtFinal: false,
        relatorioPdfBase64: ''
      }
    },
    async mounted () {
      this.relatorio.dt_inicial = moment().startOf('week').format('YYYY-MM-DD')
      this.relatorio.dt_final = moment().endOf('week').format('YYYY-MM-DD')
    },
    computed: {
      ...mapGetters(['teamPermissions', 'permissions']),
      dt_inicial_formatada () {
        return this.relatorio.dt_inicial ? this.dateFormat(this.relatorio.dt_inicial, 'br') : ''
      },
      dt_final_formatada () {
        return this.relatorio.dt_final ? this.dateFormat(this.relatorio.dt_final, 'br') : ''
      },
      canGerarRelatorioTarefasPeriodo () {
        return this.permissions.some((item) => item === 'relatorio.tarefas-por-periodo')
      }
    },
    methods: {
      gerarRelatorioTarefasPeriodo () {
        this.isLoadingData = true
        bus.$emit('show-loader')

        relatorioService.gerarRelatorioTarefasPeriodo(this.relatorio.dt_inicial, this.relatorio.dt_final)
          .then(async response => {
            this.relatorioPdfBase64 = 'data:application/pdf;base64, ' + response.arquivo

            this.isLoadingData = false
            bus.$emit('hide-loader')
          })
          .catch(e => {
            console.log(e)
          })
      }
    }
  }
</script>

<template>
  <div class="page-content">

    <app-page-header></app-page-header>

    <div class="list-component elevation-1">

      <div class="list-filters" v-if="canGerarRelatorioTarefasPeriodo">
        <v-form :model="relatorio" @submit.prevent="gerarRelatorioTarefasPeriodo">
          <v-card>
            <v-card-title class="grey lighten-2">
              <div class="flex-header">
                <div class="flex-header-title">
                  <i class="fas fa-list"></i>
                  <span class="pl-2 font-weight-medium">Tarefas por período</span>
                </div>
                <div class="flex-header-actions">
                  <v-btn type="submit" color="green lighten-1 white--text" small>
                    <i class="fas fa-filter"></i>
                    <span class="pl-2">Gerar relatório</span>
                  </v-btn>
                </div>
              </div>
            </v-card-title>
            <v-card-text>
              <v-container class="list-filters-container" grid-list-md>
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    <v-menu ref="abrirDatepickerDtInicial"
                            :close-on-content-click="false"
                            v-model="abrirDatepickerDtInicial"
                            :nudge-right="40"
                            lazy
                            transition="scale-transition"
                            offset-y
                            full-width
                            max-width="290px"
                            min-width="290px">
                      <v-text-field slot="activator"
                                    :value="dt_inicial_formatada"
                                    label="Data inicial"
                                    append-icon="event"
                                    clearable
                                    readonly></v-text-field>
                      <v-date-picker v-model="relatorio.dt_inicial"
                                     no-title
                                     @input="abrirDatepickerDtInicial = false"
                                     locale="pt-br"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-menu ref="abrirDatepickerDtFinal"
                            :close-on-content-click="false"
                            v-model="abrirDatepickerDtFinal"
                            :nudge-right="40"
                            lazy
                            transition="scale-transition"
                            offset-y
                            full-width
                            max-width="290px"
                            min-width="290px">
                      <v-text-field slot="activator"
                                    :value="dt_final_formatada"
                                    label="Data final"
                                    append-icon="event"
                                    clearable
                                    readonly></v-text-field>
                      <v-date-picker v-model="relatorio.dt_final"
                                     no-title
                                     @input="abrirDatepickerDtFinal = false"
                                     locale="pt-br"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12>
                    <div class="iframe-pdf">
                      <iframe :src="relatorioPdfBase64"></iframe>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-form>
      </div>

    </div>

  </div>
</template>
