import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Checkbox,
  Form,
  Input,
  Space,
  Tag,
  Tooltip,
  Steps,
  Button,
  DatePicker,
  InputNumber,
  Select,
} from "antd";
import LoadableButton from "../../components/buttons/LoadableButton.jsx";
import AccessibilityPanel from "../../components/accessibilityPanel/AccessibilityPanel.jsx";
import { ExclamationCircleOutlined, InfoCircleFilled } from "@ant-design/icons";
import { analyseUserApi, sessionApi } from "./wizardAPI.js";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useClickTracker from "../../hooks/useClickTracker.jsx";

const { Step } = Steps;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function Wizard() {
  const clickCount = useClickTracker();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    dates: "",
    rooms: "",
    adults: "",
    children: "",
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
  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const onChange = (value) => {
    setCurrent(value);
  };

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
    if (current < 4) {
      setCurrent(current + 1);
      return;
    }
    try {
      setIsLoadingSubmit(true);

      const params = {
        task: "Booking",
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
        fieldCount: 15,
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

  const steps = [
    { title: "Stay Details" },
    { title: "Room Preferences" },
    { title: "Guest Details" },
    { title: "Payment & Confirm" },
  ];

  return (
    <div className="min-h-dvh md:flex items-center justify-center py-9">
      <div className="md:w-2/3 bg-white shadow-lg p-9 rounded-xl">
        <Alert
          title="Welcome!"
          description="This is a demo environment created for research purposes. No real accounts are required — just enter any details to continue."
          type="warning"
          showIcon
        />

        <h2 className="text-2xl font-bold mb-2 mt-4">Grand London Stay</h2>
        <p className="mb-6 text-gray-500">221B Baker Street, London, UK</p>

        <Steps
          current={current}
          onChange={onChange}
          type={isHighSupport ? "default" : "dot"}
          className="mb-4"
          items={steps}
        />
        <Form
          form={form}
          onFinish={handleSubmit}
          autoComplete={isHighSupport ? "on" : "off"}
        >
          {current === 0 && (
            <div className="gap-4 grid md:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-600 mb-1">
                  Booking Dates
                </p>
                <Form.Item
                  className="m-0"
                  name="dates"
                  rules={[{ required: true, message: "Please select dates." }]}
                  hasFeedback={isHighSupport}
                >
                  <RangePicker
                    size="large"
                    className="w-full"
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  />
                </Form.Item>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Rooms</p>
                <Form.Item
                  className="m-0"
                  name="rooms"
                  rules={[{ required: true, message: "Please select rooms." }]}
                  hasFeedback={isHighSupport}
                >
                  <InputNumber
                    size="large"
                    type="number"
                    min={1}
                    placeholder="Rooms"
                    className="w-full"
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  />
                </Form.Item>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Adults</p>
                <Form.Item
                  className="m-0"
                  name="adults"
                  rules={[
                    { required: true, message: "Please select persons." },
                  ]}
                  hasFeedback={isHighSupport}
                >
                  <InputNumber
                    type="number"
                    size="large"
                    min={1}
                    placeholder="Adults"
                    className="w-full"
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  />
                </Form.Item>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Children</p>
                <Form.Item
                  className="m-0"
                  name="children"
                  hasFeedback={isHighSupport}
                >
                  <InputNumber
                    type="number"
                    size="large"
                    min={0}
                    placeholder="Children"
                    className="w-full"
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  />
                </Form.Item>
              </div>
            </div>
          )}

          {current === 1 && (
            <div className="gap-4 grid md:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-600">Room Type</p>
                  {isHighSupport && (
                    <Tooltip
                      title={
                        <div>
                          <p>• Single: 1 person</p>
                          <p>• Double: 2 persons</p>
                          <p>• Deluxe: larger room with premium amenities</p>
                        </div>
                      }
                    >
                      <InfoCircleFilled className="text-gray-500 cursor-pointer" />
                    </Tooltip>
                  )}
                </div>
                <Form.Item
                  className="mb-0"
                  name="roomType"
                  rules={[
                    { required: true, message: "Please select a room type." },
                  ]}
                  hasFeedback={isHighSupport}
                >
                  <Select
                    size="large"
                    placeholder="Room Type"
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  >
                    <Option value="single">Single</Option>
                    <Option value="double">Double</Option>
                    <Option value="deluxe">Deluxe</Option>
                  </Select>
                </Form.Item>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Bed Type</p>
                <Form.Item
                  className="mb-0"
                  name="bedType"
                  rules={[
                    { required: true, message: "Please select a bed type." },
                  ]}
                  hasFeedback={isHighSupport}
                >
                  <Select
                    size="large"
                    placeholder="Bed Type"
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  >
                    <Option value="king">King</Option>
                    <Option value="twin">Twin</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-span-2">
                <p className="font-semibold text-gray-600 mb-1">Add ons</p>
                <Form.Item
                  className="mb-0"
                  name="addons"
                  hasFeedback={isHighSupport}
                >
                  <Checkbox.Group>
                    <Checkbox value="breakfast">Breakfast Included</Checkbox>
                    <Checkbox value="pickup">
                      <div className="flex items-center gap-2 mb-1">
                        <p>Airport Pickup</p>
                        {isHighSupport && (
                          <Tooltip
                            title={
                              <div>
                                <p>• Pickup service from airport to hotel</p>
                                <p>• May include additional charges</p>
                                <p>• Available at selected time slots</p>
                              </div>
                            }
                          >
                            <InfoCircleFilled className="text-gray-500 cursor-pointer" />
                          </Tooltip>
                        )}
                      </div>
                    </Checkbox>
                    <Checkbox value="extraBed">Extra Bed</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </div>
              <div className="col-span-2">
                <p className="font-semibold text-gray-600 mb-1">
                  Special Requests
                </p>
                <Form.Item name="specialRequests" hasFeedback={isHighSupport}>
                  <Input.TextArea
                    rows={4}
                    placeholder="Special Requests"
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  />
                </Form.Item>
              </div>
            </div>
          )}

          {current === 2 && (
            <div className="gap-4 grid md:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-600 mb-1">Full Name</p>
                <Form.Item
                  className="mb-0"
                  name="fullName"
                  rules={[
                    { required: true, message: "Please enter your full name." },
                  ]}
                  hasFeedback={isHighSupport}
                >
                  <Input
                    size="large"
                    placeholder="Full Name"
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  />
                </Form.Item>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">
                  Date of Birth
                </p>
                <Form.Item
                  className="mb-0"
                  name="dob"
                  rules={[
                    {
                      required: true,
                      message: "Please select you date of birth.",
                    },
                  ]}
                  hasFeedback={isHighSupport}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    placeholder="Date of Birth"
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
                </div>{" "}
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email." },
                    { type: "email", message: "Please enter valid email." },
                  ]}
                  hasFeedback={isHighSupport}
                >
                  <Input
                    size="large"
                    placeholder="Email"
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
                  hasFeedback={isHighSupport}
                >
                  <Input
                    type="number"
                    size="large"
                    addonBefore="+44"
                    placeholder="Phone"
                    maxLength={10}
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  />
                </Form.Item>
              </div>
            </div>
          )}

          {current === 3 && (
            <div className="gap-4 grid md:grid-cols-2">
              <div className="col-span-2">
                <p className="font-semibold text-gray-600 mb-1">
                  Payment Method
                </p>
                <Form.Item className="mb-0" name="paymentMethod">
                  <Select
                    defaultValue="card"
                    disabled
                    placeholder="Payment Method"
                    size="large"
                  >
                    <Option value="card">Credit Card / Debit Card</Option>
                  </Select>
                </Form.Item>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Name on Card</p>
                <Form.Item
                  className="mb-0"
                  name="cardName"
                  rules={[
                    {
                      required: true,
                      message: "Please entrt card holder name.",
                    },
                  ]}
                  hasFeedback={isHighSupport}
                >
                  <Input
                    size="large"
                    placeholder="Name on Card"
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  />
                </Form.Item>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-600">Card Number</p>
                  {isHighSupport && (
                    <Tooltip
                      title={
                        <div>
                          <p>• Enter 16-digit card number</p>
                          <p>• Numbers only (no letters)</p>
                          <p>• Do not include spaces</p>
                          <p>• Example: 1234567812345678</p>
                        </div>
                      }
                    >
                      <InfoCircleFilled className="text-gray-500 cursor-pointer" />
                    </Tooltip>
                  )}
                </div>
                <Form.Item
                  className="mb-0"
                  name="cardNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please entrt card number.",
                    },
                    {
                      pattern: /^[0-9]{16}$/,
                      message: "Card number must be exactly 16 digits.",
                    },
                  ]}
                  hasFeedback={isHighSupport}
                >
                  <Input
                    type="number"
                    size="large"
                    placeholder="Card Number"
                    maxLength={16}
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  />
                </Form.Item>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-600">Expiry Date</p>
                  {isHighSupport && (
                    <Tooltip
                      title={
                        <div>
                          <p>• Select card expiry month & year</p>
                          <p>• Must be a future date</p>
                          <p>• Format: MM/YY</p>
                          <p>• Example: 08/27</p>
                        </div>
                      }
                    >
                      <InfoCircleFilled className="text-gray-500 cursor-pointer" />
                    </Tooltip>
                  )}
                </div>
                <Form.Item
                  className="mb-0"
                  name="expiry"
                  rules={[
                    {
                      required: true,
                      message: "Please select expiry date.",
                    },
                  ]}
                  hasFeedback={isHighSupport}
                >
                  <DatePicker
                    size="large"
                    picker="month"
                    format="MM/YY"
                    className="w-full"
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf("month");
                    }}
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  />
                </Form.Item>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-600">CVV</p>
                  {isHighSupport && (
                    <Tooltip
                      title={
                        <div>
                          <p>• 3-digit security code</p>
                          <p>• Located on back of your card</p>
                          <p>• Do not share with anyone</p>
                        </div>
                      }
                    >
                      <InfoCircleFilled className="text-gray-500 cursor-pointer" />
                    </Tooltip>
                  )}
                </div>
                <Form.Item
                  className="mb-0"
                  name="cvv"
                  rules={[
                    {
                      required: true,
                      message: "Please entrt CVV.",
                    },
                    {
                      pattern: /^[0-9]{3}$/,
                      message: "CVV must be exactly 3 digits.",
                    },
                  ]}
                  hasFeedback={isHighSupport}
                >
                  <Input
                    size="large"
                    placeholder="CVV"
                    maxLength={3}
                    autoComplete={isHighSupport ? "on" : "off"}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                  />
                </Form.Item>
              </div>
              <div className="col-span-2">
                <p className="text-lg">
                  Review your booking details before confirming.
                </p>

                <Form.Item
                  name="terms"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject("Please accept terms & conditons."),
                    },
                  ]}
                >
                  <Checkbox>I agree to terms & conditions.</Checkbox>
                </Form.Item>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-between">
            {current > 0 && current < 4 && (
              <Button size="large" onClick={prev}>
                Previous
              </Button>
            )}

            {current < steps.length - 1 && (
              <Button type="primary" htmlType="submit" size="large">
                Next
              </Button>
            )}

            {current === steps.length - 1 && (
              <LoadableButton
                className="mt-4 px-9 pb-1"
                type="submit"
                lable="Pay & Confirm"
                loadingLable="Confirming your booking..."
                isLoading={isLoadingSubmit}
              />
            )}
          </div>
        </Form>
      </div>
      {isHighSupport && <AccessibilityPanel />}
    </div>
  );
}
