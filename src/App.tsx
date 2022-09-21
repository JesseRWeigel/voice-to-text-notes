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
      <div className="container">
        <p>
          This app uses the Deepgram API to turn speech into text! Sign up and
          generate an api key{' '}
          <a className="App-link" href="https://console.deepgram.com/signup">
            https://console.deepgram.com/signup
          </a>{' '}
          Your key stays in the browser and is only used to call the
          DeepgramAPI. Saving a key only stores it in you browser's
          localStorage.{' '}
        </p>
        <label htmlFor="apiKey">Api Key (only used locally)</label>
        <input
          className="apiInput"
          type="password"
          value={apiKey}
          onChange={onChange}
        ></input>
        <button className="button" onClick={saveKeyLocally}>
          Save Key Locally
        </button>
        <button className="button" onClick={getLocalKey}>
          Get Locally Saved Key
        </button>
        <button className="button" onClick={transcribe}>
          Transcribe
        </button>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default App
