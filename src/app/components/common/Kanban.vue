<script>
  import dragula from 'dragula'

  export default {
    name: 'Kanban',
    props: [
      'stages',
      'cards',
      'stageId',
      'stageTitle',
      'cardId',
      'cardStageId',
      'cardTitle'
    ],
    data () {
      return {}
    },
    methods: {
      getCardsByStage (stage) {
        return this.cards.filter(c => c[this.cardStageId] === stage)
      },
      getTotalCardsByStage (stage) {
        return this.getCardsByStage(stage).length
      }
    },
    mounted () {
      dragula(this.$refs.list)
        .on('drag', (el) => {
          el.classList.add('is-moving')
        })
        .on('drop', (card, list) => {
          let orderedList = []

          for (let i = 0; i < list.children.length; i++) {
            orderedList.push(list.children[i].dataset.cardId)
          }

          this.$emit('update-card', card.dataset.cardId, list.dataset.stage, orderedList)
        })
        .on('dragend', (el) => {
          el.classList.remove('is-moving')

          window.setTimeout(() => {
            el.classList.add('is-moved')
            window.setTimeout(() => {
              el.classList.remove('is-moved')
            }, 600)
          }, 100)
        })
    }
  }
</script>

<template>
    <div class="drag-container-wrapper">
        <div class="drag-container">
            <ul class="drag-list">
                <li v-for="stage in stages" class="drag-column" :key="`stage-${stage[stageId]}`">
                    <div class="drag-column-header">
                        <slot :name="stage[stageId]">
                            <h2>
                                {{ stage[stageTitle] }}
                                <span>({{ getTotalCardsByStage(stage[stageId]) }})</span>
                            </h2>
                        </slot>
                    </div>
                    <div class="drag-options"></div>
                    <div class="drag-inner-list-wrapper">
                        <ul class="drag-inner-list" ref="list" :data-stage="stage[stageId]">
                            <li class="drag-item" v-for="card in getCardsByStage(stage[stageId])"
                                :data-card-id="card[cardId]"
                                :key="`card-${card[cardId]}`">
                                <slot :name="`card-${card[cardId]}`">
                                    <div>
                                        <span class="body-1">{{ card[cardTitle] }}</span>
                                    </div>
                                </slot>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style src="../../../assets/sass/kanban.scss" lang="scss"></style>
