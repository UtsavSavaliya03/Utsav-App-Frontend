import { Button, Spin } from 'antd';
import React from 'react';

export default function LoadableButton({ lable, icon, type = "button", isLoading = false, loadingLable = "Loading...", className, onClick, disabled = false }) {
    return (
        <Button
            type='primary'
            htmlType={type}
            size='large'
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`${className} duration-500 ${isLoading ? "opacity-70 cursor-not-allowed" : null} `}
        >
            {isLoading ? (
                <div className="flex justify-center items-center ant-white-spin">
                    <Spin />
                    <p className="ml-4">{loadingLable}</p>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-3">
                    {icon} <p className='text-lg'>{lable}</p>
                </div>
            )}
        </Button>
    )
}