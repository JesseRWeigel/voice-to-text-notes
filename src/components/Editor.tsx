interface EditorProps {
	transcripts: string[];
}

const Editor = ({ transcripts }: EditorProps) => {
	const text = transcripts.join("\n");
	return <textarea className="text-container" value={text} />;
};

export default Editor;
