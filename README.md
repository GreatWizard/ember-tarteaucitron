# ember-tarteaucitron

[![CI](https://github.com/GreatWizard/ember-tarteaucitron/actions/workflows/ci.yml/badge.svg)](https://github.com/GreatWizard/ember-tarteaucitron/actions/workflows/ci.yml)
[![Ember Observer Score](https://emberobserver.com/badges/ember-tarteaucitron.svg)](https://emberobserver.com/addons/ember-tarteaucitron)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Liberapay](https://img.shields.io/liberapay/patrons/GreatWizard.svg?logo=liberapay)](https://liberapay.com/GreatWizard/)

Ember integration of [tarteaucitron.js](https://github.com/AmauriC/tarteaucitron.js), a RGPD friendly cookie manager.

## Compatibility

- Ember.js v3.24 or above
- Ember CLI v3.24 or above
- Node.js v12 or above

## Installation

```
ember install ember-tarteaucitron
```

## Usage

All your tarteaucitron configuration is stored inside your `config/environement.js` as follow:

```js
module.exports = function (environment) {
  let ENV = {

    [...]

    tarteaucitron: {
      cdn: "https://...", // Define where the tarteaucitron assets are available, default to <your-app>/assets/tarteaucitron/
      customServices: [], // You can define your own services directly here, see https://github.com/AmauriC/tarteaucitron.js#create-custom-service
      preInit: { // Change some settings before the initialization of tarteaucitron.js
        tarteaucitronForceLanguage: 'en', // Force the display language (default to the current browser language)
        tarteaucitronForceExpire: 365 * 10, // Force the expire cookie time (default to 365)
        tarteaucitronCustomText: { // Change a translation, see https://github.com/AmauriC/tarteaucitron.js#customize-text
          'support': {
            'title': 'Support client',
          },
          'close': 'Enregistrer et fermer',
          'engage-twitter': 'Suivez-nous sur Twitter !',
        },
      },
      config: {}, // tarteaucitron init configuration, see https://github.com/AmauriC/tarteaucitron.js#how-to-use
      jobs: ['googlefonts'], // Services name to activate
      user: { // Configuration used by services
        googleFonts: ['Tangerine'], // Configuration for googlefonts
      },
    },
  }

  [...]

  return ENV
}
```

If you need to deactivate `ember-tarteaucitron`, you can configure on your `ember-cli-build.js` file as follow:

```js
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon')

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    'ember-tarteaucitron': {
      enabled: true, // Enabled by default
    },
  })

  [...]
}
```

### API

The service `tarteaucitron` exposes functions in order to add new jobs programmatically and listen to events.

#### Setup a new job

- `addJob(name, config)`: Add a new job with configuration

#### Service events

- `addServiceAddedListener(name, callback)`: listener called when a service is added
- `removeServiceAddedListener(name, callback)`: remove the listener when a service is added
- `addServiceLoadedListener(name, callback)`: listener called when a service is loaded
- `removeServiceLoadedListener(name, callback)`: remove the listener when a service is loaded

The service names are defined in `tarteaucitron`: https://github.com/AmauriC/tarteaucitron.js/blob/master/tarteaucitron.services.js

#### Tarteaucitron events

- `addTACListener(name, callback)`: listener when an event occurred
- `removeTACListener(name, callback)`: remove listener when an event occurred

The following events are available:

- **tac.root_available**: the root element with panel has been created, services will be loaded
- **tac.open_alert**: the alert is opened
- **tac.close_alert**: the alert is closed
- **tac.open_panel**: the panel is opened
- **tac.close_panel**: the panel is closed

##### Code example

```js
import Controller from '@ember/controller'
import { service } from '@ember/service'
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
    setTimeout(() => {
      this.tarteaucitron.addJob('facebookpixel')
    }, 5000)
  }
}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
