<script>
  export default {
    name: 'form-actions',
    props: ['eventClick', 'isDisabled', 'isSubmitted', 'routeBackName'],
    methods: {
      onSend () {
        this.eventClick()
      }
    }
  }
</script>

<template>
    <v-container class="form-actions" grid-list-md align-content-space-between justify-center>
        <v-layout row wrap>
            <v-flex xs12 sm6
                    v-if="routeBackName">
                <v-btn large
                       class="form-btn-cancel"
                       :block="$vuetify.breakpoint.xs"
                       :to="{name: routeBackName}">
                    <i class="fas fa-arrow-left"></i>
                    <span class="pl-2">Voltar</span>
                </v-btn>
            </v-flex>
            <v-flex xs12 sm6 class="text-xs-right">
                <v-btn color="success"
                       large
                       class="form-btn-submit"
                       @click="onSend"
                       :block="$vuetify.breakpoint.xs"
                       :disabled="isDisabled"
                       :loading="isSubmitted">
                    <i class="fas fa-check"></i>
                    <span class="pl-2">{{isSubmitted ? 'Salvando' : 'Salvar'}} Alterações</span>
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<style lang="scss">
    .form-actions {
        padding: 5px 0 25px 0;

        .form-btn-submit {
            margin-right: 0;
        }

        .form-btn-cancel {
            margin-left: 0;
        }
    }
</style>
