import Application from '@ember/application'

import config from 'dummy/config/environment'
import { initialize } from 'dummy/instance-initializers/tarteaucitron'
import { module, test } from 'qunit'
import Resolver from 'ember-resolver'
import { run } from '@ember/runloop'
import Service from '@ember/service'

module('Unit | Instance Initializer | tarteaucitron', function (hooks) {
  hooks.beforeEach(function () {
    this.TestApplication = class TestApplication extends Application {
      modulePrefix = config.modulePrefix
      podModulePrefix = config.podModulePrefix
      Resolver = Resolver
    }
    this.TestApplication.instanceInitializer({
      name: 'initializer under test',
      initialize,
    })
    this.application = this.TestApplication.create({ autoboot: false })
    this.instance = this.application.buildInstance()
  })

  hooks.afterEach(function () {
    run(this.instance, 'destroy')
    run(this.application, 'destroy')
  })

  test('it loads the service', async function (assert) {
    assert.expect(1)
    this.instance.register(
      'service:tarteaucitron',
      class MockService extends Service {
        constructor() {
          super(...arguments)
          assert.ok(true, 'MockService was created')
        }
      }
    )
    await this.instance.boot()
  })
})
