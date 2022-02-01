import { module, test } from 'qunit'
import { visit } from '@ember/test-helpers'
import { setupApplicationTest } from 'ember-qunit'

module('Acceptance | configuration', function (hooks) {
  setupApplicationTest(hooks)

  test('it loads job and user configuration correctly', async function (assert) {
    assert.expect(2)
    await visit('/')
    assert.deepEqual(window.tarteaucitron.job, ['googlefonts'])
    assert.deepEqual(window.tarteaucitron.user, { googleFonts: ['Tangerine'] })
  })
})
