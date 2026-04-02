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
import { TicketPass }     from "./components/booking/TicketPass.jsx";

export default function App() {
  /* ── Inject global styles ── */
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  /* ── Global Mouse Spotlight Tracker ── */
  useEffect(() => {
    const handleMove = (e) => {
      document.body.style.setProperty('--mouseX', `${e.clientX}px`);
      document.body.style.setProperty('--mouseY', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  /* ── App state ── */
  const [page, setPage] = useState("home");
  const [settings, _setSettings] = useState(() => {
    const s = ld(SK, null);
    return s ? { ...DEFAULT_SETTINGS, ...s } : DEFAULT_SETTINGS;
  });
  const [bookings, _setBookings] = useState([]);      // For Admins only
  const [seatCounts, setSeatCounts] = useState([]);   // For Public Availability
  const [session, setSession] = useState(null);       // Auth Session
  const [confirmed, setConfirmed] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [toasts, toast] = useToast();

  const handleCheckStatus = async (bookingRef, phone) => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("booking_ref", bookingRef.trim())
      .eq("phone", phone.trim().replace(/\D/g, ""))
      .single();
    if (error || !data) {
      toast("No booking found with this ID and Phone.", "error");
      return;
    }
    setTicketData(data);
    setPage("ticket");
  };

  /* ── Auth Session ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── Fetch Data ── */
  useEffect(() => {
    const fetchPublicSeatCounts = async () => {
      const { data, error } = await supabase.from("seat_counts").select("*");
      if (!error && data) setSeatCounts(data);
    };

    const fetchAdminBookings = async () => {
      if (!session) return;
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) _setBookings(data);
    };

    fetchPublicSeatCounts();
    if (session) {
      fetchAdminBookings();
    }
  }, [session, page]);

  /* ── Real-time subscription ── */
  useEffect(() => {
    // Both admin and public can listen to aggregate seat count changes if we bind it to a view,
    // but typically Supabase only streams table changes.
    // For admin, we listen to student table if authenticated.
    if (!session) return;

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
  }, [session]);

  /* ── State setters ── */
  const setSettings = (s) => { _setSettings(s); sv(SK, s); };
  const setBookings = (b) => { _setBookings(b); };

  /* ── Page routing ── */
  return (
    <>
      <div className="dot-bg" />
      {page === "home"        && <Landing        settings={settings} seatCounts={seatCounts} onBook={() => setPage("book")} onAdmin={() => setPage(session ? "admin" : "admin-login")} onCheckStatus={handleCheckStatus} />}
      {page === "book"        && <BookingFlow     settings={settings} seatCounts={seatCounts} onBack={() => setPage("home")} onConfirm={(b) => { setPage("confirm"); setConfirmed(b); }} />}
      {page === "confirm"     && <Confirmation    booking={confirmed} settings={settings} onHome={() => setPage("home")} />}
      {page === "ticket"      && <TicketPass      booking={ticketData} settings={settings} onClose={() => setPage("home")} />}
      {page === "admin-login" && <AdminLogin      settings={settings} onBack={() => setPage("home")} onLogin={() => setPage("admin")} />}
      {page === "admin"       && <AdminDashboard  settings={settings} setSettings={setSettings} bookings={bookings} setBookings={setBookings} onLogout={() => setPage("home")} toast={toast} />}
      <ToastContainer toasts={toasts} />
    </>
  );
}
