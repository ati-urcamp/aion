<script>
  import EditContent from './EditContent'

  export default {
    name: 'EditModal',
    components: { EditContent },
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
    computed: {
      isEdit () {
        return !!this.tarefa
      }
    },
    data () {
      return {
        isSubmitted: false
      }
    },
    methods: {
      closeModal () {
        this.$emit('update:showModal', false)
        this.$emit('update:tarefa', null)
      },
      onSave () {
        this.$refs.editContent.onSave()
      }
    }
  }
</script>

<template>
    <v-dialog v-model="showModal" persistent max-width="960px">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>{{!isEdit ? 'Criar' : 'Editando'}} tarefa</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="closeModal">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <edit-content :tarefa="tarefa"
                              :submmited.sync="isSubmitted"
                              :close-edit-modal="closeModal"
                              ref="editContent"/>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success"
                       class="form-btn-submit elevation-0"
                       @click="onSave"
                       :disabled="isSubmitted"
                       :loading="isSubmitted">
                    <i class="fas fa-check"></i>
                    <span class="pl-2">{{isSubmitted ? 'Salvando' : 'Salvar'}} Alterações</span>
                </v-btn>
                <v-btn @click="closeModal" class="elevation-0">Fechar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
