"use client";
import React, { useEffect, useState } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Mic, MicOff, Send } from "lucide-react";

interface SpeechRecognitionProps {
  onTranscriptChange: (transcript: string) => void;
}

const SpeechRecognitionComponent: React.FC<SpeechRecognitionProps> = ({
  onTranscriptChange,
}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
      onTranscriptChange(transcript);
    }
  }, [transcript]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    onTranscriptChange(e.target.value);
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 p-6 h-[96vh]  w-full mx-auto bg-[#121212]">
        <button
          onClick={toggleListening}
          className={`relative flex items-center justify-center w-24 h-24 rounded-full bg-[#5E17EB] text-white shadow-xl transition-all duration-300 
      focus:outline-none hover:shadow-purple-500/50 active:scale-95 
      ${listening ? "animate-pulse bg-purple-600" : "hover:bg-[#7c3ef7]"}`}
        >
          {listening ? (
            <Mic size={48} className="drop-shadow-lg" />
          ) : (
            <MicOff size={48} />
          )}
          {listening && (
            <span className="absolute w-full h-full bg-purple-400 opacity-30 rounded-full animate-ping"></span>
          )}
        </button>

        <p className="text-gray-300 text-lg text-center font-medium tracking-wide px-6">
          {transcript || "Press the mic to start speaking..."}
        </p>

        <button
          onClick={() => {
            resetTranscript();
            setInputText("");
          }}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-[#5E17EB] text-white font-semibold shadow-lg 
            transition-all duration-300 transform active:scale-95 
           hover:from-[#7c3ef7] hover:to-[#4c1d95] hover:shadow-purple-500/50"
        >
          Reset
        </button>
        {!browserSupportsSpeechRecognition && (
          <p className="text-yellow-400 font-medium text-center">
            Your browser doesn&apos;t support speech recognition. You can still
            type your input below.
          </p>
        )}

        <div className="relative w-full max-w-lg">
          <div className="flex items-center bg-[#1E1E1E] text-white rounded-lg shadow-md focus-within:ring-2 focus-within:ring-[#5E17EB] transition-all px-4 py-2">
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type here if you don't want to speak..."
              className="w-full max-h-40 min-h-[80px] px-4 py-3 pr-12 bg-transparent text-white rounded-lg focus:outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700"
            />
            <button className="absolute right-4 text-gray-400 hover:text-white transition-all">
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpeechRecognitionComponent;
