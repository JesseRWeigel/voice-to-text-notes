import React, { useEffect } from 'react'
import './App.css'

function App() {
  const [apiKey, setApiKey] = React.useState('')
  const [text, setText] = React.useState('')

  const transcribe = async () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      console.log({ stream })
      if (!MediaRecorder.isTypeSupported('audio/webm'))
        return alert('Browser not supported')
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      })
      const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
        'token',
        apiKey,
      ])
      socket.onopen = () => {
        console.log({ event: 'onopen' })
        mediaRecorder.addEventListener('dataavailable', async (event) => {
          if (event.data.size > 0 && socket.readyState == 1) {
            socket.send(event.data)
          }
        })
        mediaRecorder.start(1000)
      }

      socket.onmessage = (message) => {
        const received = JSON.parse(message.data)
        const transcript = received.channel.alternatives[0].transcript
        if (transcript && received.is_final) {
          setText(text + transcript)
        }
      }

      socket.onclose = () => {
        console.log({ event: 'onclose' })
      }

      socket.onerror = (error) => {
        console.log({ event: 'onerror', error })
      }
    })
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value)
  }

  const saveKeyLocally = () => {
    localStorage.setItem('apiKey', apiKey)
  }

  const getLocalKey = () => {
    const apiKey = localStorage.getItem('apiKey')
    if (apiKey) {
      setApiKey(apiKey)
    }
  }

  return (
    <div className="App">
      <label htmlFor="apiKey">Api Key (only used locally)</label>
      <input type="password" value={apiKey} onChange={onChange}></input>
      <button onClick={saveKeyLocally}>Save Key Locally</button>
      <button onClick={getLocalKey}>Get Locally Saved Key</button>
      <button onClick={transcribe}>Transcribe</button>
      <p>{text}</p>
    </div>
  )
}

export default App
