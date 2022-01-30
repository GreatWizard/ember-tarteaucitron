# ember-tarteaucitron

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
      customServices: [], // You can define your own services directly here, see https://github.com/AmauriC/tarteaucitron.js#create-custom-service
      preInit: { // Change some settings before the initialization of tarteaucitron.js
        tarteaucitronForceCDN: '', // Force an URL to loads assets (default to current path)
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
      jobs: ['googlefonts'], // Jobs name to register
      user: { // Configuration used by jobs
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

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
