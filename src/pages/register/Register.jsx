import React, { useEffect, useRef, useState } from "react";
import { Alert, Checkbox, Form, Input, Space, Tag, Tooltip } from "antd";
import LoadableButton from "../../components/buttons/LoadableButton.jsx";
import { ExclamationCircleOutlined, InfoCircleFilled } from "@ant-design/icons";
import AccessibilityPanel from "../../components/accessibilityPanel/AccessibilityPanel.jsx";
import { analyseUserApi, sessionApi } from "./registerAPI.js";
import { useNavigate } from "react-router-dom";
import useClickTracker from "../../hooks/useClickTracker.jsx";
import SpeakButton from "../../utils/SpeechHelper.jsx";
import { useAccessibility } from "../../context/AccessibilityContext.jsx";

export default function Register() {
  const clickCount = useClickTracker();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    fName: "",
    lName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [keystrokes, setKeystrokes] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [isHighSupport, setIsHighSupport] = useState(false);
  const [score, setScore] = useState(0);
  const [switchTime, setSwitchTime] = useState(0);
  const [counter, setCounter] = useState(0);
  const typingTimeoutRef = useRef(null);
  const { settings } = useAccessibility();

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
      setIsLoadingSubmit(true);

      const params = {
        task: "signup",
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
        form.resetFields();
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
        fieldCount: 6,
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
    <div className="min-h-dvh flex items-center justify-center p-4 md:p-9">
      <div className="lg:w-1/2 bg-white shadow-lg p-9 rounded-xl">
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
            Sign Up
          </p>
          <div className="mb-3 flex items-center gap-3">
            <p className="text-lg">
              Create your account and start your journey.
            </p>
            {settings?.auditorySupport && (
              <SpeakButton text="  Create your account and start your journey." />
            )}
          </div>
          <div className="gap-4 md:grid grid-cols-2 mt-5 space-y-3 md:space-y-0">
            <div>
              <p className="font-semibold text-gray-600 mb-1">First Name</p>
              <Form.Item
                name="fName"
                className="mb-0 w-full"
                hasFeedback={isHighSupport}
                rules={[
                  { required: true, message: "Please enter your first name." },
                  {
                    pattern: /^[A-Za-z]+$/,
                    message: `${isHighSupport ? "First name should contain only alphabets." : "Please enter valid first name."}`,
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="First name"
                  size="large"
                  autoComplete={isHighSupport ? "on" : "off"}
                  onKeyDown={handleKeyDown}
                  onChange={handleTyping}
                />
              </Form.Item>
            </div>
            <div>
              <p className="font-semibold text-gray-600 mb-1">Last Name</p>
              <Form.Item
                name="lName"
                className="mb-0 w-full"
                hasFeedback={isHighSupport}
                rules={[
                  { required: true, message: "Please enter your last name." },
                  {
                    pattern: /^[A-Za-z]+$/,
                    message: `${isHighSupport ? "LAst name should contain only alphabets." : "Please enter valid last name."}`,
                  },
                ]}
              >
                <Input
                  placeholder="Last name"
                  size="large"
                  autoComplete={isHighSupport ? "on" : "off"}
                  onKeyDown={handleKeyDown}
                  onChange={handleTyping}
                />
              </Form.Item>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-600">Email</p>
                {isHighSupport && (
                  <Tooltip
                    title={
                      <div>
                        <p>• Must be a valid email format</p>
                        <p>• Example: user@example.com</p>
                      </div>
                    }
                  >
                    <InfoCircleFilled className="text-gray-500 cursor-pointer" />
                  </Tooltip>
                )}
              </div>
              <Form.Item
                name="email"
                className="mb-0 w-full"
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
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-600">Phone</p>
                {isHighSupport && (
                  <Tooltip
                    title={
                      <div>
                        <p>• Country code +44 is pre-filled</p>
                        <p>• Enter only 10 digits</p>
                        <p>• Example: 7123456789</p>
                      </div>
                    }
                  >
                    <InfoCircleFilled className="text-gray-500 cursor-pointer" />
                  </Tooltip>
                )}
              </div>
              <Form.Item
                name="phone"
                className="mb-0 w-full"
                hasFeedback={isHighSupport}
                rules={[
                  {
                    required: true,
                    message: "Please enter your phone number.",
                  },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Phone number must be exactly 10 digits.",
                  },
                ]}
              >
                <Space.Compact className="w-full">
                  <Space.Addon>+44</Space.Addon>
                  <Input
                    placeholder="Phone Number"
                    type="number"
                    size="large"
                    maxLength={10}
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  />
                </Space.Compact>
              </Form.Item>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-600">Password</p>
                {isHighSupport && (
                  <Tooltip
                    title={
                      <div>
                        <p>• Minimum 8 characters</p>
                        <p>• At least 1 number (0-9)</p>
                        <p>• At least 1 special character (!@#$%^&*)</p>
                      </div>
                    }
                  >
                    <InfoCircleFilled className="text-gray-500 cursor-pointer" />
                  </Tooltip>
                )}
              </div>
              <Form.Item
                name="password"
                className="mb-0 w-full"
                hasFeedback={isHighSupport}
                rules={[
                  { required: true, message: "Please enter your password." },
                  {
                    pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/,
                    message: "Please enter a strong password.",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Password"
                  size="large"
                  autoComplete={isHighSupport ? "new-password" : "off"}
                  visibilityToggle={isHighSupport}
                  onKeyDown={handleKeyDown}
                  onChange={handleTyping}
                />
              </Form.Item>
            </div>
            <div>
              <p className="font-semibold text-gray-600 mb-1">
                Confirm Password
              </p>
              <Form.Item
                name="confirmPassword"
                className="mb-0 w-full"
                dependencies={["password"]}
                hasFeedback={isHighSupport}
                rules={[
                  { required: true, message: "Please confirm your password." },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Passwords do not match.");
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Confirm Password"
                  size="large"
                  autoComplete="off"
                  visibilityToggle={isHighSupport}
                  onKeyDown={handleKeyDown}
                  onChange={handleTyping}
                />
              </Form.Item>
            </div>
            <div className="col-span-2">
              <Form.Item
                name="agreeToTerms"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            "You must accept the Terms & Conditions for Utsav App.",
                          ),
                  },
                ]}
              >
                <Checkbox onChange={handleTyping}>
                  I agree to the Terms & Conditions.
                </Checkbox>
              </Form.Item>
            </div>
          </div>
          <LoadableButton
            className="mt-4 px-9 pb-1 w-full"
            type="submit"
            lable="Sign Up"
            loadingLable="Signing up..."
            isLoading={isLoadingSubmit}
          />
        </Form>
      </div>
      {isHighSupport && <AccessibilityPanel />}
    </div>
  );
}
