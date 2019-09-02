<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'

  import DashboardApiService from '../../../services/domains/Dashboard'
  import bus from '../../../../utils/bus'

  import { Chart } from 'highcharts-vue'

  // Services
  const dashboardService = new DashboardApiService()

  export default {
    components: { AppPageHeader, highcharts: Chart },
    data () {
      return {
        isLoadingData: true,
        totaisPorSituacao: [],
        totaisPorTipo: [],
        totaisPorTimesheet: [],
        chartTotaisPeriodoGeral: {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Produtividade da equipe nos últimos 30 dias'
          },
          credits: {
            enabled: false
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            min: 0,
            tickInterval: 5,
            title: {
              text: 'Horas'
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormat: 'Total: <b>{point.y} horas</b>'
          },
          series: []
        },
        chartTotaisPeriodoUsuarios: {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Produtividade individual nos últimos 7 dias'
          },
          credits: {
            enabled: false
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            min: 0,
            tickInterval: 5,
            title: {
              text: 'Horas'
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormat: 'Total: <b>{point.y} horas</b>'
          },
          series: []
        },
        chartTotaisPeriodoUsuario: {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Sua produtividade nos últimos 15 dias'
          },
          credits: {
            enabled: false
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            min: 0,
            tickInterval: 1,
            title: {
              text: 'Horas'
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormat: 'Total: <b>{point.y} horas</b>'
          },
          series: []
        }
      }
    },
    async mounted () {
      bus.$emit('show-loader')
      this.totaisPorSituacao = await dashboardService.totaisPorSituacao()
      this.totaisPorTipo = await dashboardService.totaisPorTipo()
      this.totaisPorTimesheet = await dashboardService.totaisPorTimesheet()

      this.montaGraficoHorasPeriodoGeral()
      this.montaGraficoHorasPeriodoUsuarios()
      this.montaGraficoHorasPeriodoUsuario()

      this.isLoadingData = false
      bus.$emit('hide-loader')
    },
    computed: {
      totaisPorSituacaoVisivel () {
        return this.totaisPorSituacao.filter((item) => item.fl_visivel === true)
      }
    },
    methods: {
      montaGraficoHorasPeriodoGeral () {
        let serie = {
          name: 'Data período',
          data: []
        }

        this.totaisPorTimesheet.horas_periodo_geral.forEach(item => {
          serie.data.push([this.$options.filters.dateEnToBr(item.dt_periodo), parseFloat(item.total)])
        })

        this.chartTotaisPeriodoGeral.series = [serie]
      },
      montaGraficoHorasPeriodoUsuarios () {
        let serie = {
          name: 'Usuário',
          data: []
        }

        this.totaisPorTimesheet.horas_periodo_usuarios.forEach(item => {
          serie.data.push([this.$options.filters.ucwords(this.$options.filters.firstAndLastName(item.nome)), parseFloat(item.total)])
        })

        this.chartTotaisPeriodoUsuarios.series = [serie]
      },
      montaGraficoHorasPeriodoUsuario () {
        let serie = {
          name: 'Data período',
          data: []
        }

        this.totaisPorTimesheet.horas_periodo_usuario.forEach(item => {
          serie.data.push([this.$options.filters.dateEnToBr(item.dt_periodo), parseFloat(item.total)])
        })

        this.chartTotaisPeriodoUsuario.series = [serie]
      }
    }
  }
</script>

<template>
    <div class="page-content">

        <app-page-header/>

        <div v-if="!isLoadingData">
            <v-container fluid grid-list-md class="pa-0 mb-1">
                <v-layout row wrap>
                    <v-flex v-for="situacao in totaisPorSituacaoVisivel" :key="`situacao-${situacao.id}`">
                        <v-card elevation="0"
                                :style="{'background-color': situacao.cor || '#FFF', 'color': situacao.cor ? '#FFF' : '#000'}">
                            <v-card-text>
                                <div class="text-xs-center">
                                    <h3 class="display-3">{{ situacao.total }}</h3>
                                    <div class="headline">{{ situacao.nome }}</div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>

            <v-container fluid grid-list-md class="pa-0 mb-1">
                <v-layout row wrap>
                    <v-flex xs12 md6>
                        <div class="pa-2" style="width: 100%; background-color: #FFF;">
                            <highcharts :options="chartTotaisPeriodoGeral"></highcharts>
                        </div>
                    </v-flex>

                    <v-flex xs12 md6>
                        <div class="pa-2" style="width: 100%; background-color: #FFF;">
                            <highcharts :options="chartTotaisPeriodoUsuarios"></highcharts>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>

            <v-container fluid grid-list-md class="pa-0">
                <v-layout row wrap>
                    <v-flex xs12 md6>
                        <div class="pa-2" style="width: 100%; background-color: #FFF;">
                            <highcharts :options="chartTotaisPeriodoUsuario"></highcharts>
                        </div>
                    </v-flex>

                    <v-flex xs12 md6>
                        <v-layout row wrap>
                            <v-flex xs12 md6 v-for="tipo in totaisPorTipo" :key="`tipo-${tipo.id}`">
                                <v-card elevation="0"
                                        :style="{'background-color': tipo.cor || '#FFF', 'color': tipo.cor ? '#FFF' : '#000'}">
                                    <v-card-text>
                                        <div class="d-inline-flex align-center">
                                            <div class="pr-2 text-xs-center" style="min-width: 40px">
                                                {{ tipo.total }}
                                            </div>
                                            <h3 class="subheading">{{ tipo.nome }}</h3>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

    </div>
</template>
