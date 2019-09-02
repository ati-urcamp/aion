import { routes as login } from './domains/login'
import { routes as cliente } from './domains/cliente'
import { routes as configuracao } from './domains/configuracao'
import { routes as equipe } from './domains/equipe'
import { routes as perfil } from './domains/perfil'
import { routes as permissao } from './domains/permissao'
import { routes as projetoBoard } from './domains/projeto-board'
import { routes as projetoSituacao } from './domains/projeto-situacao'
import { routes as projetoTipo } from './domains/projeto-tipo'
import { routes as projeto } from './domains/projeto'
import { routes as tarefaBoard } from './domains/tarefa-board'
import { routes as tarefaSituacao } from './domains/tarefa-situacao'
import { routes as tarefaTipo } from './domains/tarefa-tipo'
import { routes as tarefa } from './domains/tarefa'
import { routes as usuario } from './domains/usuario'
import { routes as dashboard } from './domains/dashboard'
import { routes as relatorio } from './domains/relatorio'

export default [
  ...login,
  ...cliente,
  ...configuracao,
  ...equipe,
  ...perfil,
  ...permissao,
  ...projetoBoard,
  ...projetoSituacao,
  ...projetoTipo,
  ...projeto,
  ...tarefaBoard,
  ...tarefaSituacao,
  ...tarefaTipo,
  ...tarefa,
  ...usuario,
  ...dashboard,
  ...relatorio
]
