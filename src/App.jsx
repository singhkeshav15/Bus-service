import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

import STYLES from "./styles/globals.js";
import { DEFAULT_SETTINGS, SK } from "./constants/defaults.js";
import { ld, sv } from "./utils/helpers.js";
import { useToast } from "./hooks/useToast.js";

import { ToastContainer } from "./components/ui/ToastContainer.jsx";
import { Landing }        from "./components/landing/Landing.jsx";
import { BookingFlow }    from "./components/booking/BookingFlow.jsx";
import { Confirmation }   from "./components/booking/Confirmation.jsx";
import { AdminLogin }     from "./components/admin/AdminLogin.jsx";
import { AdminDashboard } from "./components/admin/AdminDashboard.jsx";

export default function App() {
  /* ── Inject global styles ── */
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  /* ── App state ── */
  const [page, setPage] = useState("home");
  const [settings, _setSettings] = useState(() => {
    const s = ld(SK, null);
    return s ? { ...DEFAULT_SETTINGS, ...s } : DEFAULT_SETTINGS;
  });
  const [bookings, _setBookings] = useState([]);
  const [confirmed, setConfirmed] = useState(null);
  const [toasts, toast] = useToast();

  /* ── Fetch bookings from Supabase on mount ── */
  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) { console.error(error); return; }
      _setBookings(data);
    };
    fetchBookings();
  }, []);

  /* ── Real-time subscription — live seat updates for students & admin ──
   *  Requires: Supabase dashboard → Database → Replication → enable `students` table
   */
  useEffect(() => {
    const channel = supabase
      .channel("students-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            _setBookings((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            _setBookings((prev) =>
              prev.map((b) => (b.id === payload.new.id ? payload.new : b))
            );
          } else if (payload.eventType === "DELETE") {
            _setBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  /* ── State setters ── */
  const setSettings = (s) => { _setSettings(s); sv(SK, s); };
  const setBookings = (b) => { _setBookings(b); };

  /* ── Page routing ── */
  return (
    <>
      {page === "home"        && <Landing        settings={settings} bookings={bookings} onBook={() => setPage("book")} onAdmin={() => setPage("admin-login")} />}
      {page === "book"        && <BookingFlow     settings={settings} bookings={bookings} onBack={() => setPage("home")} onConfirm={(b) => { setBookings([...bookings, b]); setConfirmed(b); setPage("confirm"); }} />}
      {page === "confirm"     && <Confirmation    booking={confirmed} settings={settings} onHome={() => setPage("home")} />}
      {page === "admin-login" && <AdminLogin      settings={settings} onBack={() => setPage("home")} onLogin={() => setPage("admin")} />}
      {page === "admin"       && <AdminDashboard  settings={settings} setSettings={setSettings} bookings={bookings} setBookings={setBookings} onLogout={() => setPage("home")} toast={toast} />}
      <ToastContainer toasts={toasts} />
    </>
  );
}
