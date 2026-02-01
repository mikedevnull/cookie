import './PWABadge.css'

import { useRegisterSW } from 'virtual:pwa-register/react'

function PWABadge() {
  // check for updates every hour
  const period = 60 * 60 * 1000

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return
      if (r?.active?.state === 'activated') {
        registerPeriodicSync(period, swUrl, r)
      }
      else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker
          if (sw.state === 'activated')
            registerPeriodicSync(period, swUrl, r)
        })
      }
    },
  })

  function close() {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (offlineReady || needRefresh) {
    return <aside role="alert" className="alert m-4 md:w-4xl self-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-info">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      {offlineReady
        ? <span>App ready to work offline</span>
        : <span>New content available, click on reload button to update.</span>}
      {needRefresh && <button className="btn btn-sm btn-info" onClick={() => updateServiceWorker(true)} > Reload</button>}
      <button className="btn btn-sm" onClick={() => close()}>Close</button>
    </aside >
  }
  return <></>
}

export default PWABadge

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine)
      return

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        'cache': 'no-store',
        'cache-control': 'no-cache',
      },
    })

    if (resp?.status === 200)
      await r.update()
  }, period)
}
