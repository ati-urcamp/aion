import axios from 'axios'
import ApiService from './api/Api'
import bus from '../../../utils/bus'
import helpers from '../../../mixins/helper'
import store from '../../../vuex'

const dataService = new ApiService({})

export default {
  async get (domains) {
    // Lista de requisições que serão executadas
    const promises = []
    // Lista de respostas das requisições
    const responses = {}

    if (domains !== undefined && domains.length > 0) {
      bus.$emit('show-loader')
      // Percorre a lista de domains solicitada
      domains.forEach(async function (val) {
        if (val !== undefined) {
          val.route = val.route || null
          let defaultData = {
            orderBy: [
              {
                column: 'nome',
                direction: 'ASC'
              }
            ]
          }
          let data = val.data || defaultData
          dataService.setDomain(val.domain)
          switch (val.domain) {
            case 'cliente':
              promises.push(dataService.search({ domain: 'cliente', route: val.route, data, perPage: 9999 }))
              responses.clientes = []
              break
            case 'equipe':
              data = {
                orderBy: [
                  { column: 'arvore_humanizada', direction: 'ASC' }
                ]
              }

              promises.push(dataService.search({ domain: 'equipe', route: val.route, data, perPage: 9999 }))
              responses.equipes = []
              break
            case 'equipe-usuario':
              data = {
                id: { in: store.getters.teamPermissions },
                orderBy: [
                  { column: 'arvore_humanizada', direction: 'ASC' }
                ]
              }

              promises.push(dataService.search({ domain: 'equipe', route: val.route, data, perPage: 9999 }))
              responses.equipes = []
              break
            case 'projeto':
              promises.push(dataService.search({ domain: 'projeto', route: val.route, data, perPage: 9999 }))
              responses.projetos = []
              break
            case 'projeto-tipo':
              promises.push(dataService.search({ domain: 'projeto-tipo', route: val.route, data, perPage: 9999 }))
              responses.tipos_projeto = []
              break
            case 'projeto-situacao':
              data = {
                orderBy: [
                  { column: 'ordem', direction: 'ASC' },
                  { column: 'nome', direction: 'ASC' }
                ]
              }

              promises.push(dataService.search({ domain: 'projeto-situacao', route: val.route, data, perPage: 9999 }))
              responses.situacoes_projeto = []
              break
            case 'tarefa-situacao':
              data = {
                orderBy: [
                  { column: 'ordem', direction: 'ASC' },
                  { column: 'nome', direction: 'ASC' }
                ]
              }

              promises.push(dataService.search({ domain: 'tarefa-situacao', route: val.route, data, perPage: 9999 }))
              responses.situacoes_tarefa = []
              break
            case 'tarefa-tipo':
              promises.push(dataService.search({ domain: 'tarefa-tipo', route: val.route, data, perPage: 9999 }))
              responses.tipos_tarefa = []
              break
            case 'usuario':
              let usuarios = []

              data = {
                fl_ativo: { '=': 't' },
                orderBy: [
                  { column: 'nome', direction: 'ASC' }
                ]
              }

              dataService.search({ domain: 'usuario', route: val.route, data, perPage: 9999 }).then(result => {
                result.data.forEach((usuario) => {
                  usuario.nome = helpers.methods.ucwords(usuario.nome)
                  usuarios.push(usuario)
                })
              })

              promises.push(new Promise(resolve => resolve(usuarios)))
              responses.usuarios = []
              break
            case 'dia-semana':
              const diasSemana = [
                { text: 'Domingo', value: 0 },
                { text: 'Segunda', value: 1 },
                { text: 'Terça', value: 2 },
                { text: 'Quarta', value: 3 },
                { text: 'Quinta', value: 4 },
                { text: 'Sexta', value: 5 },
                { text: 'Sábado', value: 6 }
              ]

              promises.push(new Promise(resolve => resolve(diasSemana)))
              responses.dias_semana = []
              break
            case 'permissao':
              promises.push(dataService.search({ domain: 'permissao', route: val.route, data, perPage: 9999 }))
              responses.permissoes = []
              break
            case 'perfil':
              promises.push(dataService.search({ domain: 'perfil', route: val.route, data, perPage: 9999 }))
              responses.perfis = []
              break
            default:
              console.warn(`Data service: '${val.domain}' não encontrado`)
              break
          }
        }
      })
    }

    let loopCounter = 0

    /**
     * Realiza todas as requisições e atribui os resultados ao objeto response
     * @type {Promise<any>}
     */
    const data = axios.all(promises)
      .then((result) => {
        for (let index in responses) {
          if (result[loopCounter] !== undefined) {
            if (result[loopCounter].data !== undefined) {
              responses[index] = result[loopCounter].data
            } else {
              responses[index] = result[loopCounter]
            }
          } else {
            responses[index] = []
          }
          loopCounter++
        }
        return responses
      })

    /**
     * Retorna uma nova Promise com o resultado das requisições
     * Exemplo de retorno:
     * {
     *      clientes: [],
     *      produtos: []
     *  }
     */
    return new Promise((resolve) => {
      resolve(data)
    })
  }
}
