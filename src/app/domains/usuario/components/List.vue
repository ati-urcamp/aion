<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'
  import ListMain from '../../../../app/components/list/Main.vue'
  import ListSortColumn from '../../../../app/components/list/SortColumn.vue'
  import ListEditButton from '../../../../app/components/list/EditButton.vue'
  import ListDeleteButton from '../../../../app/components/list/DeleteButton.vue'

  import bus from '../../../../utils/bus'
  import { mapGetters } from 'vuex'

  import DataService from '../../../services/common/data'

  export default {
    components: { AppPageHeader, ListMain, ListSortColumn, ListEditButton, ListDeleteButton },
    data () {
      return {
        isLoadingData: true,
        filters: {
          nome: '',
          ativo: null,
          equipe: null
        },
        dependencies: {
          itensFiltroAtivo: [
            { text: 'Sim', value: true },
            { text: 'Não', value: false }
          ],
          equipes: []
        },
        defaultSort: [{ column: 'id', direction: 'DESC' }]
      }
    },
    async mounted () {
      this.listStore.listSort = this.defaultSort

      bus.$emit('list-init', { domain: 'usuario', relations: ['equipe'] }, () => {
        this.isLoadingData = false
      })

      await this.getDependencies()
    },
    computed: {
      ...mapGetters(['listStore'])
    },
    methods: {
      async getDependencies () {
        return new Promise(resolve => {
          DataService.get([{ domain: 'equipe' }]).then(result => {
            this.dependencies.equipes = result.equipes
            resolve()
          })
        })
      },
      onFilter () {
        const searchData = {}

        if (this.filters.nome) {
          searchData.nome = { 'ilike': '%' + this.filters.nome + '%' }
        }

        if (this.filters.ativo !== null) {
          searchData.fl_ativo = { '=': this.filters.ativo }
        }

        if (this.filters.equipe !== null) {
          searchData.ref_equipe = { '=': this.filters.equipe }
        }

        bus.$emit('list-filter', searchData)
      },
      onFilterClean () {
        this.listStore.listSort = this.defaultSort

        this.filters = {}
        bus.$emit('list-filter-clean', this.filters)
      },
      onDestroy (item) {
        bus.$emit('list-destroy-item', item)
      },
      filtrarEquipe (item, queryText, itemText) {
        return item.arvore_humanizada.toLowerCase().includes(queryText.toString().toLowerCase())
      }
    }
  }
</script>

<template>
    <div class="page-content">

        <app-page-header store-route-name="usuario.create"/>

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
                                <v-layout row wrap>
                                    <v-flex xs12 sm6 md3 lg2>
                                        <v-text-field v-model="filters.nome"
                                                      label="Nome"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md3 lg2>
                                        <v-select v-model="filters.ativo"
                                                  :items="dependencies.itensFiltroAtivo"
                                                  label="Ativo"
                                        ></v-select>
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
                            <list-sort-column label="Login" column="login"/>
                            <list-sort-column label="Nome" column="nome"/>
                            <th class="column">E-mail</th>
                            <th class="column">Ativo</th>
                            <th class="column">Equipe</th>
                            <th class="column">Valor/hora</th>
                            <th class="btn-actions">Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in listStore.listData" :key="`item-${item.id}`">
                            <td>{{item.id}}</td>
                            <td>{{item.login}}</td>
                            <td>{{item.nome}}</td>
                            <td>{{item.email}}</td>
                            <td>{{item.fl_ativo ? 'Sim' : 'Não'}}</td>
                            <td>{{item.equipe.arvore_humanizada}}</td>
                            <td>R$ {{item.valor_hora | currencyEnToBr}}</td>
                            <td class="list-table-nowrap">
                                <div class="btn-actions">
                                    <ListEditButton route-name="usuario.edit" :item="item" domain="usuario"/>
                                    <ListDeleteButton :item="item" domain="usuario"/>
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
