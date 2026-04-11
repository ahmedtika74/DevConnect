import { useRef } from "react";

export default function TextArea({
  placeholder,
  content,
  setContent,
  setError,
}) {
  const textAreaRef = useRef(null);
  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;

    setContent(e.target.value);
    setError && setError("");
  };

  return (
    <textarea
      dir="auto"
      ref={textAreaRef}
      placeholder={placeholder}
      onInput={handleInput}
      value={content}
      rows={4}
      className="input-premium block w-full resize-none overflow-hidden rounded-xl p-4 text-sm outline-0"
    ></textarea>
  );
}
