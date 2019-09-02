<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'list-show-button',
    props: ['routeName', 'item'],
    computed: {
      ...mapGetters(['permissions']),
      canShow () {
        return this.permissions.some((item) => item === this.routeName)
      }
    }
  }
</script>

<template>
    <v-btn :to="{ name: routeName, params: { id: item.id } }"
           color="primary"
           title="Visualizar"
           v-if="canShow">
        <i class="fas fa-eye"></i>
    </v-btn>
</template>
