import { isEmpty } from 'lodash'

export const isLogged = ({ token }) => !isEmpty(token)
export const token = ({ token }) => token
export const currentUser = ({ user }) => user
export const permissions = ({ permissions }) => permissions
export const teamPermissions = ({ teamPermissions }) => teamPermissions
