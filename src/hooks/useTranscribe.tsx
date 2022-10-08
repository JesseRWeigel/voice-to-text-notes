import { useRef, useState } from "react";

export interface UseTranscribeParam {
	apiKey?: string;
}

export const useTranscribe = ({ apiKey }: UseTranscribeParam) => {
	const [isTranscribing, setIsTranscibing] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [transcripts, setTranscripts] = useState<Record<string, string>>({});

	const recorder = useRef<MediaRecorder | null>(null);
	const deepgramSocket = useRef<WebSocket | null>(null);

	const onOpen = () => {
		console.log({ event: "onopen" });
	};

	const onMessage = (message: MessageEvent) => {
		const data = JSON.parse(message.data);

		const transcript = data.channel.alternatives[0].transcript;
		if (transcript && data.is_final) {
			const id = data.metadata.request_id;
			setTranscripts((prev) => ({ ...prev, [id]: transcript }));
		}
	};

	const onClose = () => {
		console.info({ event: "onclose" });
		console.info("Stopping transcribe socket");
	};

	const onError = (error: unknown) => {
		console.error({ event: "onerror", error });
		if (error instanceof Error) {
			setError(error);
			return;
		}

		setError(new Error("Unexpected error occured."));
	};

	const onDataAvailable = async (event: BlobEvent) => {
		console.debug("Recorder: onDataAvailable()");
		if (event.data.size > 0 && deepgramSocket.current?.readyState == 1) {
			deepgramSocket?.current.send(event.data);
		}
	};

	const onStop = async () => {
		console.info("Stopping recording");
	};

	const onStart = async () => {
		console.info("Start recording");
	};

	const startTranscribe = async () => {
		if (!apiKey) {
			setError(new Error("Invalid API Key. Please provide api key."));
			setIsTranscibing(false);
			return;
		}

		if (!MediaRecorder.isTypeSupported("audio/webm")) {
			setError(new Error("Browser not supported recording"));
			setIsTranscibing(false);
			return;
		}

		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		recorder.current = new MediaRecorder(stream, {
			mimeType: "audio/webm",
		});

		deepgramSocket.current = new WebSocket("wss://api.deepgram.com/v1/listen", [
			"token",
			apiKey,
		]);

		if (deepgramSocket.current) {
			deepgramSocket.current.close = onClose;
			deepgramSocket.current.onerror = onError;
			deepgramSocket.current.onmessage = onMessage;
			deepgramSocket.current.onopen = onOpen;
		}

		if (recorder.current) {
			recorder.current.ondataavailable = onDataAvailable;
			recorder.current.onstop = onStop;
			recorder.current.start(1000);
			recorder.current.onstart = onStart;
			setIsTranscibing(true);
			setIsRecording(true);
			setError(null);
		}
	};

	const resumeTranscribe = async () => {
		if (!recorder.current) return;
		if (recorder.current.state === "paused") {
			recorder.current.resume();
			setIsRecording(true);
			console.info("Recording resumed.");
		}
	};
	const pauseTranscribe = async () => {
		if (!recorder.current) return;
		if (recorder.current.state === "recording") {
			recorder.current.pause();
			setIsRecording(false);
			console.info("Recording paused.");
		}
	};

	const stopTranscribe = () => {
		if (
			recorder.current?.state === "recording" ||
			recorder.current?.state === "paused"
		) {
			recorder.current?.stop();
		}
		recorder.current = null;

		deepgramSocket.current?.close();
		deepgramSocket.current = null;
		setTranscripts({});
		setIsTranscibing(false);
		setIsRecording(false);
	};

	return {
		isTranscribing,
		isRecording,
		error,
		startTranscribe,
		stopTranscribe,
		pauseTranscribe,
		resumeTranscribe,
		transcripts,
	};
};
