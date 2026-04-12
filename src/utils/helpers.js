/* ─── localStorage helpers ─── */
export const ld = (k, fb) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }
  catch { return fb; }
};

export const sv = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

/* ─── ID / formatting helpers ─── */
export const genId = () => {
  const arr = new Uint32Array(2);
  crypto.getRandomValues(arr);
  return "MK" + arr[0].toString(36).toUpperCase() + arr[1].toString(36).toUpperCase();
};

export const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "2-digit",
  });

export const fmtTime = (iso) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });

/* ─── Seat-availability helper ───
 * Reads from the public `seat_counts` view.
 */
export const usedSeats = (seatCounts, cId, date, sId) => {
  if (!seatCounts) return 0;
  const match = seatCounts.find(
    (s) => s.center === cId && s.exam_date === date && s.slot === sId
  );
  return match ? parseInt(match.used_seats || 0, 10) : 0;
};
