"use client";
import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";

import ThemeToggle from "../Others/ThemeToggle";
import Loader from "@/utils/loader";
import * as monaco from "monaco-editor";
import { languages, boilerplates } from "@/utils/arrayData";

interface CodeEidtorProps {
  theme: string;
  language: string;
  code: string;
  setCode: (value: string) => void;
}
const CodeEditor: React.FC<CodeEidtorProps> = ({
  theme,
  language,
  code,
  setCode,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    setIsLoading(false);
  };

  return (
    <div
      className={`flex flex-col h-[92.36vh] transition-colors duration-300 ${
        theme === "vs-dark" ? "bg-black" : "bg-white"
      }`}
    >
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#181818]">
            <Loader />
          </div>
        )}
        <Editor
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme={theme}
          options={{
            automaticLayout: true,
            formatOnType: true,
            formatOnPaste: true,
            minimap: { enabled: true },
            fontSize: 14,
            scrollBeyondLastLine: true,
          }}
          onMount={handleEditorMount}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
