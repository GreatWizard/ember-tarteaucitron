/* global tarteaucitron */
import Service from '@ember/service'
import { tracked } from '@glimmer/tracking'
import { getOwnConfig } from '@embroider/macros'
const { rootURL, tarteaucitron: tacConfig } = getOwnConfig().config

const DEFAULT_OPTIONS = {
  cdn: `${rootURL}assets/tarteaucitron/`,
  customServices: [],
  preInit: {},
  config: {},
  user: {},
  jobs: [],
}

const EVENT_ADDED_SUFFIX = '_added'
const EVENT_LOADED_SUFFIX = '_loaded'
const EVENTS = [
  'tac.root_available',
  'tac.open_alert',
  'tac.close_alert',
  'tac.open_panel',
  'tac.close_panel',
]

export default class TarteaucitronService extends Service {
  listeners = {}

  @tracked jobs = []

  constructor() {
    super(...arguments)
    if (window.tarteaucitron) {
      this._init(Object.assign({}, DEFAULT_OPTIONS, tacConfig))
    }
  }

  _refreshJobs() {
    this.jobs = tarteaucitron.job
  }

  _init(tacConfig) {
    Object.keys(tacConfig?.preInit || {}).forEach(
      (key) => (window[key] = tacConfig.preInit[key])
    )

    tarteaucitron.services = tarteaucitron.services || []
    tacConfig?.customServices?.forEach((service) =>
      tarteaucitron.services.push(service)
    )

    Object.keys(tacConfig?.preInit || {}).forEach(
      (key) => (window[key] = tacConfig.preInit[key])
    )

    if (tacConfig?.preInit?.tarteaucitronForceCDN) {
      tarteaucitron.cdn = tacConfig.preInit.tarteaucitronForceCDN
    }

    tarteaucitron.init(tacConfig.config || {})

    tarteaucitron.user = tacConfig.user || {}

    tarteaucitron.job = tarteaucitron.job || []
    tacConfig?.jobs?.forEach((job) => {
      tarteaucitron.job.push(job)
    })
    this._refreshJobs()
  }

  addJob(job, user = {}) {
    Object.assign(tarteaucitron.user, user)
    tarteaucitron.job.push(job)
    this._refreshJobs()
  }

  _addListener(context, name, callback, suffix = '') {
    let event = `${name}${suffix}`
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
    context.addEventListener(event, callback)
  }

  _removeListener(context, name, callback, suffix = '') {
    let event = `${name}${suffix}`
    if (!this.listeners[event] || !this.listeners[event].length === 0) {
      return
    }
    if (callback) {
      this.listeners[event] = this.listeners[event].filter(
        (listener) => listener !== callback
      )
      context.removeEventListener(event, callback)
    } else {
      this.listeners[event].forEach((listener) => {
        context.removeEventListener(event, listener)
      })
      this.listeners[event] = []
    }
  }

  addServiceAddedListener(name, callback) {
    this._addListener(document, name, callback, EVENT_ADDED_SUFFIX)
  }

  removeServiceAddedListener(name, callback) {
    this._removeListener(document, name, callback, EVENT_ADDED_SUFFIX)
  }

  addServiceLoadedListener(name, callback) {
    this._addListener(document, name, callback, EVENT_LOADED_SUFFIX)
  }

  removeServiceLoadedListener(name, callback) {
    this._removeListener(document, name, callback, EVENT_LOADED_SUFFIX)
  }

  addTACListener(name, callback) {
    if (!EVENTS.includes(name)) {
      throw new Error(`${name} is not a valid event`)
    }
    this._addListener(window, name, callback)
  }

  removeTACListener(name, callback) {
    if (!EVENTS.includes(name)) {
      throw new Error(`${name} is not a valid event`)
    }
    this._addListener(window, name, callback)
  }
}
