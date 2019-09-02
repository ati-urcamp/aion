<script>
  import ApiService from '../../services/common/api/Api'

  import { mapActions, mapGetters } from 'vuex'
  import bus from '../../../utils/bus'

  import { clone, cloneDeep, isEmpty, merge } from 'lodash'

  const listService = new ApiService()

  export default {
    name: 'list-main',
    props: {
      isPaginationVisible: { default: true }
    },
    data () {
      return {
        pages: 1,
        currentPage: 1,
        perPage: 50,
        total: 0,
        defaultData: {}
      }
    },
    computed: {
      ...mapGetters(['listStore'])
    },
    methods: {
      ...mapActions([
        'setListOptions',
        'setListData',
        'setListFilters',
        'setListSort'
      ]),

      /**
       * Método que inicializa a lista de componente
       * @param initData
       * @param callback
       */
      async onListInit (initData, callback) {
        bus.$emit('show-loader')
        await listService.setDomain(initData.domain)
        const initOptions = {
          domain: initData.domain,
          page: initData.page || this.currentPage,
          perPage: initData.page || this.perPage,
          data: initData.data || this.defaultData,
          columns: initData.columns || null,
          relations: initData.relations || null
        }
        await this.setListOptions(initOptions)
        if (initOptions.data.orderBy && initOptions.data.orderBy.length > 0) {
          await this.setListSort(initOptions.data.orderBy)
        }
        const response = await this.onSearchRequest(initOptions.data)
        if (typeof callback === 'function') {
          callback(response)
        }
      },

      /**
       * Método que realiza as requisições do componente
       * @param searchRequestData
       */
      async onSearchRequest (searchRequestData) {
        return new Promise(async (resolve, reject) => {
          bus.$emit('show-loader')
          const options = cloneDeep(this.listStore.options)
          options.data = await this.handleSearchData(searchRequestData)
          listService.search(options)
            .then(async (response) => {
              const responseData = await this.processListResponse(options, response)
              this.setListData(responseData)
              this.total = response.total
              this.pages = response.last_page
              bus.$emit('hide-loader')
              resolve(responseData)
            })
            .catch((e) => {
              reject(e)
              bus.$emit('hide-loader')
            })
        })
      },

      /**
       * @param data
       */
      async handleSearchData (data) {
        return new Promise(async (resolve) => {
          const searchData = {...this.listStore.options.data, ...data}
          searchData.orderBy = clone(this.listStore.listSort)
          resolve(searchData)
        })
      },

      /**
       * @param searchData
       * @param response
       */
      async processListResponse (searchData, response) {
        return new Promise(async (resolve) => {
          if (!isEmpty(response) && response.data.length > 0) {
            // Processa a resposta caso seja passado um callback no atributo processResponse
            if (typeof searchData.processResponse === 'function') {
              response.data = searchData.processResponse(response.data)
            }
          } else {
            response.data = []
          }
          resolve(response.data)
        })
      },

      /**
       * Filtra os resultados da listagem
       *
       * @param data
       */
      async onFilter (data) {
        await this.onSearchRequest(data)
      },

      /**
       * Limpa os filtros da listagem e atualiza a mesma
       *
       * @param {Object} data
       */
      async onFilterClean (data) {
        this.currentPage = 1
        await this.onSearchRequest(data)
      },

      /**
       * Ordena os resultados da listagem
       */
      async onSortChange () {
        await this.onSearchRequest({})
      },

      /**
       * Remove um item da listagem
       *
       * @param item
       * @param callback
       */
      async onDestroyItem (item, callback) {
        this.$swal({
          title: 'Deseja realmente remover esse registro?',
          text: 'Essa ação não pode ser revertida!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#4caf50',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim, continuar!',
          cancelButtonText: 'Cancelar'
        })
          .then(() => {
            const { id } = item
            listService.destroy({ domain: this.listStore.options.domain, id: id })
              .then(() => {
                this.onPaginatorChangePage(this.currentPage)
                bus.$emit('hide-loader')
                if (typeof callback === 'function') {
                  callback()
                }
              })
              .catch(e => {
                console.log(e)
                bus.$emit('hide-loader')
                if (typeof callback === 'function') {
                  callback()
                }
              })
          })
          .catch(e => {
            console.log(e)
            bus.$emit('hide-loader')
            if (typeof callback === 'function') {
              callback()
            }
          })
      },

      /**
       * Recarrega a lista quando a quantidade de registros é alterada
       * @param val
       */
      async onPaginatorChangeSize (val) {
        this.perPage = val
        this.onPaginatorChangePage(1, val)
      },

      /**
       * Recarrega a lista quando a paginação é alterada
       * @param page
       * @param perPage
       */
      async onPaginatorChangePage (page, perPage) {
        this.currentPage = page
        let searchData = this.listStore.options
        if (!!page && page > 0) {
          searchData.page = page
        }
        if (!!perPage && perPage > 0) {
          searchData.perPage = perPage
        }
        await this.onSearchRequest(searchData)
      }
    },
    mounted () {
      bus.$on('list-init', (options, callback) => this.onListInit(options, callback))
      bus.$on('list-filter', (data) => this.onFilter(data))
      bus.$on('list-filter-clean', (data) => this.onFilterClean(data))
      bus.$on('list-destroy-item', (item) => this.onDestroyItem(item))
      bus.$on('list-sort-change', (item) => this.onSortChange(item))
    },
    beforeDestroy () {
      this.setListData([])
      bus.$off('list-init')
      bus.$off('list-filter')
      bus.$off('list-filter-clean')
      bus.$off('list-destroy-item')
      bus.$off('list-sort-change')
    }
  }
</script>

<template>
    <div class="list-component">

        <!-- SLOT QUE RENDERIZA OS FILTROS DA LISTAGEM -->
        <slot name="filters" class="list-filters"></slot>

        <!-- SLOT PRINCIPAL QUE RENDERIZA A LISTAGEM -->
        <div class="main-list">
            <slot name="list"></slot>
        </div>

        <!-- SLOT QUE RENDERIZA A PAGINAÇÃO DA LISTAGEM -->
        <v-container grid-list-md>
            <v-layout align-center justify-center row fill-height wrap>
                <v-flex xs12 sm3>
                    <v-select :items="[25, 50, 100, 250, 500]"
                              v-model="perPage"
                              :hide-details="true"
                              @change="onPaginatorChangeSize"
                              style="width:60%;"
                              :class="{'ml-auto mr-auto': $vuetify.breakpoint.xs}"
                              label="Registros por página"></v-select>
                </v-flex>
                <v-flex xs12 sm6 class="text-xs-center">
                    <v-pagination v-model="currentPage"
                                  :total-visible="6"
                                  :depressed="true"
                                  :length="pages"
                                  @input="onPaginatorChangePage">
                    </v-pagination>
                </v-flex>
                <v-flex xs12 sm3 class="text-xs-center text-sm-right list-total-records subheading">
                    <span>Total de Registros: <strong>{{total}}</strong></span>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>
