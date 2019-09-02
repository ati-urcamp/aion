<script>
  import ShowContent from '../../tarefa/components/ShowContent'

  export default {
    name: 'Modal',
    components: { ShowContent },
    props: {
      showModal: {
        default: false,
        type: Boolean
      },
      tarefa: {
        default: 0,
        type: Number
      }
    },
    methods: {
      closeModal () {
        this.$emit('update:showModal', false)
        this.$emit('update:tarefa', null)
      }
    }
  }
</script>

<template>
    <v-dialog v-model="showModal" persistent max-width="1264px">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Detalhes da tarefa</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="closeModal">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <show-content :tarefa="tarefa"></show-content>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeModal" class="elevation-0">Fechar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
