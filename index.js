'use strict'

const validatePeerDependencies = require('validate-peer-dependencies')
const Funnel = require('broccoli-funnel')
const mergeTrees = require('broccoli-merge-trees')

const defaultOptions = {
  enabled: true,
}

module.exports = {
  name: require('./package').name,

  _options: undefined,

  options() {
    if (!this._options) {
      let app = this._findHost()
      this._options = Object.assign({}, defaultOptions, app.options[this.name])
    }

    return this._options
  },

  included(parent) {
    this._super.included.apply(this, arguments)

    validatePeerDependencies(__dirname, {
      resolvePackagePathFrom: this.parent.root,
    })

    let options = this.options()

    if (options.enabled) {
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

    let options = this.options()

    if (options.enabled) {
      trees = trees.concat([
        new Funnel('node_modules/tarteaucitronjs', {
          include: [
            'css/*.css',
            'lang/*.js',
            'advertising.js',
            'tarteaucitron.services.js',
          ],
          destDir: 'assets',
        }),
      ])
    }

    return mergeTrees(trees)
  },
}
