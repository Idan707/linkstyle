import React, { useEffect } from 'react'
import { useState } from 'react'

import './style.css'

import demoGif from "data-base64:~assets/demo.gif"

// Declare global gtag function with consistent typing
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (a: string, b: any, c?: any) => void
  }
}

const GA_TRACKING_ID = process.env.PLASMO_PUBLIC_GTAG_ID || 'YOUR-GA-TRACKING-ID'

const Popup = () => {
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    // Load Google Analytics
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
    script.async = true
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', GA_TRACKING_ID)

    // Send event for popup open
    gtag('event', 'open', {
      'event_category': 'Popup',
      'event_label': 'Popup Opened'
    })
  }, [])

  const toggleExtension = () => {
    setIsEnabled(!isEnabled)
    // Send event for toggle action
    window.gtag('event', 'click', {
      'event_category': 'Toggle',
      'event_label': isEnabled ? 'Disabled' : 'Enabled'
    })
    // Here you would typically send a message to your content script
    // to enable/disable the extension functionality
  }

  const sendDemoViewEvent = () => {
    window.gtag('event', 'view', {
      'event_category': 'Demo',
      'event_label': 'Demo GIF Viewed'
    })
  }

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>LinkedIn Formatter</h1>
        {/* <button 
          className={`toggle-button ${isEnabled ? 'enabled' : 'disabled'}`}
          onClick={toggleExtension}
        >
          {isEnabled ? 'Enabled' : 'Disabled'}
        </button> */}
      </header>
      <main className="popup-content">
        <section className="info-section">
          <h2>How it works</h2>
          <p>
            This extension adds custom formatting buttons to your LinkedIn post editor, 
            allowing you to use bold and italic characters in your posts.
          </p>
        </section>
        <section className="demo-section">
          <h2>Demo</h2>
          <div className="gif-container">
            <img 
              src={demoGif} 
              alt="LinkedIn Formatter Demo" 
              onLoad={sendDemoViewEvent}
            />
          </div>
        </section>
      </main>
      <footer className="popup-footer">
        <p>Created with ❤️ by I.O</p>
      </footer>
    </div>
  )
}

export default Popup