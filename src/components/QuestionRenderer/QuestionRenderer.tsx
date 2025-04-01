import React, { useEffect, useState, useCallback } from "react";
import CodeEditor from "../CodeEidtor/CodeEditor";
import SpeechRecognitionComponent from "../SpeechRecognition/SpeechRecognition";
import { QuestionRendererProps } from "@/utils/Types";
import { Clock, Code } from "lucide-react";
import ThemeToggle from "../Others/ThemeToggle";
import { languages, boilerplates } from "@/utils/arrayData";
import { submitAssessmentAnswer } from "@/apiServices/AssessmentAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onNext,
  assessmentTime,
}) => {
  const [transcript, setTranscript] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(
    question?.timeLimit ?? 0
  );
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(boilerplates[language]);
  const [assessmentTimer, setAssessmentTimer] = useState<number>(
    assessmentTime ?? 0
  );
  const [isLoading, setIsLoading] = useState(false);
  const token =
    (useSelector((state: RootState) => state.assessment.token) ||
      Cookies.get("assessmentValidationToken")) ??
    null;

  const handleTranscriptChange = useCallback((newTranscript: string) => {
    setTranscript(newTranscript);
  }, []);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
    setCode(boilerplates[event.target.value] || "// Start coding...");
  };

  useEffect(() => {
    setTimeRemaining(question.timeLimit);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [question]);

  useEffect(() => {
    if (timeRemaining !== 0) return;
    onNext();
    setTranscript("");
    setCode(boilerplates[language]);
  }, [timeRemaining]);

  useEffect(() => {
    if (!assessmentTimer || assessmentTimer <= 0) return;

    const timer = setInterval(() => {
      setAssessmentTimer((prev) => {
        if ((prev ?? 0) <= 1) {
          clearInterval(timer);
          return 0;
        }
        return (prev ?? 0) - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessmentTimer]);

  useEffect(() => {
    if (!assessmentTimer || assessmentTimer <= 0) return;

    const timer = setInterval(() => {
      setAssessmentTimer((prev) => {
        if ((prev ?? 0) <= 1) {
          clearInterval(timer);
          return 0;
        }
        return (prev ?? 0) - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessmentTime]);

  const handleNextQuestion = async () => {
    try {
      setIsLoading(true);
      const questionId: string = question.id;
      const answer: string = question.type === "coding" ? code : transcript;
      const answerLanguage: string =
        question.type === "coding" ? language : "English";

      const response = await submitAssessmentAnswer(
        token,
        questionId,
        answer,
        answerLanguage
      );
      toast.success(response.message || "Answer submitted sucessfully.");
      onNext();
      setTranscript("");
      setCode(boilerplates[language]);
    } catch (error) {
      setIsLoading(false);
      console.error("Error occured while submitting question", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-2/3">
        <div className="flex items-center justify-between p-3 bg-[#181818] text-white border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-gray-400" />
            <span className="text-sm">
              Duration: {Math.floor((assessmentTimer ?? 0) / 60)}:
              {String((assessmentTimer ?? 0) % 60).padStart(2, "0")} Remaining
            </span>
          </div>

          <span className="text-sm font-semibold">User Assessment Module</span>
          {question.type === "coding" && (
            <>
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
            </>
          )}
        </div>
        {question?.type === "coding" ? (
          <CodeEditor
            theme={theme}
            language={language}
            code={code}
            setCode={setCode}
          />
        ) : (
          <SpeechRecognitionComponent
            onTranscriptChange={handleTranscriptChange}
          />
        )}
      </div>

      <div className="w-[1px] bg-[#fff]"></div>

      <div className="w-1/3 p-6 flex flex-col h-[102.19vh] bg-black">
        <h1 className="text-3xl font-bold mb-3 text-[#5E17EB]">
          Question-{question.index + 1}
        </h1>
        <p className="text-white mb-4">
          {question?.question || "Question not found!"}
        </p>

        <p className="mt-[90%] font-semibold text-white">Time remaining </p>
        <h1
          className="text-3xl font-bold mb-3 text-[#5E17EB]"
          style={{
            WebkitTextStroke: "0.5px white",
          }}
        >
          {String(Math.floor(timeRemaining / 60)).padStart(2, "0")}:
          {String(timeRemaining % 60).padStart(2, "0")}
        </h1>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-[#5E17EB] text-white rounded-md disabled:opacity-50"
            onClick={handleNextQuestion}
          >
            {isLoading ? (
              <Spin
                indicator={<LoadingOutlined style={{ color: "white" }} spin />}
                size="default"
              />
            ) : question.index < 9 ? (
              "Next Question"
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default QuestionRenderer;
