<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'list-edit-button',
    props: ['routeName', 'item'],
    computed: {
      ...mapGetters(['permissions']),
      canEdit () {
        const domain = this.routeName.split('.')[0]
        return this.permissions.some((item) => item === domain + '.update')
      }
    }
  }
</script>

<template>
    <v-btn :to="{ name: routeName, params: { id: item.id } }"
           color="info"
           title="Editar"
           v-if="canEdit">
        <i class="fas fa-edit"></i>
    </v-btn>
</template>
