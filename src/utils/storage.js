import localForage from 'localforage'

export const storage = localForage.createInstance({ name: 'aion' })

export const get = (item) => storage.getItem(item).then(v => v)

export const set = (item, value) => storage.setItem(item, value).then(() => get(item))

export const remove = (item) => storage.removeItem(item)

export const clear = () => storage.clear()
