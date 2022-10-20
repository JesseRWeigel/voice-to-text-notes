import { ChangeEventHandler } from "react";

interface EditorProps {
	transcripts: string[];
	readOnly?: boolean;
	onChange?: (fullText: string[]) => void;
}

const Editor = ({ transcripts, readOnly, onChange }: EditorProps) => {
	const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		const editedText = e.target.value;
		if (onChange) onChange(editedText.split("\n"));
	};

	return (
		<textarea
			className="text-container"
			value={transcripts.join("\n")}
			readOnly={readOnly}
			onChange={handleChange}
		/>
	);
};

Editor.defaultProps = {
	readOnly: false,
};

export default Editor;
