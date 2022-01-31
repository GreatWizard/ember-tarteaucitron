import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | tarteaucitron', function (hooks) {
  setupTest(hooks)

  hooks.beforeEach(function () {
    window.tarteaucitron.job = []
    window.tarteaucitron.user = {}
  })

  test('it adds job', function (assert) {
    assert.expect(3)
    let service = this.owner.lookup('service:tarteaucitron')
    service.addJob('googlefonts', { families: ['Roboto:400,700'] })
    assert.deepEqual(service.jobs, ['googlefonts'])
    assert.deepEqual(window.tarteaucitron.job, ['googlefonts'])
    assert.deepEqual(window.tarteaucitron.user, {
      families: ['Roboto:400,700'],
    })
  })

  test('it adds/removes service added listener', function (assert) {
    assert.expect(4)
    let service = this.owner.lookup('service:tarteaucitron')
    let noop = () => {}
    service.addServiceAddedListener('googlefonts', noop)
    assert.strictEqual(service.listeners.googlefonts_added.length, 1)
    service.removeServiceAddedListener('googlefonts', noop)
    assert.strictEqual(service.listeners.googlefonts_added.length, 0)
    service.addServiceAddedListener('googlefonts', noop)
    assert.strictEqual(service.listeners.googlefonts_added.length, 1)
    service.removeServiceAddedListener('googlefonts')
    assert.strictEqual(service.listeners.googlefonts_added.length, 0)
  })

  test('it adds/removes service loaded listener', function (assert) {
    assert.expect(4)
    let service = this.owner.lookup('service:tarteaucitron')
    let noop = () => {}
    service.addServiceLoadedListener('googlefonts', noop)
    assert.strictEqual(service.listeners.googlefonts_loaded.length, 1)
    service.removeServiceLoadedListener('googlefonts', noop)
    assert.strictEqual(service.listeners.googlefonts_loaded.length, 0)
    service.addServiceLoadedListener('googlefonts', noop)
    assert.strictEqual(service.listeners.googlefonts_loaded.length, 1)
    service.removeServiceLoadedListener('googlefonts')
    assert.strictEqual(service.listeners.googlefonts_loaded.length, 0)
  })

  test('it adds/removes TAC listener', function (assert) {
    assert.expect(20)
    let service = this.owner.lookup('service:tarteaucitron')
    let noop = () => {}
    ;[
      'tac.root_available',
      'tac.open_alert',
      'tac.close_alert',
      'tac.open_panel',
      'tac.close_panel',
    ].forEach((event) => {
      service.addTACListener(event, noop)
      assert.strictEqual(service.listeners[event].length, 1)
      service.removeTACListener(event, noop)
      assert.strictEqual(service.listeners[event].length, 0)
      service.addTACListener(event, noop)
      assert.strictEqual(service.listeners[event].length, 1)
      service.removeTACListener(event)
      assert.strictEqual(service.listeners[event].length, 0)
    })
  })
})
