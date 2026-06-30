const CACHE_NAME = 'megabeat-v1'

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clonedResponse = response.clone()
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(event.request)
      })
  )
})

console.log('Service Worker loaded')
