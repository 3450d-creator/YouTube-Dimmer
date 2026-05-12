export {}

if (window.location.hostname.includes("youtube.com")) {
  
  let isDimmed = false
  let overlay: HTMLDivElement | null = null
  let resizeObserver: ResizeObserver | null = null

  function updateOverlayClip(playerElement: HTMLElement) {
    if (!overlay) return

    const rect = playerElement.getBoundingClientRect()

    const x1 = rect.left
    const y1 = rect.top
    const x2 = rect.right
    const y2 = rect.bottom

    overlay.style.clipPath = `polygon(
      0px 0px, 
      100% 0px, 
      100% 100%, 
      0px 100%, 
      0px 0px, 
      ${x1}px ${y1}px, 
      ${x1}px ${y2}px, 
      ${x2}px ${y2}px, 
      ${x2}px ${y1}px, 
      ${x1}px ${y1}px
    )`
  }

  function toggleLights() {

    const playerEl = document.querySelector('#movie_player') as HTMLElement
    
    if (!playerEl) {
      console.warn("YouTube player container not found")
      return
    }

    if (!overlay) {
      overlay = document.createElement('div')
      overlay.id = 'yt-dimmer-overlay'
      overlay.style.position = 'fixed'
      overlay.style.top = '0'
      overlay.style.left = '0'
      overlay.style.width = '100vw'
      overlay.style.height = '100vh'
      overlay.style.backgroundColor = 'rgba(0,0,0,0.9)'
      overlay.style.zIndex = '2147483646'
      overlay.style.transition = 'opacity 0.3s ease'
      overlay.style.pointerEvents = 'none' 
      overlay.style.opacity = '0'
      
      document.body.appendChild(overlay)

      resizeObserver = new ResizeObserver(() => {
        if (isDimmed) updateOverlayClip(playerEl)
      })
      resizeObserver.observe(playerEl)

      window.addEventListener('resize', () => {
         if (isDimmed) updateOverlayClip(playerEl)
      })
      window.addEventListener('scroll', () => {
         if (isDimmed) updateOverlayClip(playerEl)
      }, true)
    }

    isDimmed = !isDimmed
    
    if (isDimmed) {
      updateOverlayClip(playerEl)
      overlay.style.opacity = '1'
      overlay.style.pointerEvents = 'auto' 
    } else {
      overlay.style.opacity = '0'
      overlay.style.pointerEvents = 'none'
      overlay.style.clipPath = 'none'
    }
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'toggle') {
      toggleLights()
    }
  })
}