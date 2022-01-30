export function initialize(appInstance) {
  if (window.tarteaucitron) {
    appInstance.lookup('service:tarteaucitron')
  }
}

export default {
  initialize,
}
