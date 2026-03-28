export function ToastContainer({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast"
          style={{
            borderLeft: `3px solid ${
              t.type === "success" ? "#10B981" : t.type === "error" ? "#F43F5E" : "#F97316"
            }`,
          }}
        >
          <span style={{ fontSize: 16 }}>
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "•"}
          </span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
