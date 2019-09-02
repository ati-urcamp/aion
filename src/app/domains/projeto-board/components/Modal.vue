<script>
  import ProjetoApiService from '../../../services/domains/Projeto'
  import bus from '../../../../utils/bus'
  import helpers from '../../../../mixins/helper'

  // Services
  const projetoService = new ProjetoApiService()

  export default {
    name: 'Modal',
    mixins: [helpers],
    props: {
      showModal: {
        default: false,
        type: Boolean
      },
      projeto: {
        default: 0,
        type: Number
      }
    },
    watch: {
      projeto: async function () {
        await this.loadItem(this.projeto)
      }
    },
    data () {
      return {
        isLoadingData: true,
        item: {}
      }
    },
    methods: {
      async loadItem (id) {
        return new Promise((resolve, reject) => {
          if (id) {
            projetoService.get({
              id: id,
              relations: [
                'cliente',
                'tipo',
                'situacao'
              ]
            }).then(response => {
              this.item = { ...response }
              this.isLoadingData = false

              bus.$emit('hide-loader')
              resolve()
            }).catch(e => {
              console.log(e)
              this.isLoadingData = false
              reject(e)
            })
          } else {
            this.isLoadingData = false

            bus.$emit('hide-loader')
            resolve()
          }
        })
      },
      closeModal () {
        this.$emit('update:showModal', false)
        this.$emit('update:projeto', null)
      }
    }
  }
</script>

<template>
    <v-dialog v-model="showModal" persistent max-width="720px" v-if="!isLoadingData">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Detalhes do projeto</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="closeModal">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-container grid-list-lg>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <strong>ID:</strong> {{ item.id }}<br>
                            <strong>Nome:</strong> {{ item.nome }}<br>
                            <strong>Cliente:</strong> {{ item.cliente.nome }}<br>
                            <strong>Responsável:</strong> {{ item.cliente.responsavel }}<br>
                            <strong>Tipo:</strong> {{ item.tipo.nome }}<br>
                            <strong>Situação:</strong> {{ item.situacao.nome }}<br>
                            <strong>Ordem:</strong> {{ item.ordem }}<br>
                            <strong>Criado em:</strong> {{ item.dt_criacao | dateEnToBr }}<br>
                            <strong>Descrição:</strong><br>
                            <div style="white-space: pre-line;" v-html="item.descricao"></div>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeModal" class="elevation-0">Fechar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
