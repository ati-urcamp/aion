<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'
  import Kanban from '../../../../app/components/common/Kanban.vue'
  import Modal from './Modal.vue'

  import ProjetoApiService from '../../../services/domains/Projeto'
  import bus from '../../../../utils/bus'
  import { debounce } from 'lodash'
  import IdleJs from 'idle-js'

  import DataService from '../../../services/common/data'

  // Services
  const projetoService = new ProjetoApiService()

  export default {
    components: { AppPageHeader, Kanban, Modal },
    data () {
      return {
        isLoadingData: true,
        items: [],
        filters: {
          nome: '',
          cliente: '',
          tipo: ''
        },
        dependencies: {
          clientes: [],
          tipos: [],
          situacoes: []
        },
        mostrarModal: false,
        itemModal: null,
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
        idle: self.refreshItemsInterval * 4,
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
      filteredItems () {
        return this.items.filter(item => {
          if (this.filters.nome || this.filters.cliente || this.filters.tipo) {
            let nome = true
            let cliente = true
            let tipo = true

            if (this.filters.nome) {
              nome = item.nome.toLowerCase().includes(this.filters.nome.toLowerCase())
            }

            if (this.filters.cliente) {
              cliente = item.ref_cliente === this.filters.cliente
            }

            if (this.filters.tipo) {
              tipo = item.ref_projeto_tipo === this.filters.tipo
            }

            return nome && cliente && tipo
          } else {
            return true
          }
        })
      }
    },
    methods: {
      async getDependencies () {
        return new Promise(resolve => {
          DataService.get([{ domain: 'cliente' }, { domain: 'projeto-tipo' }, { domain: 'projeto-situacao' }]).then(result => {
            this.dependencies.clientes = result.clientes
            this.dependencies.tipos = result.tipos_projeto
            this.dependencies.situacoes = result.situacoes_projeto
            resolve()
          })
        })
      },
      async loadItems () {
        return new Promise((resolve, reject) => {
          projetoService.search({
            data: {
              orderBy: [
                { column: 'ordem', direction: 'ASC' },
                { column: 'nome', direction: 'ASC' }
              ]
            },
            perPage: 'all',
            relations: ['cliente', 'tipo', 'situacao']
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
      updateCard: debounce(async function (projeto, situacao, projetosSituacao) {
        this.items.find(item => item.id === Number(projeto)).ref_projeto_situacao = parseInt(situacao)
        await projetoService.atualizarSituacao(projeto, situacao)

        projetosSituacao.forEach((projeto, indice) => {
          this.items.find(item => item.id === Number(projeto)).ordem = indice
        })

        await projetoService.reordenar(projetosSituacao)
      }, 500),
      abrirModal (projeto) {
        this.mostrarModal = true
        this.itemModal = projeto
        bus.$emit('show-loader')
      },
      async startRefreshItems () {
        await this.loadItems()
        this.refreshItems = setInterval(this.loadItems, this.refreshItemsInterval)
      },
      stopRefreshItems () {
        clearInterval(this.refreshItems)
      }
    }
  }
</script>

<template>
    <div class="page-content">

        <app-page-header/>

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
                                            <v-text-field v-model="filters.nome"
                                                          label="Nome"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3 lg2>
                                            <v-select v-model="filters.cliente"
                                                      :items="dependencies.clientes"
                                                      label="Cliente"
                                                      item-text="nome"
                                                      item-value="id"
                                                      clearable></v-select>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3 lg2>
                                            <v-select v-model="filters.tipo"
                                                      :items="dependencies.tipos"
                                                      label="Tipo"
                                                      item-text="nome"
                                                      item-value="id"
                                                      clearable></v-select>
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
                card-stage-id="ref_projeto_situacao"
                card-title="nome"
                v-if="!isLoadingData">
            <div v-for="item in filteredItems" :slot="`card-${item.id}`" :key="`card-item-${item.id}`">
                <div>
                    <div class="caption lh-small">
                        <strong>ID:</strong> {{ item.id }}
                    </div>
                    <span class="body-1">{{ item.nome }}</span><br>
                    <br>
                    <v-layout align-content-space-between justify-center>
                        <v-flex>
                            <div class="caption lh-small">
                                {{ item.cliente.nome }}<br>
                                <strong>Resp.:</strong> {{ item.cliente.responsavel | firstAndLastName }}<br>
                                <strong>Criado em:</strong> {{ item.dt_criacao | dateEnToBr }}
                            </div>
                        </v-flex>
                        <v-flex shrink align-self-end style="white-space: nowrap">
                            <v-btn @click="abrirModal(item.id)"
                                   small
                                   depressed
                                   style="min-width: auto; margin: 0 0 0 8px">
                                <i class="fas fa-eye"></i>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </div>
            </div>
        </kanban>

        <modal :show-modal.sync="mostrarModal" :projeto.sync="itemModal"></modal>

    </div>
</template>
