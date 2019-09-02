<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'app-page-header',
    props: ['storeRouteName', 'editRouteName', 'backRouteName', 'item'],
    data () {
      return {
        breadcrumbItems: []
      }
    },
    mounted () {
      this.atualizarBreadcrumb()
    },
    computed: {
      ...mapGetters(['permissions']),
      canCreate () {
        if (this.storeRouteName) {
          const domain = this.storeRouteName.split('.')[0]
          return this.permissions.some((item) => item === domain + '.store')
        }

        return false
      },
      tituloPagina: function () {
        return this.$router.currentRoute.meta.name
      },
      tituloAcao: function () {
        return this.$router.currentRoute.meta.singularName
      }
    },
    watch: {
      '$route': function () {
        this.atualizarBreadcrumb()
      }
    },
    methods: {
      atualizarBreadcrumb () {
        this.breadcrumbItems.push({ name: 'Início', to: 'home' })

        if (this.$router.currentRoute.meta.breadcrumb) {
          this.breadcrumbItems.push(...this.$router.currentRoute.meta.breadcrumb)
        }

        this.breadcrumbItems.push({ name: this.tituloPagina })
      }
    }
  }
</script>

<template>
    <div class="page-header-content">
        <ul class="v-breadcrumbs">
            <template v-for="(item, index) in breadcrumbItems">
                <li :key="`item-${index}`">
                    <router-link :to="{name: item.to}" v-if="item.to">{{item.name}}</router-link>
                    <span v-if="!item.to" class="breadcrumbs-simple">{{item.name}}</span>
                </li>
                <li class="v-breadcrumbs__divider" v-if="index < (breadcrumbItems.length - 1)"
                    :key="`item-divider-${index}`">/
                </li>
            </template>
        </ul>
        <v-container fluid class="page-header-container">
            <v-layout row wrap>
                <v-flex xs12 sm6 class="hidden-xs-only">
                    <span class="page-title">{{tituloPagina}}</span>
                </v-flex>
                <v-flex xs12 sm6 class="text-xs-right buttons">
                    <slot name="content"></slot>
                    <v-btn :to="{ name: storeRouteName }"
                           v-if="canCreate"
                           large
                           color="primary"
                           :block="$vuetify.breakpoint.xs">
                        <i class="fas fa-plus"></i>
                        <span class="pl-2">Criar {{tituloAcao}}</span>
                    </v-btn>
                    <v-btn :to="{ name: editRouteName, params: { id: item.id } }"
                           v-if="editRouteName && item"
                           large
                           color="info"
                           :block="$vuetify.breakpoint.xs">
                        <i class="fas fa-edit"></i>
                        <span class="pl-2">Editar</span>
                    </v-btn>
                    <v-btn :to="{ name: backRouteName }"
                           v-if="backRouteName"
                           large
                           :block="$vuetify.breakpoint.xs">
                        <i class="fas fa-arrow-left"></i>
                        <span class="pl-2">Voltar</span>
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<style lang="scss">
    .v-breadcrumbs {
        margin: 0;
        padding: 0 0 10px;
        list-style: none;

        li {
            color: #878787;

            a {
                text-decoration: none;
                color: #4C7C48;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }

    .page-header-container {
        padding: 0 0 5px;

        .buttons {
            .v-btn {
                margin-right: 0;
            }
        }
    }
</style>
