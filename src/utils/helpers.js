/* ─── localStorage helpers ─── */
export const ld = (k, fb) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }
  catch { return fb; }
};

export const sv = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

/* ─── ID / formatting helpers ─── */
export const genId = () =>
  "MK" +
  Math.random().toString(36).slice(2, 5).toUpperCase() +
  Date.now().toString(36).slice(-3).toUpperCase();

export const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "2-digit",
  });

export const fmtTime = (iso) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });

/* ─── Seat-availability helper ───
 *  Sums group_size (not just row count) so a 2-seat booking
 *  correctly occupies 2 slots. Falls back to 1 for old records.
 *  Field names match the Supabase `students` table schema.
 */
export const usedSeats = (bks, cId, date, sId) =>
  bks
    .filter(
      (b) =>
        b.center === cId &&
        b.exam_date === date &&
        b.slot === sId &&
        b.payment_status !== "rejected"
    )
    .reduce((sum, b) => sum + (b.group_size || 1), 0);

