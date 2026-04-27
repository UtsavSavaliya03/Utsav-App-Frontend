import { Button, Switch, Slider } from "antd";
import { useAccessibility } from "../../context/AccessibilityContext.jsx";
import { useState } from "react";

export default function AccessibilityPanel() {
  const { settings, setSettings } = useAccessibility();
  const [open, setOpen] = useState(false);

  const marks = {
    12: "12",
    15: "15",
    18: "18",
    21: "21",
    24: "24",
  };

  return (
    <div>
      <div>
        <div className="fixed right-0 top-9 z-50 flex overflow-hidden">
          {/* 👉 PANEL */}
          <div className={`w-72 bg-white shadow-md rounded-l-2xl p-4 transform transition-transform duration-300 ease-in-out ${open ? "translate-x-1" : "translate-x-[120%]"}`}>
            <h2 className="text-lg font-bold mb-4">Accessibility settings</h2>
            {/* Font Size */}
            <div className="mb-4">
              <p>Text Size</p>
              <Slider
                min={12}
                max={24}
                marks={marks}
                value={settings.fontSize}
                onChange={(value) =>
                  setSettings({ ...settings, fontSize: value })
                }
              />
            </div>

            {/* Zoom */}
            <div className="mb-4">
              <p>Zoom</p>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      zoom: Math.max(0.8, settings.zoom - 0.1),
                    })
                  }
                >
                  -
                </Button>

                <span className="w-16 text-center">
                  {Math.round(settings.zoom * 100)}%
                </span>

                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      zoom: Math.min(1.5, settings.zoom + 0.1),
                    })
                  }
                >
                  +
                </Button>
              </div>
            </div>

            {/* Text to speech */}
            <div className="mb-4">
              <p>Text to Speech</p>
              <Switch
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={settings?.textToSpeech}
                onChange={(checked) =>
                  setSettings({ ...settings, textToSpeech: checked })
                }
              />
            </div>

            {/* Reset */}
            <Button
              danger
              type="primary"
              onClick={() =>
                setSettings({ fontSize: 18, zoom: 1, textToSpeech: false })
              }
            >
              Reset
            </Button>
          </div>

          {/* 👉 TAB BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="bg-blue-600 text-white px-3 py-6 rounded-l-lg shadow-lg
                   flex items-center justify-center cursor-pointer"
          >
            <span className="[writing-mode:vertical-rl] rotate-180 font-semibold">
              Accessibility
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
