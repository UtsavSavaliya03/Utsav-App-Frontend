import { useEffect, useState } from "react";

const useClickTracker = () => {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleClick = () => {
      setClickCount((prev) => prev + 1);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return clickCount;
};

export default useClickTracker;