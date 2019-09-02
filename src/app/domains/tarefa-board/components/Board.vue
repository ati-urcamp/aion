<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'
  import Kanban from '../../../../app/components/common/Kanban.vue'
  import Modal from './Modal.vue'
  import EditModal from './../../tarefa/components/EditModal.vue'
  import ListItemAction from './../../tarefa/components/ListItemAction.vue'

  import TarefaApiService from '../../../services/domains/Tarefa'
  import bus from '../../../../utils/bus'
  import { mapGetters } from 'vuex'
  import { debounce } from 'lodash'
  import IdleJs from 'idle-js'

  import DataService from '../../../services/common/data'

  // Services
  const tarefaService = new TarefaApiService()

  export default {
    components: { AppPageHeader, Kanban, Modal, EditModal, ListItemAction },
    data () {
      return {
        isLoadingData: true,
        items: [],
        filters: {
          titulo: '',
          tipo: '',
          situacao: '',
          projeto: '',
          usuario: '',
          equipe: ''
        },
        dependencies: {
          tipos: [],
          situacoes: [],
          projetos: [],
          usuarios: [],
          equipes: []
        },
        mostrarModal: false,
        itemModal: null,
        mostrarEditModal: false,
        itemEditModal: null,
        refreshItemsInterval: 3000, // 3 seconds
        refreshItems: null,
        idleBoard: null
      }
    },
    async mounted () {
      await this.getDependencies()
      this.startRefreshItems()

      const self = this

      this.idleBoard = new IdleJs({
        idle: self.refreshItemsInterval * 2,
        onIdle: function () {
          self.stopRefreshItems()
        },
        onActive: function () {
          self.startRefreshItems()
        }
      })

      this.idleBoard.start()
    },
    beforeDestroy () {
      this.stopRefreshItems()
      this.idleBoard.stop()
    },
    computed: {
      ...mapGetters(['teamPermissions', 'permissions']),
      filteredItems () {
        return this.items.filter(item => {
          if (this.filters.titulo || this.filters.tipo || this.filters.projeto || this.filters.usuario || this.filters.equipe) {
            let titulo = true
            let tipo = true
            let projeto = true
            let usuario = true
            let equipe = true

            if (this.filters.titulo) {
              titulo = item.titulo.toLowerCase().includes(this.filters.titulo.toLowerCase())
            }

            if (this.filters.tipo) {
              tipo = item.ref_tarefa_tipo === this.filters.tipo
            }

            if (this.filters.projeto) {
              projeto = item.ref_projeto === this.filters.projeto
            }

            if (this.filters.usuario) {
              usuario = item.ref_usuario_timesheet === this.filters.usuario
            }

            if (this.filters.equipe) {
              equipe = item.equipes.find(equipe => equipe.id === this.filters.equipe)
            }

            return titulo && tipo && projeto && usuario && equipe
          } else {
            return true
          }
        })
      },
      canCreate () {
        return this.permissions.some((item) => item === 'tarefa.store')
      },
      canEdit () {
        return this.permissions.some((item) => item === 'tarefa.update')
      },
      canArquivar () {
        return this.permissions.some((item) => item === 'tarefa.arquivar')
      }
    },
    methods: {
      async getDependencies () {
        return new Promise(resolve => {
          DataService.get([
            { domain: 'tarefa-tipo' },
            { domain: 'tarefa-situacao' },
            { domain: 'projeto' },
            { domain: 'usuario' },
            { domain: 'equipe' }
          ]).then(result => {
            this.dependencies.tipos = result.tipos_tarefa
            this.dependencies.situacoes = result.situacoes_tarefa.filter((situacao) => situacao.fl_visivel === true)
            this.dependencies.projetos = result.projetos
            this.dependencies.usuarios = result.usuarios

            this.teamPermissions.forEach((teamPermission) => {
              let equipe = result.equipes.find(equipe => equipe.id === teamPermission)

              if (equipe) {
                this.dependencies.equipes.push(equipe)
              }
            })

            resolve()
          })
        })
      },
      async loadItems () {
        return new Promise((resolve, reject) => {
          tarefaService.search({
            data: {
              ref_tarefa_situacao: { '!=': 16 },
              orderBy: [
                { column: 'ordem', direction: 'ASC' },
                { column: 'dt_desejada', direction: 'ASC' }
              ]
            },
            perPage: 'all',
            relations: ['tipo', 'situacao', 'projeto', 'usuario_timesheet', 'equipes']
          }).then(response => {
            this.items = response
            this.isLoadingData = false
            resolve()
          }).catch(e => {
            console.log(e)
            this.isLoadingData = false
            reject(e)
          })
        })
      },
      onFilterClean () {
        this.filters = {}
      },
      filtrarProjeto (item, queryText, itemText) {
        return item.nome.toLowerCase().indexOf(queryText.toString().toLowerCase()) > -1
      },
      filtrarUsuario (item, queryText, itemText) {
        return item.nome.toLowerCase().indexOf(queryText.toString().toLowerCase()) > -1
      },
      filtrarEquipe (item, queryText, itemText) {
        return item.arvore_humanizada.toLowerCase().includes(queryText.toString().toLowerCase())
      },
      duracaoTarefa: function (item) {
        if (item.duracao.total_em_segundos) {
          return `<span class="duracao-tarefa small">${item.duracao.total_humanizado}</span>`
        }
        return ''
      },
      updateCard: debounce(async function (projeto, situacao, projetosSituacao) {
        this.items.find(item => item.id === Number(projeto)).ref_projeto_situacao = parseInt(situacao)
        // await tarefaService.atualizarSituacao(projeto, situacao)

        projetosSituacao.forEach((projeto, indice) => {
          this.items.find(item => item.id === Number(projeto)).ordem = indice
        })

        // await tarefaService.reordenar(projetosSituacao)
      }, 500),
      abrirModal (tarefa) {
        this.mostrarModal = true
        this.itemModal = tarefa
        bus.$emit('show-loader')
      },
      abrirEditModal (tarefa) {
        this.mostrarEditModal = true
        this.itemEditModal = tarefa || null
        bus.$emit('show-loader')
      },
      async startRefreshItems () {
        await this.loadItems()
        this.refreshItems = setInterval(this.loadItems, this.refreshItemsInterval)
      },
      stopRefreshItems () {
        clearInterval(this.refreshItems)
      },
      arquivarTarefa (tarefa) {
        tarefaService.arquivar(tarefa)
          .then(async response => {
            const index = this.items.findIndex((item) => item.id === tarefa)
            this.items.splice(index, 1)
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

        <app-page-header>
            <template slot="content">
                <v-btn @click="abrirEditModal()"
                       v-if="canCreate"
                       large
                       color="primary"
                       :block="$vuetify.breakpoint.xs">
                    <i class="fas fa-plus"></i>
                    <span class="pl-2">Criar tarefa</span>
                </v-btn>
            </template>
        </app-page-header>

        <div class="list-component elevation-1">

            <div class="list-filters">
                <v-form :model="filters" @submit.prevent="onFilter">
                    <v-expansion-panel focusable>
                        <v-expansion-panel-content class="grey lighten-2">
                            <div slot="header">
                                <div class="flex-header">
                                    <div class="flex-header-title">
                                        <i class="fas fa-list"></i>
                                        <span class="pl-2 font-weight-medium">Filtros</span>
                                    </div>
                                    <div class="flex-header-actions">
                                        <v-btn @click="onFilterClean" small>
                                            <i class="fas fa-times-circle"></i>
                                            <span class="pl-2">Limpar Filtros</span>
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                            <v-card>
                                <v-container class="list-filters-container" grid-list-md>
                                    <v-layout row wrap>
                                        <v-flex xs12 sm6 md3 lg2>
                                            <v-text-field v-model="filters.titulo"
                                                          label="Título"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3 lg2>
                                            <v-select v-model="filters.tipo"
                                                      :items="dependencies.tipos"
                                                      label="Tipo"
                                                      item-text="nome"
                                                      item-value="id"
                                                      clearable></v-select>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3 lg2>
                                            <v-autocomplete v-model="filters.projeto"
                                                            :items="dependencies.projetos"
                                                            :filter="filtrarProjeto"
                                                            item-text="nome"
                                                            item-value="id"
                                                            label="Projeto"
                                                            hide-no-data
                                                            clearable></v-autocomplete>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3 lg2>
                                            <v-autocomplete v-model="filters.usuario"
                                                            :items="dependencies.usuarios"
                                                            :filter="filtrarUsuario"
                                                            item-text="nome"
                                                            item-value="id"
                                                            label="Usuário atual"
                                                            hide-no-data
                                                            clearable></v-autocomplete>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3 lg2>
                                            <v-autocomplete v-model="filters.equipe"
                                                            :items="dependencies.equipes"
                                                            :filter="filtrarEquipe"
                                                            item-text="arvore_humanizada"
                                                            item-value="id"
                                                            label="Equipe"
                                                            hide-no-data
                                                            clearable></v-autocomplete>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-form>
            </div>

        </div>

        <kanban :stages="dependencies.situacoes"
                :cards="filteredItems"
                @update-card="updateCard"
                stage-id="id"
                stage-title="nome"
                card-id="id"
                card-stage-id="ref_tarefa_situacao"
                card-title="titulo"
                v-if="!isLoadingData"
                class="tarefa-board">
            <div v-for="item in filteredItems"
                 :slot="`card-${item.id}`"
                 :key="`card-item-${item.id}`">
                <div class="card-inner-wrapper">
                    <div class="card-inner-border" :style="{'background-color': item.tipo.cor || '#FFF'}"></div>

                    <div class="caption lh-small">
                        <strong>ID:</strong> {{ item.id }}
                    </div>
                    <span class="body-1">{{ item.titulo }}</span><br>
                    <br>
                    <div class="caption lh-small">
                        {{item.projeto.nome}}<br>
                        <strong>Criado em:</strong> {{ item.dt_criacao | dateEnToBr }}<br>
                        <strong>Data desejada:</strong> {{ item.dt_desejada | dateEnToBr }}<br>
                    </div>
                    <br>
                    <v-layout align-content-space-between justify-center>
                        <v-flex>
                            <div class="caption lh-small">
                                <div v-if="item.usuario_timesheet">
                                    <i class="fas fa-user"></i> {{ item.usuario_timesheet.nome | firstAndLastName |
                                    ucwords }}<br>
                                    <i class="fas fa-clock"></i> {{ item.duracao.total_humanizado }}
                                </div>
                            </div>
                        </v-flex>
                        <v-flex shrink align-self-end style="white-space: nowrap">
                            <list-item-action :tarefa="item"
                                              small
                                              depressed
                                              board-style></list-item-action>
                            <v-btn @click="abrirEditModal(item.id)"
                                   v-if="canEdit"
                                   small
                                   depressed
                                   color="info"
                                   style="min-width: auto; margin: 0 0 0 4px">
                                <i class="fas fa-edit"></i>
                            </v-btn>
                            <v-btn @click="arquivarTarefa(item.id)"
                                   v-if="item.ref_tarefa_situacao === 13 && canArquivar"
                                   small
                                   depressed
                                   style="min-width: auto; margin: 0 0 0 4px">
                                <i class="fas fa-archive"></i>
                            </v-btn>
                            <v-btn @click="abrirModal(item.id)"
                                   small
                                   depressed
                                   style="min-width: auto; margin: 0 0 0 4px">
                                <i class="fas fa-eye"></i>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </div>
            </div>
        </kanban>

        <modal :show-modal.sync="mostrarModal" :tarefa.sync="itemModal"/>
        <edit-modal :show-modal.sync="mostrarEditModal" :tarefa.sync="itemEditModal" v-if="mostrarEditModal"/>

    </div>
</template>
