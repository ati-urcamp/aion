<script>
  import { mapActions, mapGetters } from 'vuex'
  import bus from '../../../utils/bus'

  import { clone } from 'lodash'

  export default {
    name: 'list-sort-column',
    props: ['label', 'column', 'align'],
    computed: {
      ...mapGetters(['listStore']),
      getSortItem: function () {
        return this.listStore.listSort.find(item => item.column === this.column)
      },
      itemDirection: function () {
        return this.getSortItem ? this.getSortItem.direction : null
      }
    },
    methods: {
      ...mapActions(['setListSort']),
      changeSort () {
        const list = clone(this.listStore.listSort)
        const sort = clone(this.getSortItem)
        if (!sort) {
          list.push({ column: this.column, direction: 'ASC' })
        } else {
          const sortIndex = list.findIndex(item => item.column === this.column)
          if (sort.direction === 'DESC') {
            list.splice(sortIndex, 1)
          } else if (sort.direction === 'ASC') {
            sort.direction = 'DESC'
            list.splice(sortIndex, 1, sort)
          }
        }
        this.setListSort(list)
        setTimeout(() => {
          bus.$emit('list-sort-change')
        }, 100)
      }
    }
  }
</script>

<template>
    <th class="column sortable"
        :class="{
            'asc': itemDirection === 'ASC',
            'desc': itemDirection === 'DESC',
            'active': itemDirection,
            'text-xs-center': align === 'center',
            'text-xs-right': align === 'right',
            'text-xs-left': align === 'left'
        }"
        @click="changeSort">
        {{label}}
        <v-icon>arrow_upward</v-icon>
    </th>
</template>
