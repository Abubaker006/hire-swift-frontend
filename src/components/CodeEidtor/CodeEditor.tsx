"use client";
import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Clock, Code } from "lucide-react";
import ThemeToggle from "../Others/ThemeToggle";
import Loader from "@/utils/loader";
import * as monaco from "monaco-editor";
import { languages, boilerplates } from "@/utils/arrayData";

const CodeEditor = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(boilerplates[language]);
  const [theme, setTheme] = useState("vs-dark");
  const [isLoading, setIsLoading] = useState(true);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    setIsLoading(false);
  };

  const handleLanguageChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
    setCode(boilerplates[event.target.value] || "// Start coding...");
  };

  return (
    <div
      className={`flex flex-col h-[92.36vh] transition-colors duration-300 ${
        theme === "vs-dark" ? "bg-black" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between p-3 bg-[#181818] text-white border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Clock size={18} className="text-gray-400" />
          <span className="text-sm">Duration: 40 minutes</span>
        </div>

        <span className="text-sm font-semibold">User Assessment Module</span>

        <div className="flex items-center gap-2">
          <Code size={18} className="text-gray-400" />
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-[#222222] text-white text-sm p-1 rounded-lg outline-none border border-gray-600"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>

          <ThemeToggle
            theme={theme}
            toggleTheme={() =>
              setTheme(theme === "vs-dark" ? "light" : "vs-dark")
            }
          />
        </div>
      </div>

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
