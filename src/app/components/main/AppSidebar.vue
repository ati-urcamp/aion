<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'app-sidebar',
    data () {
      return {
        menu: [
          {
            icon: 'fas fa-user-friends',
            text: 'Clientes',
            route: {
              name: 'cliente.index',
              params: {}
            },
            permissions: ['menu.cliente']
          },
          {
            icon: 'fas fa-cubes',
            text: 'Projetos',
            permissions: [
              'menu.projeto',
              'menu.projeto-situacao',
              'menu.projeto-tipo',
              'menu.projeto-board'
            ],
            children: [
              {
                icon: 'fas fa-cubes',
                text: 'Gerenciar projetos',
                route: {
                  name: 'projeto.index',
                  params: {}
                },
                permissions: ['menu.projeto']
              },
              {
                icon: 'fas fa-font',
                text: 'Situações',
                route: {
                  name: 'projeto-situacao.index',
                  params: {}
                },
                permissions: ['menu.projeto-situacao']
              },
              {
                icon: 'fas fa-list',
                text: 'Tipos',
                route: {
                  name: 'projeto-tipo.index',
                  params: {}
                },
                permissions: ['menu.projeto-tipo']
              },
              {
                icon: 'fas fa-chess-board',
                text: 'Board',
                route: {
                  name: 'projeto-board.index',
                  params: {}
                },
                permissions: ['menu.projeto-board']
              }
            ]
          },
          {
            icon: 'fas fa-clipboard-list',
            text: 'Tarefas',
            permissions: [
              'menu.tarefa',
              'menu.tarefa-situacao',
              'menu.tarefa-tipo',
              'menu.tarefa-board'
            ],
            children: [
              {
                icon: 'fas fa-clipboard-list',
                text: 'Gerenciar tarefas',
                route: {
                  name: 'tarefa.index',
                  params: {}
                },
                permissions: ['menu.tarefa']
              },
              {
                icon: 'fas fa-font',
                text: 'Situações',
                route: {
                  name: 'tarefa-situacao.index',
                  params: {}
                },
                permissions: ['menu.tarefa-situacao']
              },
              {
                icon: 'fas fa-list',
                text: 'Tipos',
                route: {
                  name: 'tarefa-tipo.index',
                  params: {}
                },
                permissions: ['menu.tarefa-tipo']
              },
              {
                icon: 'fas fa-chess-board',
                text: 'Board',
                route: {
                  name: 'tarefa-board.index',
                  params: {}
                },
                permissions: ['menu.tarefa-board']
              }
            ]
          },
          {
            icon: 'fas fa-people-carry',
            text: 'Equipes',
            route: {
              name: 'equipe.index',
              params: {}
            },
            permissions: ['menu.equipe']
          },
          {
            icon: 'fas fa-users',
            text: 'Usuários',
            route: {
              name: 'usuario.index',
              params: {}
            },
            permissions: ['menu.usuario']
          },
          {
            icon: 'fas fa-scroll',
            text: 'Perfis',
            route: {
              name: 'perfil.index',
              params: {}
            },
            permissions: ['menu.perfil']
          },
          {
            icon: 'fas fa-key',
            text: 'Permissões',
            route: {
              name: 'permissao.index',
              params: {}
            },
            permissions: ['menu.permissao']
          },
          {
            icon: 'fas fa-cog',
            text: 'Configurações',
            route: {
              name: 'configuracao.index',
              params: {}
            },
            permissions: ['menu.configuracao']
          },
          {
            icon: 'fas fa-chart-bar',
            text: 'Relatórios',
            route: {
              name: 'relatorio.index',
              params: {}
            },
            permissions: ['menu.relatorio']
          }
        ]
      }
    },
    computed: {
      ...mapGetters(['showSidebar', 'currentUser', 'permissions']),
      drawer: {
        get: function () {
          return this.showSidebar
        },
        set: function (value) {
          this.toggleSidebar(value)
        }
      }
    },
    methods: {
      ...mapActions(['toggleSidebar']),
      can (permissions) {
        return this.permissions.some((item) => {
          return permissions.length === 0 || permissions.some(permission => permission === item)
        })
      }
    }
  }
</script>

<template>
  <v-navigation-drawer v-model="drawer"
                       class="sidebar-list"
                       fixed
                       clipped
                       app>

    <router-link :to="{name: 'home'}" class="sidebar-logo hidden-sm-and-up">
      <img src="https://www.urcamp.edu.br/site/img/logos/logo-preto.png" alt="">
    </router-link>

    <v-list>
      <template v-for="(item, index) in menu">
        <v-list-tile v-if="!item.children && can(item.permissions)" :to="{name: item.route.name}" :key="index">
          <v-list-tile-action>
            <v-icon color="orange darken-1">{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>{{item.text}}</v-list-tile-title>
        </v-list-tile>

        <v-list-group v-if="item.children && can(item.permissions)" value="true" :key="index">
          <v-list-tile slot="activator">
            <v-list-tile-action>
              <v-icon color="orange darken-3">{{item.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>{{item.text}}</v-list-tile-title>
          </v-list-tile>

          <template v-for="(child, childIndex) in item.children">
            <router-link class="v-list__tile v-list__tile--link theme--light"
                         exact-active-class="primary--text v-list__tile--active"
                         :to="{name: child.route.name}"
                         :key="childIndex"
                         exact
                         v-if="can(child.permissions)">
              <v-list-tile-action>
                <v-icon color="orange darken-1">{{child.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>{{child.text}}</v-list-tile-title>
            </router-link>
          </template>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style src="../../../assets/sass/sidebar.scss" lang="scss"></style>
