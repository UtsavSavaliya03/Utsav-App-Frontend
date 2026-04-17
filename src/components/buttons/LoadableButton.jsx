import { Button, Spin } from "antd";
import React from "react";

export default function LoadableButton({
  lable,
  icon,
  type = "button",
  isLoading = false,
  loadingLable = "Loading...",
  className,
  onClick,
  disabled = false,
}) {
  return (
    <Button
      type="primary"
      htmlType={type}
      size="large"
      disabled={disabled}
      onClick={onClick}
      className={`${className} duration-500 ${isLoading ? "cursor-not-allowed" : null} `}
      loading={isLoading}
    >
      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="ml-4">{loadingLable}</p>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-3">
          {icon} <p className="text-lg">{lable}</p>
        </div>
      )}
    </Button>
  );
}
