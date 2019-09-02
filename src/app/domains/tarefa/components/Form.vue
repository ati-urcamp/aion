<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'
  import AppCard from '../../../../app/components/common/Card.vue'
  import FormSaveActions from '../../../../app/components/form/FormActions.vue'
  import EditContent from './EditContent'

  import helpers from '../../../../mixins/helper'

  export default {
    components: { AppPageHeader, AppCard, FormSaveActions, EditContent },
    mixins: [helpers],
    data () {
      return {
        isSubmitted: false,
        tarefa: null
      }
    },
    async mounted () {
      this.tarefa = this.$route.params.id || null
    },
    methods: {
      onSave () {
        this.$refs.editContent.onSave()
      }
    }
  }
</script>

<template>
    <div class="page-content">

        <app-page-header/>

        <app-card title="Dados do Cadastro" icon="fas fa-file-alt">
            <template slot="content">
                <edit-content :tarefa="tarefa"
                              :submmited.sync="isSubmitted"
                              ref="editContent"/>
            </template>
        </app-card>

        <form-save-actions :event-click="onSave"
                           :is-disabled="isSubmitted"
                           :is-submitted="isSubmitted"
                           route-back-name="tarefa.index"/>

    </div>
</template>
