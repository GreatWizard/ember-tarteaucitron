import Controller from '@ember/controller'
import { inject as service } from '@ember/service'
import { tracked } from '@glimmer/tracking'

export default class ApplicationController extends Controller {
  @service tarteaucitron

  @tracked googlefontsLoaded = false
  @tracked facebookpixelLoaded = false

  constructor() {
    super(...arguments)
    this.tarteaucitron.addJob('googlefonts', {
      googleFonts: ['Tangerine'],
    })
    this.tarteaucitron.addServiceLoadedListener('googlefonts', () => {
      this.googlefontsLoaded = true
      this.tarteaucitron.removeServiceLoadedListener('googlefonts')
    })
    this.tarteaucitron.addServiceLoadedListener('facebookpixel', () => {
      this.facebookpixelLoaded = true
      this.tarteaucitron.removeServiceLoadedListener('facebookpixel')
    })
    this.tarteaucitron.addTACListener('tac.open_alert', () => {
      console.log('Alert is opened')
    })
    this.tarteaucitron.addTACListener('tac.close_alert', () => {
      console.log('Alert is closed')
    })
    setTimeout(() => {
      this.tarteaucitron.addJob('facebookpixel')
    }, 5000)
  }
}
