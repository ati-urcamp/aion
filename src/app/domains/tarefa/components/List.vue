<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'
  import ListMain from '../../../../app/components/list/Main.vue'
  import ListSortColumn from '../../../../app/components/list/SortColumn.vue'
  import ListShowButton from '../../../../app/components/list/ShowButton.vue'
  import ListEditButton from '../../../../app/components/list/EditButton.vue'
  import ListDeleteButton from '../../../../app/components/list/DeleteButton.vue'
  import ListItemAction from './ListItemAction.vue'

  import bus from '../../../../utils/bus'
  import { clone } from 'lodash'
  import { mapGetters } from 'vuex'

  import DataService from '../../../services/common/data'

  const defaultSearchData = { ref_tarefa_situacao: { in: [10, 11, 12, 14] } }
  const defaultSort = [{ column: 'dt_desejada', direction: 'ASC' }]

  export default {
    components: {
      AppPageHeader,
      ListMain,
      ListSortColumn,
      ListShowButton,
      ListEditButton,
      ListDeleteButton,
      ListItemAction
    },
    data () {
      return {
        isLoadingData: true,
        filters: {
          titulo: '',
          tipo: '',
          situacao: clone(defaultSearchData.ref_tarefa_situacao.in),
          projeto: '',
          usuario: ''
        },
        dependencies: {
          tipos: [],
          situacoes: [],
          projetos: [],
          usuarios: []
        }
      }
    },
    async mounted () {
      this.listStore.listSort = clone(defaultSort)

      bus.$emit('list-init', {
        domain: 'tarefa',
        relations: ['tipo', 'situacao', 'projeto', 'usuario_timesheet'],
        data: clone(defaultSearchData)
      }, () => {
        this.isLoadingData = false
      })

      await this.getDependencies()
    },
    computed: {
      ...mapGetters(['listStore'])
    },
    methods: {
      async getDependencies () {
        DataService.get([{ domain: 'tarefa-tipo' }, { domain: 'tarefa-situacao' }, { domain: 'projeto' }, { domain: 'usuario' }]).then(result => {
          this.dependencies.tipos = result.tipos_tarefa
          this.dependencies.situacoes = result.situacoes_tarefa
          this.dependencies.projetos = result.projetos
          this.dependencies.usuarios = result.usuarios
        })
      },
      onFilter () {
        const searchData = {}

        if (this.filters.titulo) {
          searchData.titulo = { 'ilike': '%' + this.filters.titulo + '%' }
        }

        if (this.filters.tipo) {
          searchData.ref_tarefa_tipo = this.filters.tipo
        }

        if (this.filters.situacao.length > 0) {
          searchData.ref_tarefa_situacao = { in: this.filters.situacao }
        }

        if (this.filters.projeto) {
          searchData.ref_projeto = this.filters.projeto
        }

        if (this.filters.usuario) {
          searchData.ref_usuario_timesheet = this.filters.usuario
        }

        bus.$emit('list-filter', searchData)
      },
      onFilterClean () {
        this.listStore.listSort = clone(defaultSort)

        this.filters = { ...defaultSearchData }
        bus.$emit('list-filter-clean', this.filters)
      },
      onDestroy (item) {
        bus.$emit('list-destroy-item', item)
      },
      filtrarProjeto (item, queryText, itemText) {
        return item.nome.toLowerCase().indexOf(queryText.toString().toLowerCase()) > -1
      },
      filtrarUsuario (item, queryText, itemText) {
        return item.nome.toLowerCase().indexOf(queryText.toString().toLowerCase()) > -1
      },
      duracaoTarefa: function (item) {
        if (item.duracao.total_em_segundos) {
          return `<span class="duracao-tarefa small">${item.duracao.total_humanizado}</span>`
        }
        return ''
      }
    }
  }
</script>

<template>
    <div class="page-content">

        <app-page-header store-route-name="tarefa.create"/>

        <ListMain class="elevation-1">

            <div slot="filters">
                <v-form :model="filters" @submit.prevent="onFilter">
                    <v-card class="list-filters-card" :flat="true">
                        <v-card-title class="grey lighten-2">
                            <div class="flex-header">
                                <div class="flex-header-title">
                                    <i class="fas fa-list"></i>
                                    <span class="pl-2 font-weight-medium">Listagem</span>
                                </div>
                                <div class="flex-header-actions">
                                    <v-btn type="submit" color="green lighten-1 white--text" small>
                                        <i class="fas fa-filter"></i>
                                        <span class="pl-2">Pesquisar</span>
                                    </v-btn>
                                    <v-btn @click="onFilterClean" small>
                                        <i class="fas fa-times-circle"></i>
                                        <span class="pl-2">Limpar Filtros</span>
                                    </v-btn>
                                </div>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <v-container class="list-filters-container" grid-list-md>
                                <v-layout row wrap align-content-end>
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
                                        <v-select v-model="filters.situacao"
                                                  :items="dependencies.situacoes"
                                                  label="Situação"
                                                  multiple
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
                                </v-layout>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-form>
            </div>

            <div slot="list" v-if="!isLoadingData">
                <div class="v-table__overflow">
                    <table class="v-datatable v-table theme--light">
                        <thead>
                        <tr>
                            <list-sort-column label="ID" column="id"/>
                            <list-sort-column label="Título" column="titulo"/>
                            <th class="column">Tipo</th>
                            <list-sort-column label="Situação" column="ref_tarefa_situacao"/>
                            <th class="column">Projeto</th>
                            <list-sort-column label="Criado em" column="dt_criacao"/>
                            <list-sort-column label="Data desejada" column="dt_desejada"/>
                            <th class="column">Total acumulado</th>
                            <th class="column">Usuário atual</th>
                            <!--<list-sort-column label="Ordem" column="ordem"/>-->
                            <th class="btn-actions">Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in listStore.listData" :key="`item-${item.id}`">
                            <td :style="{'border-left': `12px solid ${item.tipo.cor || '#FFF'}`}">{{item.id}}</td>
                            <td>{{item.titulo}}</td>
                            <td>{{item.tipo.nome}}</td>
                            <td>{{item.situacao.nome}}</td>
                            <td>{{item.projeto.nome}}</td>
                            <td>{{item.dt_criacao | dateEnToBr}}</td>
                            <td>{{item.dt_desejada | dateEnToBr}}</td>
                            <td v-html="duracaoTarefa(item)"></td>
                            <td>{{(item.usuario_timesheet ? item.usuario_timesheet.nome : '') | ucwords}}</td>
                            <!--<td>{{item.ordem}}</td>-->
                            <td class="list-table-nowrap">
                                <div class="btn-actions">
                                    <list-item-action :tarefa="item"/>
                                    <ListShowButton route-name="tarefa.show" :item="item" domain="tarefa"/>
                                    <ListEditButton route-name="tarefa.edit" :item="item" domain="tarefa"/>
                                    <ListDeleteButton :item="item" domain="tarefa"/>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </ListMain>
    </div>
</template>
