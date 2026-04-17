import React, { useState } from "react";
import { Checkbox, Form, Input, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import LoadableButton from "../../components/buttons/LoadableButton.jsx";
import {
  ExclamationCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import AccessibilityPanel from "../../components/accessibilityPanel/AccessibilityPanel.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isHighSupport, setIsHighSupport] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (true) {
        form.resetFields();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh md:flex items-center justify-center">
      <div className="md:w-2/6 bg-white shadow-lg p-9 rounded-xl">
        <Form
          autoComplete="off"
          form={form}
          initialValues={initialValues}
          onFinish={handleSubmit}
        >
          <p className="font-bold sm:text-5xl text-2xl text-secondary mb-5">
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
