<script>
  export default {
    name: 'common-child-card',
    props: ['title', 'icon']
  }
</script>

<template>
    <v-card class="child-card" elevation="0">
        <v-card-title class="child-card-title grey lighten-2">
            <div class="flex-header">
                <div class="flex-header-title">
                    <span class="font-weight-medium">{{title}}</span>
                </div>
            </div>
        </v-card-title>
        <v-card-text>
            <slot></slot>
        </v-card-text>
    </v-card>
</template>
