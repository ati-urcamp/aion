<script>
  import HtmlEditor from '../../../components/common/HtmlEditor'

  import TarefaApiService from '../../../services/domains/Tarefa'
  import TarefaChecklistService from '../../../services/domains/TarefaChecklist'
  import bus from '../../../../utils/bus'
  import helpers from '../../../../mixins/helper'
  import { mapGetters } from 'vuex'

  // Services
  const tarefaService = new TarefaApiService()
  const tarefaChecklist = new TarefaChecklistService()

  export default {
    name: 'ShowContent',
    components: { HtmlEditor },
    mixins: [helpers],
    props: {
      tarefa: {
        default: 0,
        type: Number
      }
    },
    watch: {
      tarefa: {
        handler: async function () {
          this.stopTimer()
          await this.loadItem(this.tarefa)
        },
        immediate: true
      }
    },
    data () {
      return {
        isLoadingData: true,
        item: {
          tags: [],
          tipo: {},
          situacao: {},
          projeto: {},
          equipes: [],
          usuarios: [],
          timesheets: [],
          checklist: [],
          fl_iniciada: false,
          fl_pausada: false,
          fl_finalizada: false,
          ref_usuario_timesheet: null,
          duracao: {
            total_em_segundos: 0,
            total_humanizado: '00:00:00'
          }
        },
        mostrarIniciar: false,
        mostrarPausar: false,
        mostrarFinalizar: false,
        mostrarReabrir: false,
        mostrarArquivar: false,
        currentTime: {
          time: 0,
          isRunning: false,
          interval: null
        },
        observacao: '',
        modalPausarTarefa: false,
        descricaoChecklist: '',
        checklist: false
      }
    },
    computed: {
      ...mapGetters(['permissions']),
      canIniciar () {
        return this.permissions.some((item) => item === 'tarefa.iniciar')
      },
      canPausar () {
        return this.permissions.some((item) => item === 'tarefa.pausar')
      },
      canFinalizar () {
        return this.permissions.some((item) => item === 'tarefa.finalizar')
      },
      canReabrir () {
        return this.permissions.some((item) => item === 'tarefa.reabrir')
      },
      canArquivar () {
        return this.permissions.some((item) => item === 'tarefa.arquivar')
      },
      totalChecklistFinalizadas () {
        return this.item.checklist.filter(item => item.finalizada === true).length
      },
      porcentagemTotalChecklistFinalizadas () {
        return (this.totalChecklistFinalizadas * 100) / this.item.checklist.length
      }
    },
    methods: {
      async loadItem (id) {
        return new Promise((resolve, reject) => {
          if (id) {
            tarefaService.get({
              id: id,
              relations: ['tipo', 'situacao', 'projeto', 'equipes', 'usuarios', 'timesheets.usuario', 'checklist']
            })
              .then(response => {
                this.item = { ...response }
                this.isLoadingData = false

                this.currentTime.time = this.item.duracao.total_em_segundos
                this.montarAcoes()

                if (!this.item.fl_finalizada && this.$store.state.user.id === this.item.ref_usuario_timesheet && !this.item.fl_pausada) {
                  this.startTimer()
                }

                bus.$emit('hide-loader')
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
      iniciarTarefa () {
        bus.$emit('show-loader')

        tarefaService.iniciar(this.item.id)
          .then(async response => {
            this.item = { ...response }
            this.montarAcoes()

            this.currentTime.time = this.item.duracao.total_em_segundos
            this.startTimer()

            bus.$emit('hide-loader')
          })
          .catch(e => {
            console.log(e)
            bus.$emit('hide-loader')
          })
      },
      pausarTarefa () {
        bus.$emit('show-loader')

        tarefaService.pausar(this.item.id)
          .then(async response => {
            this.item = { ...response }
            this.controlaModalPausarTarefa()
            this.montarAcoes()
            this.stopTimer()
            this.currentTime.time = this.item.duracao.total_em_segundos

            bus.$emit('hide-loader')
          })
          .catch(e => {
            console.log(e)
            bus.$emit('hide-loader')
          })
      },
      pausarTarefaComObservacao () {
        bus.$emit('show-loader')
        const data = { observacao: this.observacao }
        tarefaService.pausar(this.item.id, data)
          .then(async response => {
            this.item = { ...response }
            this.controlaModalPausarTarefa()
            this.montarAcoes()
            this.stopTimer()
            this.currentTime.time = this.item.duracao.total_em_segundos

            bus.$emit('hide-loader')
          })
          .catch(e => {
            console.log(e)
            bus.$emit('hide-loader')
          })
      },
      finalizarTarefa () {
        bus.$emit('show-loader')

        tarefaService.finalizar(this.item.id)
          .then(async response => {
            this.item = { ...response }
            this.montarAcoes()

            this.stopTimer()
            this.currentTime.time = this.item.duracao.total_em_segundos

            bus.$emit('hide-loader')
          })
          .catch(e => {
            console.log(e)
            bus.$emit('hide-loader')
          })
      },
      reabrirTarefa () {
        bus.$emit('show-loader')

        tarefaService.reabrir(this.item.id)
          .then(async response => {
            this.item = { ...response }
            this.montarAcoes()

            this.currentTime.time = this.item.duracao.total_em_segundos

            bus.$emit('hide-loader')
          })
          .catch(e => {
            console.log(e)
            bus.$emit('hide-loader')
          })
      },
      duplicarTarefa () {
        this.$swal({
          title: 'Deseja realmente duplicar essa tarefa?',
          text: 'As tags e os usuários da tarefa também serão duplicados',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#4caf50',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim, continuar!',
          cancelButtonText: 'Cancelar'
        }).then(() => {
          bus.$emit('show-loader')
          tarefaService.duplicar(this.item.id)
            .then(response => {
              this.$router.push({ name: 'tarefa.show', params: { id: response.id } })
              this.loadItem(response.id)
            })
            .catch(e => {
              console.log(e)
              bus.$emit('hide-loader')
            })
        })
      },
      arquivarTarefa () {
        bus.$emit('show-loader')

        tarefaService.arquivar(this.item.id)
          .then(async response => {
            this.item = { ...response }
            this.montarAcoes()

            this.currentTime.time = this.item.duracao.total_em_segundos

            bus.$emit('hide-loader')
          })
          .catch(e => {
            console.log(e)
            bus.$emit('hide-loader')
          })
      },
      montarAcoes () {
        this.mostrarIniciar = false
        this.mostrarPausar = false
        this.mostrarFinalizar = false
        this.mostrarReabrir = false
        this.mostrarArquivar = false

        if (!this.item.fl_finalizada) {
          if (this.$store.state.user.id === this.item.ref_usuario_timesheet) {
            this.mostrarIniciar = true

            if (!this.item.fl_pausada) {
              this.mostrarIniciar = false
              this.mostrarPausar = true
            }

            this.mostrarFinalizar = true
          } else {
            if (!this.item.fl_iniciada || (this.item.fl_iniciada && this.item.fl_pausada)) {
              this.mostrarIniciar = true
              this.mostrarFinalizar = true
            }
          }
        } else {
          this.mostrarReabrir = true

          if (this.item.situacao.id !== 16) {
            this.mostrarArquivar = true
          }
        }
      },
      startTimer () {
        clearInterval(this.interval)
        this.interval = setInterval(this.incrementTime, 1000)
        this.currentTime.isRunning = true
      },
      stopTimer () {
        clearInterval(this.interval)
        this.currentTime.isRunning = false
      },
      incrementTime () {
        this.currentTime.time = parseInt(this.currentTime.time) + 1
      },
      controlaModalPausarTarefa () {
        this.observacao = ''
        this.modalPausarTarefa = !this.modalPausarTarefa
      },
      gravarChecklist () {
        if (!this.descricaoChecklist) {
          this.$swal({
            title: 'Você deve preencher o campo descrição',
            type: 'warning'
          })
          return
        }
        const data = { ref_tarefa: this.item.id, descricao: this.descricaoChecklist }
        tarefaChecklist.gravarChecklist(this.item.id, data)
          .then(response => {
            this.item.checklist.push(response)
            this.descricaoChecklist = ''
          })
          .catch(e => {
            console.log(e)
          })
      },
      removerChecklist (item, index) {
        tarefaChecklist.removerChecklist(item)
          .then(() => {
            this.item.checklist.splice(index, 1)
          })
          .catch(e => {
            console.log(e)
          })
      },
      alterarStatusChecklist ($event, item) {
        const data = { ref_tarefa: this.item.id, finalizada: $event }
        tarefaChecklist.alterarStatusChecklist(item, data)
          .then(() => {
          })
          .catch(e => {
            console.log(e)
          })
      }
    }
  }
</script>

<template>
    <v-container grid-list-lg v-if="!isLoadingData">
        <v-layout row wrap>
            <v-flex xs12 md10>
                <strong>ID:</strong> {{ item.id }}<br>
                <strong>Título:</strong> {{ item.titulo }}<br>
                <strong>Tags:</strong><br>
                <div style="margin-left: -4px">
                    <span class="v-chip theme--light"
                          v-for="(tag, index) in item.tags"
                          :key="`tag-${index}`">
                        <span class="v-chip__content">{{ tag }}</span>
                    </span>
                </div>
                <strong>Tipo:</strong> {{ item.tipo.nome }}<br>
                <strong>Esforço estimado:</strong> {{ item.esforco_estimado }}<br>
                <strong>Situação:</strong> {{ item.situacao.nome }}<br>
                <strong>Projeto:</strong> {{ item.projeto.nome }}<br>
                <strong>Data desejada:</strong> {{ item.dt_desejada | dateEnToBr }}<br>
                <strong>Equipes:</strong><br>
                <div style="margin-left: -4px">
                    <span class="v-chip theme--light"
                          v-for="(equipe, index) in item.equipes"
                          :key="`equipe-${index}`">
                        <span class="v-chip__content">{{ equipe.arvore_humanizada }}</span>
                    </span>
                </div>
                <strong>Usuários:</strong><br>
                <div style="margin-left: -4px">
                    <span class="v-chip theme--light"
                          v-for="(usuario, index) in item.usuarios"
                          :key="`usuario-${index}`">
                        <span class="v-chip__content">{{ usuario.nome | ucwords }}</span>
                    </span>
                </div>
                <strong>Descrição:</strong><br>
                <div style="white-space: pre-line;" v-html="item.descricao"></div>
            </v-flex>
            <v-flex xs12 md2>
                <div class="duracao-tarefa">
                    {{ humanizeDuration(currentTime.time) }}
                </div>

                <v-btn depressed color="primary" large block outline
                       @click="iniciarTarefa"
                       v-if="mostrarIniciar && canIniciar">
                    <i class="fas fa-play"></i>
                    <span class="pl-2">Iniciar</span>
                </v-btn>

                <v-btn depressed color="primary" large block outline
                       @click="controlaModalPausarTarefa"
                       v-if="mostrarPausar && canPausar">
                    <i class="fas fa-pause-circle"></i>
                    <span class="pl-2">Pausar</span>
                </v-btn>

                <v-btn depressed color="primary" large block outline
                       @click="finalizarTarefa"
                       v-if="mostrarFinalizar && canFinalizar">
                    <i class="fas fa-arrow-circle-right"></i>
                    <span class="pl-2">Finalizar</span>
                </v-btn>

                <v-btn depressed color="primary" large block outline
                       @click="reabrirTarefa"
                       v-if="mostrarReabrir && canReabrir">
                    <i class="fas fa-external-link-square-alt"></i>
                    <span class="pl-2">Reabrir</span>
                </v-btn>

                <v-btn depressed color="primary" large block outline
                       @click="duplicarTarefa">
                    <i class="far fa-clone"></i>
                    <span class="pl-2">Duplicar</span>
                </v-btn>

                <v-btn depressed color="primary" large block outline
                       @click="arquivarTarefa"
                       v-if="mostrarArquivar && canArquivar">
                    <i class="fas fa-file-archive"></i>
                    <span class="pl-2">Arquivar</span>
                </v-btn>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex md6 xs12>
                <v-expansion-panel focusable>
                    <v-expansion-panel-content class="grey lighten-2">
                        <div slot="header" class="font-weight-bold">Checklist</div>
                        <v-card>
                            <v-card-text>
                                <v-text-field label="Descrição (Pressione ENTER para salvar)"
                                              placeholder="Digite a descrição do item"
                                              hide-details
                                              @keyup.enter="gravarChecklist"
                                              v-model="descricaoChecklist"></v-text-field>
                                <v-btn v-if="$vuetify.breakpoint.xs" block color="success" small
                                       :disabled="!descricaoChecklist"
                                       @click="gravarChecklist">
                                    <i class="fas fa-plus"></i>
                                    <span class="pl-2">Adicionar</span>
                                </v-btn>
                                <div class="checklist-progress" v-if="item.checklist.length > 0">
                                    <strong>Progresso
                                        ({{totalChecklistFinalizadas}}/{{item.checklist.length}}):</strong>
                                    <v-progress-linear color="success"
                                                       height="10"
                                                       :value="porcentagemTotalChecklistFinalizadas"/>
                                </div>
                            </v-card-text>
                        </v-card>
                        <v-list three-line class="checklist-items">
                            <v-divider/>
                            <template v-for="(checklist, index) in item.checklist">
                                <v-list-tile>
                                    <v-list-tile-action>
                                        <v-checkbox v-model="checklist.finalizada"
                                                    @change="alterarStatusChecklist($event, checklist, index)"></v-checkbox>
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{checklist.descricao}}</v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action v-if="!checklist.finalizada">
                                        <v-btn icon small ripple color="error"
                                               @click="removerChecklist(checklist, index)">
                                            <i class="fas fa-times"></i>
                                        </v-btn>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider v-if="index < (item.checklist.length - 1)"/>
                            </template>
                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-flex>
            <v-flex md6 xs12>
                <v-expansion-panel focusable v-if="item.timesheets.length > 0">
                    <v-expansion-panel-content class="grey lighten-2">
                        <div slot="header" class="font-weight-bold">Timesheets</div>
                        <v-list two-line class="tarefa-timesheets">
                            <template v-for="(timesheet, index) in item.timesheets">
                                <div :key="timesheet.id">
                                    <v-list-tile avatar>
                                        <v-list-tile-avatar v-if="timesheet.usuario.avatar">
                                            <img :src="timesheet.usuario.avatar">
                                        </v-list-tile-avatar>
                                        <v-list-tile-content>
                                            <v-list-tile-title>
                                                {{ timesheet.usuario.nome | ucwords }}
                                            </v-list-tile-title>
                                            <v-list-tile-sub-title v-if="timesheet.observacao"
                                                                   v-html="timesheet.observacao"></v-list-tile-sub-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action>
                                            <v-list-tile-action-text>
                                                <div class="text-xs-right">
                                                    <div>
                                                        <strong>Iniciado em:</strong> {{ timesheet.dt_inicio |
                                                        dateTimeEnToBr }}
                                                    </div>
                                                    <div v-if="timesheet.dt_termino">
                                                        <strong>Pausado em:</strong> {{ timesheet.dt_termino |
                                                        dateTimeEnToBr }}
                                                    </div>
                                                </div>
                                            </v-list-tile-action-text>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                    <v-divider v-if="index < item.timesheets.length - 1"/>
                                </div>
                            </template>
                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-flex>
        </v-layout>
        <v-dialog v-model="modalPausarTarefa" persistent max-width="1264px">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Observações</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="controlaModalPausarTarefa">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <html-editor :model.sync="observacao" label=" "></html-editor>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="pausarTarefa"
                           v-if="mostrarPausar && canPausar"
                           color="primary"
                           class="elevation-0">Apenas Pausar
                    </v-btn>
                    <v-btn @click="pausarTarefaComObservacao"
                           color="success"
                           :disabled="!observacao"
                           v-if="mostrarPausar && canPausar"
                           class="elevation-0">Pausar e Gravar Observação
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="controlaModalPausarTarefa"
                           class="elevation-0">Fechar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
