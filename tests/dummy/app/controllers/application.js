import Controller from '@ember/controller'
import { inject as service } from '@ember/service'
import { tracked } from '@glimmer/tracking'

export default class ApplicationController extends Controller {
  @service tarteaucitron

  @tracked googlefontsLoaded = false
  @tracked twitterLoaded = false

  constructor() {
    super(...arguments)
    this.tarteaucitron.addServiceLoadedListener('googlefonts', () => {
      this.googlefontsLoaded = true
      this.tarteaucitron.removeServiceLoadedListener('googlefonts')
    })
    this.tarteaucitron.addServiceLoadedListener('twitter', () => {
      this.twitterLoaded = true
      this.tarteaucitron.removeServiceLoadedListener('twitter')
    })
    this.tarteaucitron.addTACListener('tac.open_alert', () => {
      console.log('Alert is opened')
    })
    this.tarteaucitron.addTACListener('tac.close_alert', () => {
      console.log('Alert is closed')
    })
    setTimeout(() => {
      this.tarteaucitron.addJob('twitter')
    }, 5000)
  }
}
