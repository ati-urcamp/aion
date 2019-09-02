import axios from 'axios'
import interceptors from './interceptors'
import baseConfig from '../config'

/**
 * Create axios instance
 */
export const http = axios.create({
  baseURL: baseConfig.fullAPIPath,
  headers: { 'content-type': 'application/json' },
  timeout: 15000
})

/**
 * Set axios Authorization header
 */
export function setToken (token) {
  http.defaults.headers.common.Authorization = `Bearer ${token}`
}

/**
 * Set axios timeout
 */
export function setTimeout (timeout) {
  http.defaults.timeout = timeout
}

/**
 * Export axios as a Vue Plugin
 *
 * @param Vue
 * @param router
 * @param store
 */
export default function install (Vue, { router, store }) {
  interceptors(http, router, store)
}
