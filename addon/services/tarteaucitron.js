/* global tarteaucitron */
import Service from '@ember/service'
import { getOwner } from '@ember/application'

const DEFAULT_OPTIONS = {
  customServices: [],
  preInit: {},
  config: {},
  user: {},
  jobs: [],
}

export default class TarteaucitronService extends Service {
  constructor() {
    super(...arguments)
    if (window.tarteaucitron) {
      let { tarteaucitron: tacConfig } =
        getOwner(this).resolveRegistration('config:environment')
      this._init(Object.assign({}, DEFAULT_OPTIONS, tacConfig))
    }
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

    tarteaucitron.init(tacConfig.config || {})

    tarteaucitron.user = tacConfig.user || {}

    tarteaucitron.job = tarteaucitron.job || []
    tacConfig?.jobs?.forEach((job) => tarteaucitron.job.push(job))
  }
}
