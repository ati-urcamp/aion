<script>
  import bus from '../../../utils/bus'
  import { mapGetters } from 'vuex'

  export default {
    name: 'list-delete-button',
    props: ['item', 'domain'],
    computed: {
      ...mapGetters(['permissions']),
      canDestroy () {
        return this.permissions.some((item) => item === this.domain + '.destroy')
      }
    },
    methods: {
      onDestroy (item) {
        bus.$emit('list-destroy-item', item)
      }
    }
  }
</script>

<template>
    <v-btn color="error"
           v-if="canDestroy"
           @click="onDestroy(item)"
           title="Remover">
        <i class="fas fa-trash"></i>
    </v-btn>
</template>
