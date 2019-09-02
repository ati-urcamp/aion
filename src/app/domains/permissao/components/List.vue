<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'
  import ListMain from '../../../../app/components/list/Main.vue'
  import ListSortColumn from '../../../../app/components/list/SortColumn.vue'
  import ListEditButton from '../../../../app/components/list/EditButton.vue'
  import ListDeleteButton from '../../../../app/components/list/DeleteButton.vue'

  import bus from '../../../../utils/bus'
  import { mapGetters } from 'vuex'

  export default {
    components: { AppPageHeader, ListMain, ListSortColumn, ListEditButton, ListDeleteButton },
    data () {
      return {
        isLoadingData: true,
        filters: {
          nome: ''
        },
        dependencies: {},
        defaultSort: [{ column: 'id', direction: 'DESC' }]
      }
    },
    mounted () {
      this.listStore.listSort = this.defaultSort

      bus.$emit('list-init', { domain: 'permissao' }, () => {
        this.isLoadingData = false
      })
    },
    computed: {
      ...mapGetters(['listStore'])
    },
    methods: {
      onFilter () {
        const searchData = {}

        if (this.filters.nome) {
          searchData.nome = this.filters.nome
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
      }
    }
  }
</script>

<template>
    <div class="page-content">

        <app-page-header store-route-name="permissao.create"/>

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
                            <list-sort-column label="Nome" column="nome"/>
                            <list-sort-column label="Nome legível" column="nome_legivel"/>
                            <th class="btn-actions">Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in listStore.listData" :key="`item-${item.id}`">
                            <td>{{item.id}}</td>
                            <td>{{item.nome}}</td>
                            <td>{{item.nome_legivel}}</td>
                            <td class="list-table-nowrap">
                                <div class="btn-actions">
                                    <ListEditButton route-name="permissao.edit" :item="item" domain="permissao"/>
                                    <ListDeleteButton :item="item" domain="permissao"/>
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
