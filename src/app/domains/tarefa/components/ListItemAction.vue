<script>
  import HtmlEditor from '../../../components/common/HtmlEditor'

  import TarefaApiService from '../../../services/domains/Tarefa'
  import bus from '../../../../utils/bus'
  import { mapGetters } from 'vuex'

  // Services
  const tarefaService = new TarefaApiService()

  export default {
    components: { HtmlEditor },
    props: {
      tarefa: {
        type: Object
      },
      small: {
        default: false,
        type: Boolean
      },
      depressed: {
        default: false,
        type: Boolean
      },
      boardStyle: {
        default: false,
        type: Boolean
      }
    },
    data () {
      return {
        mostrarIniciar: false,
        mostrarPausar: false,
        observacao: '',
        modalPausarTarefa: false
      }
    },
    mounted () {
      if (!this.tarefa.fl_finalizada) {
        if (!this.tarefa.fl_iniciada && !this.tarefa.fl_pausada) {
          this.mostrarIniciar = true
          this.mostrarPausar = false
        } else if (!this.tarefa.fl_pausada) {
          if (this.tarefa.ref_usuario_timesheet === this.currentUser.id) {
            this.mostrarIniciar = false
            this.mostrarPausar = true
          } else {
            this.mostrarIniciar = false
            this.mostrarPausar = false
          }
        } else {
          this.mostrarIniciar = true
          this.mostrarPausar = false
        }
      }
    },
    computed: {
      ...mapGetters(['currentUser', 'permissions']),
      computedBoardStyle: function () {
        return this.boardStyle ? { minWidth: 'auto', margin: '0 0 0 4px' } : {}
      }
    },
    methods: {
      iniciarTarefa () {
        bus.$emit('show-loader')
        tarefaService.iniciar(this.tarefa.id)
          .then(response => {
            if (response.fl_iniciada) {
              this.mostrarIniciar = false
              this.mostrarPausar = true
            }
            bus.$emit('hide-loader')
          })
          .catch(e => {
            console.log(e)
            bus.$emit('hide-loader')
          })
      },
      pausarTarefa () {
        bus.$emit('show-loader')
        tarefaService.pausar(this.tarefa.id)
          .then(response => {
            if (response.fl_pausada) {
              this.controlaModalPausarTarefa()
              this.mostrarPausar = false
              this.mostrarIniciar = true
            }
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
        tarefaService.pausar(this.tarefa.id, data)
          .then(response => {
            if (response.fl_pausada) {
              this.controlaModalPausarTarefa()
              this.mostrarPausar = false
              this.mostrarIniciar = true
            }
            bus.$emit('hide-loader')
          })
          .catch(e => {
            console.log(e)
            bus.$emit('hide-loader')
          })
      },
      controlaModalPausarTarefa () {
        this.observacao = ''
        this.modalPausarTarefa = !this.modalPausarTarefa
      }
    }
  }
</script>

<template>
    <div class="d-inline-block">
        <div class="d-inline-block">
            <v-btn color="green"
                   @click="iniciarTarefa"
                   v-if="mostrarIniciar"
                   class="white--text"
                   title="Iniciar"
                   :small="small"
                   :depressed="depressed"
                   :style="computedBoardStyle">
                <i class="fas fa-play"></i>
            </v-btn>
            <v-btn color="warning"
                   @click="controlaModalPausarTarefa"
                   v-if="mostrarPausar"
                   title="Pausar"
                   :small="small"
                   :depressed="depressed"
                   :style="computedBoardStyle">
                <i class="fas fa-pause"></i>
            </v-btn>
        </div>
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
                           v-if="mostrarPausar"
                           color="primary"
                           class="elevation-0">Apenas Pausar
                    </v-btn>
                    <v-btn @click="pausarTarefaComObservacao"
                           color="success"
                           :disabled="!observacao"
                           v-if="mostrarPausar"
                           class="elevation-0">Pausar e Gravar Observação
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="controlaModalPausarTarefa"
                           class="elevation-0">Fechar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
