import React, { useEffect, useMemo, useState } from "react";
import { Card, Typography, Button, Progress } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const taskPages = [
  { name: "Login Task", route: "/login" },
  { name: "Signup Task", route: "/register" },
  { name: "Hotel Booking Wizard", route: "/booking-wizard" },
  { name: "Job Application Chat", route: "/job-application" },
  { name: "Decision Interface", route: "/decision-interface" },
];

export default function Landing() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(60);

  const randomTask = useMemo(() => {
    return taskPages[Math.floor(Math.random() * taskPages.length)];
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(randomTask.route);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, randomTask]);

  const handleStartNow = () => {
    navigate(randomTask.route);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-6xl space-y-8">
        <Card className="rounded-3xl border-0 shadow-sm">
          <div className="space-y-6">
            <div>
              <Title level={2} className="!mb-2">
                Welcome to the Research Study
              </Title>
              <Text className="text-base text-gray-600">
                You are participating in a usability and interaction research
                study focused on adaptive user interface design. During this
                study, you may be presented with different interface styles and
                support levels based on interaction behaviour. Please complete
                the tasks naturally as if they were real scenarios.
              </Text>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <p className="font-semibold text-gray-800 mb-2">
                Important Information
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• This study is for academic research purposes only.</p>
                <p>
                  • No real payment, booking, or job application will be
                  processed.
                </p>
                <p>
                  • Your interaction patterns may be anonymously recorded for
                  analysis.
                </p>
                <p>
                  • After completing your assigned task, you will be asked to
                  submit feedback.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div>
          <Title level={4} className="!mb-4">
            Available Research Tasks
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {taskPages.map((task, index) => (
              <Card
                key={index}
                className="rounded-2xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <p className="font-semibold text-lg">{task.name}</p>
                <p className="text-sm text-gray-500 mt-2">
                  You may select this task manually, or wait for automatic
                  assignment.
                </p>
                <Button
                  type="default"
                  className="!mt-4 !rounded-xl"
                  onClick={() => navigate(task.route)}
                >
                  Continue with this task
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <Card className="rounded-3xl border-0 shadow-sm bg-white">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  Automatic Task Assignment
                </p>
                <p className="text-sm text-gray-600">
                  You can choose a task manually above, or you will be
                  redirected automatically in {secondsLeft} seconds.
                </p>
              </div>

              <Button
                type="primary"
                size="large"
                className="!rounded-xl !px-8"
                onClick={handleStartNow}
              >
                Start Now
              </Button>
            </div>

            <Progress
              percent={Math.round(((60 - secondsLeft) / 60) * 100)}
              showInfo={false}
            />

            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-gray-700">
              Assigned task for this session:{" "}
              <span className="font-semibold">{randomTask.name}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
