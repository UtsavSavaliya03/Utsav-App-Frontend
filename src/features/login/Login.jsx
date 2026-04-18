import React, { useEffect, useRef, useState } from "react";
import { Alert, Checkbox, Form, Input, Tag } from "antd";
import LoadableButton from "../../components/buttons/LoadableButton.jsx";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import AccessibilityPanel from "../../components/accessibilityPanel/AccessibilityPanel.jsx";
import { analyseUserApi, sessionApi } from "./loginAPI.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [keystrokes, setKeystrokes] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [isHighSupport, setIsHighSupport] = useState(false);
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

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);

      const params = {
        task: "login",
        keystrokes,
        backspaces,
        timeTaken: Math.floor((Date.now() - startTime) / 1000),
        score: score,
        supportTriggered: isHighSupport,
        switchTime: switchTime,
        completed: true,
      };
      const data = await sessionApi(params);
      if (data?.status) {
        form.resetFields();
        setIsLoading(false);
        navigate("/feedback");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const analyseUser = async () => {
    if (isLoading || isHighSupport || backspaces < 10 || keystrokes < 20) {
      return;
    }

    setIsLoading(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      const params = { keystrokes, backspaces, time: timeTaken };
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
      <div className="md:w-2/6 bg-white shadow-lg p-9 rounded-xl">
        <Alert
          title="Welcome!"
          description="This is a demo environment created for research purposes. No real accounts are required — just enter any details to continue."
          type="warning"
          showIcon
        />
        <Form
          autoComplete="off"
          form={form}
          initialValues={initialValues}
          onFinish={handleSubmit}
        >
          <p className="font-bold sm:text-4xl text-2xl text-secondary my-5">
            Login
          </p>
          <p className="mb-8 text-lg">Login to access your account.</p>

          <Form.Item
            name="email"
            className="mb-0 mt-5 w-full"
            hasFeedback={isHighSupport}
            rules={[
              { required: true, message: "Please enter your email." },
              { type: "email", message: "Please enter valid email." },
            ]}
          >
            <Input
              placeholder="Email"
              size="large"
              autoComplete={isHighSupport ? "on" : "off"}
              onKeyDown={handleKeyDown}
              onChange={handleTyping}
            />
          </Form.Item>
          {isHighSupport && (
            <div className="mt-2 border border-orange-300 rounded-md bg-orange-100 text-orange-600 flex gap-2 px-2 pb-[2px] items-start">
              <ExclamationCircleOutlined className="pt-1" />
              <p>Check that your email follows the format example@domain.com</p>
            </div>
          )}
          <Form.Item
            name="password"
            hasFeedback={isHighSupport}
            className="mb-0 mt-5"
            rules={[{ required: true, message: "Please enter your password." }]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              visibilityToggle={isHighSupport}
              onKeyDown={handleKeyDown}
              onChange={handleTyping}
            />
          </Form.Item>
          {isHighSupport && (
            <div className="mt-2 border border-orange-300 rounded-md bg-orange-100 text-orange-600 flex gap-2 px-2 pb-[2px] items-start">
              <ExclamationCircleOutlined className="pt-1" />
              <p>
                Use at least 8 characters with letters, numbers, and symbols.
              </p>
            </div>
          )}
          <div className="flex justify-between items-center mt-5">
            <Form.Item name="remember" valuePropName="checked" className="mb-0">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </div>
          <LoadableButton
            className="mt-4 px-9 pb-1"
            type="submit"
            lable="Login"
            loadingLable="Logging in..."
            isLoading={isLoading}
          />
        </Form>
      </div>
      {isHighSupport && <AccessibilityPanel />}
    </div>
  );
}
