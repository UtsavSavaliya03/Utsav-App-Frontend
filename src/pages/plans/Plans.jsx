import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Tag, Typography, message, notification } from "antd";
import AccessibilityPanel from "../../components/accessibilityPanel/AccessibilityPanel.jsx";
import { analyseUserApi, sessionApi } from "./plansAPI.js";
import { useNavigate } from "react-router-dom";
import LoadableButton from "../../components/buttons/LoadableButton.jsx";

const { Title, Text } = Typography;

const plans = [
  // Standard UI shows essential info only

  {
    id: "basic",
    name: "Basic Plan",
    price: "£19/month",
    priceHelp: "(Billed monthly, Cancel anytime, No hidden charges)",
    features: [
      "1 Project",
      "Email Support",
      "Basic Analytics",
      "Basic Security",
      "Mobile Access",
      "Community Support",
    ],
    details: [
      "Ideal for personal use",
      "Basic reporting dashboard",
      "Standard onboarding support",
    ],
    recommended: false,
  },
  {
    id: "standard",
    name: "Standard Plan",
    price: "£39/month",
    priceHelp:
      "(Most popular choice, Includes priority support, Flexible cancellation)",
    features: [
      "5 Projects",
      "Priority Support",
      "Advanced Analytics",
      "Team Collaboration",
      "Custom Reports",
      "Faster Response Time",
    ],
    details: [
      "Best balance of price and value",
      "Priority response from support team",
      "Most selected by professionals",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "£69/month",
    priceHelp: "(Best for growing teams, Full access to all premium features)",
    features: [
      "Unlimited Projects",
      "24/7 Support",
      "Full Reports",
      "Advanced Automation",
      "Team Management",
      "API Access",
    ],
    details: [
      "Suitable for scaling businesses",
      "Advanced reporting + exports",
      "Higher flexibility for teams",
    ],
    recommended: false,
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: "Custom Pricing",
    priceHelp: "(Tailored for large businesses, Contact sales for exact quote)",
    features: [
      "Dedicated Manager",
      "Custom Integration",
      "Enterprise Security",
      "Compliance Support",
      "Custom SLA",
      "Dedicated Infrastructure",
    ],
    details: [
      "For large organisations",
      "Custom onboarding workflow",
      "Enterprise-grade compliance",
    ],
    recommended: false,
  },
];

export default function DecisionInterfacePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isHighSupport, setIsHighSupport] = useState(false);
  const [score, setScore] = useState(0);
  const [switchTime, setSwitchTime] = useState(0);

  // Tracking Metrics
  const [optionChanges, setOptionChanges] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [rapidClicks, setRapidClicks] = useState(0);
  const [pauseDuration, setPauseDuration] = useState(0);

  const startTimeRef = useRef(Date.now());
  const lastInteractionRef = useRef(Date.now());
  const lastClickRef = useRef(0);
  const idleTimerRef = useRef(null);
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      title: "Welcome! 👋",
      description:
        "Compare features, pricing, and benefits before making your decision. This task is part of a research study to understand user decision-making and interface interaction patterns. No real payment or subscription will be processed.",
      type: "warning",
      showProgress: true,
      pauseOnHover: true,
      style: { width: 600 },
      duration: 20,
    });
  };

  useEffect(() => {
    resetIdleTimer();
    openNotification();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    const now = Date.now();
    const idle = Math.floor((now - lastInteractionRef.current) / 1000);
    setPauseDuration(idle);
    lastInteractionRef.current = now;

    idleTimerRef.current = setTimeout(() => {
      const paused = Math.floor(
        (Date.now() - lastInteractionRef.current) / 1000,
      );
      setPauseDuration(paused);

      if (paused >= 20 && !isHighSupport) {
        analyseUser();
      }
    }, 20000);
  };

  const handlePlanClick = (planId) => {
    const now = Date.now();

    // Rage click detection
    if (now - lastClickRef.current < 500) {
      setRapidClicks((prev) => prev + 1);
    }
    lastClickRef.current = now;

    // Option switching
    if (selectedPlan && selectedPlan !== planId) {
      setOptionChanges((prev) => prev + 1);
    }

    setSelectedPlan(planId);
    setCompareCount((prev) => prev + 1);

    resetIdleTimer();

    // Trigger analysis after meaningful interaction
    if (!isHighSupport && (optionChanges >= 5 || compareCount >= 5)) {
      analyseUser();
    }
  };

  const analyseUser = async () => {
    if (isLoading || isLoadingSubmit || isHighSupport) {
      return;
    }

    setIsLoading(true);
    const timeOnTask = Math.floor((Date.now() - startTimeRef.current) / 1000);
    try {
      const params = {
        decision: true,
        timeOnTask,
        optionChanges,
        compareCount,
        pauseDuration,
        rapidClicks,
      };
      const data = await analyseUserApi(params);
      if (data?.status) {
        // Trigger support mode
        if (data?.data?.score > 0.6) {
          setIsHighSupport(true);
          setScore(data?.data?.score);
          setSwitchTime(timeOnTask);
        }
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error wwhile analyzing user:", error);
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedPlan) {
      message.warning("Please select a plan first.");
      return;
    }
    try {
      setIsLoadingSubmit(true);

      const params = {
        task: "decision_making",
        timeTaken: Math.floor((Date.now() - startTimeRef.current) / 1000),
        optionChanges,
        compareCount,
        pauseDuration,
        rapidClicks,
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

  return (
    <div className="min-h-screen md:flex bg-gray-50 p-6 md:p-10 gap-6">
      <div className="w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Title level={2} className="!mb-1">
              Choose Your Plan
            </Title>
            <p className="text-md text-gray-600">
              Please review the available plans carefully and select the option
              you feel is most suitable for your needs.
            </p>
          </div>

          <LoadableButton
            className="px-9"
            onClick={handleContinue}
            lable="Confirm"
            loadingLable="Confirming plan..."
            isLoading={isLoadingSubmit}
          />
        </div>

        {isHighSupport && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="font-semibold text-gray-800 mb-1">
              Recommended Choice: Standard Plan ⭐
            </p>
            <p className="text-sm text-gray-600">
              Best for most users with balanced pricing, strong features, and
              priority support.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const active = selectedPlan === plan.id;
            const recommendedHighlight = isHighSupport && plan.recommended;

            return (
              <Card
                key={plan.id}
                hoverable
                onClick={() => handlePlanClick(plan.id)}
                className={`rounded-2xl cursor-pointer border transition-all duration-200 ${
                  active
                    ? "border-blue-500 shadow-lg"
                    : recommendedHighlight
                      ? "border-green-500 shadow-md scale-[1.02]"
                      : "border-gray-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    {recommendedHighlight && (
                      <Tag color="green">Recommended</Tag>
                    )}
                  </div>

                  <p className="text-lg font-bold mt-4">{plan.price}</p>
                  {isHighSupport && (
                    <p className="font-semibold text-gray-500 mt-0">
                      {plan.priceHelp}
                    </p>
                  )}

                  <div className="space-y-2 mt-4">
                    {/* Standard UI = basic features only */}
                    {plan.features.map((feature, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        • {feature}
                      </p>
                    ))}
                  </div>

                  {/* High Support UI = extra details + stronger guidance */}
                  {isHighSupport && (
                    <div className="bg-gray-50 p-3 my-3 rounded-xl text-sm text-gray-700 space-y-2">
                      <p className="font-medium">More Details</p>
                      {plan.details.map((item, idx) => (
                        <p key={idx}>• {item}</p>
                      ))}
                    </div>
                  )}

                  {recommendedHighlight && (
                    <div className="bg-green-50 p-3 rounded-xl text-sm text-gray-700">
                      Best for most users looking for value + performance.
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      {contextHolder}
      {isHighSupport && <AccessibilityPanel />}
    </div>
  );
}
