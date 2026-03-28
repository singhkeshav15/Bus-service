import { useState, useEffect } from "react";

export function Counter({ target, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(start);
      if (start >= target) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [target]);

  return <>{prefix}{val}{suffix}</>;
}
