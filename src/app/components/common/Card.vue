<script>
  export default {
    name: 'common-card',
    props: ['title', 'icon']
  }
</script>

<template>
    <v-card class="common-card">
        <v-card-title class="grey lighten-2">
            <div class="flex-header">
                <div class="flex-header-title">
                    <i class="fas fa-file-alt" v-if="icon"></i>
                    <span class="font-weight-medium" :class="{'pl-2': icon}">{{title}}</span>
                </div>
                <div class="flex-header-actions">
                    <slot name="buttons"></slot>
                </div>
            </div>
        </v-card-title>
        <v-card-text>
            <slot name="content"></slot>
        </v-card-text>
    </v-card>
</template>

<style lang="scss">
    @media all and (max-width: 768px) {
        .common-card {
            > .v-card__text {
                padding: 8px !important;
                > form > .container {
                    padding: 8px !important;
                }
            }
        }
    }
</style>
