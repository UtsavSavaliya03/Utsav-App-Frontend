import React from 'react';
import { Card, Typography, Button, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import thanksImg from '../../assets/images/thanks.svg';

const { Title, Text } = Typography;

export default function Feedback() {
  const feedbackLink = "https://forms.gle/2VyuXiWNvWXiKw8c9";

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <Card className="rounded-3xl border-0 shadow-md text-center">
          <div className="py-6 space-y-6">
            <img className='size-40 mx-auto' src={thanksImg} />

            <div>
              <Title level={2} className="!mb-2">
                Thank You for Participating
              </Title>
              <Text className="text-base text-gray-600">
                Your task has been completed successfully. Thank you for taking part in this research study. Your participation helps improve adaptive interface design for users experiencing cognitive load.
              </Text>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-left">
              <p className="font-semibold text-gray-800 mb-2">
                Final Feedback Form
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Please take 1–2 minutes to complete the final feedback form. Your feedback is extremely valuable for this research.
              </p>

              <a
                href={feedbackLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  type="primary"
                  size="large"
                  className="!rounded-xl !px-8"
                >
                  Open Feedback Form
                </Button>
              </a>
            </div>

            <p className="text-sm text-gray-500">
              Once again, thank you for your time and contribution.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
