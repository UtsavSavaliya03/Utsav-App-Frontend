import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Tag, Alert } from "antd";
import { analyseUserApi, sessionApi } from "./chatFormAPI.js";
import { useNavigate } from "react-router-dom";
import useClickTracker from "../../hooks/useClickTracker.jsx";
import AccessibilityPanel from "../../components/accessibilityPanel/AccessibilityPanel.jsx";

const questions = [
  { key: "name", question: "What is your full name?", level: "medium" },
  { key: "email", question: "What is your email address?", level: "medium" },
  { key: "phone", question: "What is your phone number?", level: "medium" },
  { key: "role", question: "What is your current job title?", level: "medium" },
  {
    key: "experience",
    question: "How many years of experience do you have?",
    level: "medium",
  },

  {
    key: "skills",
    question: "What are your key skills for this role?",
    level: "hard",
  },
  {
    key: "project",
    question: "Describe a project you worked on successfully.",
    level: "hard",
  },
  {
    key: "problem",
    question: "Describe a difficult problem you solved.",
    level: "hard",
  },
  { key: "why", question: "Why do you want this job?", level: "hard" },
  {
    key: "plan",
    question: "How would you approach your first 30 days?",
    level: "hard",
  },
];

const getPlaceholder = (key, isHighSupport) => {
  if (!isHighSupport) return "Type your answer...";

  const map = {
    name: "e.g. John Doe",
    email: "e.g. user@gmail.com",
    phone: "10 digits only (e.g. 7123456789)",
    role: "e.g. Software Engineer",
    experience: "e.g. 3 years",

    skills: "e.g. React, Node.js, Problem Solving",
    project: "e.g. Built a booking system using MERN stack",
    problem: "e.g. Fixed performance issue by optimizing API calls",
    why: "e.g. I am passionate about this role",
    plan: "e.g. Learn system, meet team, start small tasks",
  };

  return map[key] || "Please answer clearly";
};

const getInputType = (key, isHighSupport) => {
  const map = {
    name: "text",
    email: "email",
    phone: "tel",
    role: "text",
    experience: "number",
  };

  return map[key] || "text";
};

const getHint = (key, isHighSupport) => {
  if (!isHighSupport) return null;

  const hints = {
    phone: "💡 10 Digits number. e.g. 7123456789",
    skills: "💡 List 3–5 strongest skills in order of relevance",
    project: "💡 Mention tech stack + outcome",
    problem: "💡 Use: Problem → Action → Result format",
    why: "💡 Keep it short and job-focused",
    plan: "💡 Break into steps: learn, adapt, contribute",
  };

  return hints[key];
};

const ChatForm = () => {
  const clickCount = useClickTracker();
  const navigate = useNavigate();
  const [isHighSupport, setIsHighSupport] = useState(false);
  const [step, setStep] = useState(0);
  const inputType = getInputType(questions[step]?.key, isHighSupport);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: questions[0].question },
  ]);
  const [answers, setAnswers] = useState({});
  const chatEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [keystrokes, setKeystrokes] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [switchTime, setSwitchTime] = useState(0);
  const [counter, setCounter] = useState(0);
  const typingTimeoutRef = useRef(null);

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      analyseUser();
    }, 5000); // 5 sec pause
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      setBackspaces((prev) => prev + 1);
    } else {
      setKeystrokes((prev) => prev + 1);
    }
  };

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input) return;

    const current = questions[step];

    setAnswers({ ...answers, [current.key]: input });

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    setInput("");

    const nextStep = step + 1;

    if (nextStep < questions.length) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: questions[nextStep].question,
            key: questions[nextStep].key,
          },
        ]);
        setStep(nextStep);
      }, 400);
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "✅ Application submitted successfully!" },
        ]);
        handleSubmit();
      }, 400);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoadingSubmit(true);

      const params = {
        task: "job_application",
        keystrokes,
        backspaces,
        clickCount,
        timeTaken: Math.floor((Date.now() - startTime) / 1000),
        score: score,
        supportTriggered: isHighSupport,
        switchTime: switchTime,
        completed: true,
      };
      const data = await sessionApi(params);
      if (data?.status) {
        setIsLoadingSubmit(false);
        navigate("/feedback");
      }
      setIsLoadingSubmit(false);
    } catch (error) {
      setIsLoadingSubmit(false);
    }
  };

  const analyseUser = async () => {
    if (
      isLoading ||
      isLoadingSubmit ||
      isHighSupport ||
      backspaces < 10 ||
      keystrokes < 20
    ) {
      return;
    }

    setIsLoading(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      const params = {
        fieldCount: 10,
        keystrokes,
        backspaces,
        clickCount,
        time: timeTaken,
      };
      const data = await analyseUserApi(params);

      if (data?.status) {
        // Trigger support mode
        if (data?.data?.score > 0.6) {
          setIsHighSupport(true);
          setScore(data?.data?.score);
          setSwitchTime(timeTaken);
        }
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error wwhile analyzing user:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((current) => current + 1);
    }, 30000);

    return () => clearInterval(interval); // cleanup
  }, []);

  useEffect(() => {
    analyseUser();
  }, [counter]);

  return (
    <div className="min-h-dvh md:flex items-center justify-center">
      <div className="md:w-2/6 bg-white shadow-xl rounded-2xl flex flex-col h-[620px] border">
        <Alert
          className="m-4"
          title="Welcome!"
          description="This is a demo environment created for research purposes."
          type="warning"
          showIcon
        />
        {/* Header */}
        <div className="p-4 border-y flex justify-between items-center">
          <span className="font-semibold">Job Application Chat 💼</span>
        </div>

        {/* Chat Area */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>
            {`
            .chat::-webkit-scrollbar { display: none; }
          `}
          </style>

          {messages.map((msg, i) => {
            const currentKey = msg.key;

            return (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow
                ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white  rounded-br-none"
                    : "bg-gray-100 text-gray-800  rounded-bl-none"
                }`}
                >
                  {msg.text}

                  {/* 🔥 HIGH SUPPORT HINT */}
                  {msg.sender === "bot" && isHighSupport && currentKey && (
                    <div>
                      {getHint(currentKey, isHighSupport) && (
                        <div className="mt-2 text-xs bg-yellow-50 text-gray-600 p-2 rounded">
                          {getHint(currentKey, isHighSupport)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t flex gap-2">
          <Input
            required
            size="large"
            type={inputType}
            value={input}
            placeholder={getPlaceholder(questions[step]?.key, isHighSupport)}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            onPressEnter={handleSend}
            onKeyDown={handleKeyDown}
          />

          <Button size="large" type="primary" onClick={handleSend}>
            Send
          </Button>
        </div>
      </div>
      {isHighSupport && <AccessibilityPanel />}
    </div>
  );
};

export default ChatForm;
