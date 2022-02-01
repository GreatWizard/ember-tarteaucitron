'use strict'

const validatePeerDependencies = require('validate-peer-dependencies')
const Funnel = require('broccoli-funnel')
const mergeTrees = require('broccoli-merge-trees')

const defaultOptions = {
  enabled: true,
  importAssets: true,
}

module.exports = {
  name: require('./package').name,

  options: {
    '@embroider/macros': {
      setOwnConfig: {},
    },
  },

  _addonOptions: undefined,
  getAddonOptions() {
    if (this._addonOptions === undefined) {
      this._addonOptions = Object.assign(
        {},
        defaultOptions,
        this._findHost().options[this.name]
      )
    }

    return this._addonOptions
  },

  included(parent) {
    this._super.included.apply(this, arguments)

    validatePeerDependencies(__dirname, {
      resolvePackagePathFrom: this.parent.root,
    })

    this.options['@embroider/macros'].setOwnConfig.config =
      this._findHost().project.config(process.env.EMBER_ENV)

    this._findHost().options.fingerprint.exclude.push('tarteaucitron')

    let addonOptions = this.getAddonOptions()

    if (addonOptions.enabled) {
      this.import('node_modules/tarteaucitronjs/tarteaucitron.js')
    }

    return parent
  },

  treeForPublic(tree) {
    let trees = []
    tree = this._super.treeForPublic.apply(this, arguments)
    if (tree) {
      trees.push(tree)
    }

    let addonOptions = this.getAddonOptions()

    if (addonOptions.enabled && addonOptions.importAssets) {
      trees = trees.concat([
        new Funnel('node_modules/tarteaucitronjs', {
          include: [
            'css/*.css',
            'lang/*.js',
            'advertising.js',
            'tarteaucitron.services.js',
          ],
          destDir: 'assets/tarteaucitron',
        }),
      ])
    }

    return mergeTrees(trees)
  },
}
