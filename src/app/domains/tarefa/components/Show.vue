<script>
  import AppPageHeader from '../../../../app/components/main/PageHeader.vue'
  import AppCard from '../../../../app/components/common/Card.vue'
  import ShowContent from './ShowContent'

  export default {
    components: { AppPageHeader, AppCard, ShowContent }
  }
</script>

<template>
    <div class="page-content">

        <app-page-header back-route-name="tarefa.index"/>

        <app-card title="Dados da Tarefa" icon="fas fa-file-alt">
            <template slot="content">
                <show-content :tarefa="Number($route.params.id)"></show-content>
            </template>
        </app-card>

    </div>
</template>
