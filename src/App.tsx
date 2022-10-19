import React from "react";
import "./App.css";
import { useTranscribe } from "./hooks/useTranscribe";
import Editor from "./components/Editor";

function App() {
	const [apiKey, setApiKey] = React.useState("");

	const [fullTranscripts, setFullTranscripts] = React.useState<Array<string>>(
		[]
	);

	const handleTranscribe = (transcriptText: string) => {
		setFullTranscripts((prev) => [...prev, transcriptText]);
	};

	const {
		isTranscribing,
		isRecording,
		startTranscribe,
		stopTranscribe,
		pauseTranscribe,
		resumeTranscribe,
	} = useTranscribe({ apiKey, onTranscribe: handleTranscribe });

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setApiKey(event.target.value);
	};

	const saveKeyLocally = () => {
		localStorage.setItem("apiKey", apiKey);
	};

	const getLocalKey = () => {
		const apiKey = localStorage.getItem("apiKey");
		if (apiKey) {
			setApiKey(apiKey);
		}
	};

	const handlePlayPause = () => {
		if (!isTranscribing) return;
		if (isRecording) {
			pauseTranscribe();
		} else {
			resumeTranscribe();
		}
	};

	return (
		<div className="App">
			<div className="container">
				<pre className="app-info">
					This app uses the Deepgram API to turn speech into text! Sign up and
					generate an api key{" "}
					<a
						className="App-link"
						href="https://console.deepgram.com/signup"
						rel="noreferrer"
						target="_blank"
					>
						https://console.deepgram.com/signup
					</a>{" "}
					Your key stays in the browser and is only used to call the
					DeepgramAPI. Saving a key only stores it in you browser&apos;s
					localStorage.{" "}
				</pre>
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
				{isTranscribing ? (
					<>
						<button className="button" onClick={handlePlayPause}>
							{isRecording ? "⏸️  Pause" : "▶️ Resume"}
						</button>
						<button className="button" onClick={stopTranscribe}>
							Stop Transcribe
						</button>
					</>
				) : (
					<button className="button" onClick={startTranscribe}>
						Transcribe
					</button>
				)}
			</div>
			<Editor transcripts={fullTranscripts} />
		</div>
	);
}

export default App;
