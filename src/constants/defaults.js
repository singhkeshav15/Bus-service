/* ─── Storage Keys ─── */
export const BK = "mk_bookings_v2";
export const SK = "mk_settings_v2";

/* ─── Default Settings ─── */
export const DEFAULT_SETTINGS = {
  brandName: "MK Bus Service",
  tagline: "Your Trusted Exam Transport Partner",
  upiId: "mkbusservice@paytm",
  upiName: "MK Bus Service",
  upiQr: "",
  adminPass: "mk@admin",
  seatsPerSlot: 50,
  whatsapp: "919876543210",
  supportPhone: "9876543210",
  announcement: "🚌 NPTEL May 2025 booking is LIVE! Reserve your seat before slots fill up.",
  announcementOn: true,
  centers: [
    { id: "c1", name: "Punjab University",  city: "Chandigarh", price: 299, address: "Sector 14, Chandigarh" },
    { id: "c2", name: "Thapar Institute",   city: "Patiala",    price: 249, address: "Bhadson Rd, Patiala" },
    { id: "c3", name: "GNDU Campus",        city: "Amritsar",   price: 199, address: "G.T. Road, Amritsar" },
    { id: "c4", name: "NIT Jalandhar",      city: "Jalandhar",  price: 249, address: "GT Road, Jalandhar" },
  ],
  dates: ["2025-05-17", "2025-05-18", "2025-05-24", "2025-05-25"],
  slots: [
    { id: "s1", label: "Morning Shift",   time: "Depart 7:30 AM · Return after exam" },
    { id: "s2", label: "Afternoon Shift", time: "Depart 12:00 PM · Return after exam" },
  ],
  instructions:
    "1. Open PhonePe / Google Pay / Paytm\n2. Search or enter the UPI ID\n3. Pay the exact amount\n4. Take a clear screenshot of the success screen\n5. Note your UTR / Transaction ID",
  footerNote: "Operated by students, for students. Safe · Punctual · Affordable.",
};
