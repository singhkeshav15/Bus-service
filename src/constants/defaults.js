/* ─── Storage Keys ─── */
export const BK = "mk_bookings_v2";
export const SK = "mk_settings_v2";

/* ─── Default Settings ─── */
export const DEFAULT_SETTINGS = {
  brandName: "MK Bus Service",
  tagline: "Your Trusted Exam Transport Partner",
  upiId: "singhkeshavv19@okhdfcbank",
  upiName: "Keshav singh",
  upiQr: "",
  seatsPerSlot: 50,
  whatsapp: "919876543210",
  supportPhone: "9876543210",
  waTemplateApproved: "Hi {name},\nYour NPTEL Bus Service booking (ID: {id}) has been *APPROVED*.\nYour seat is safely confirmed. See you on exam day! 🚌\n\n🎁 Earn ₹20 per Referral! Share your Booking ID as a referral code. After 4 successful bookings with your referral, you'll get ₹100 directly!",
  waTemplateRejected: "Hi {name},\nYour NPTEL Bus Service booking (ID: {id}) could not be verified and has been *REJECTED*.\nPlease contact support for more details. ❌",
  waTemplateReferralReward: "Hi {name}!\nGreat news from NPTEL Bus Service! Your referral code ({code}) has been successfully used by {count} student(s) so far.\n\nPlease reply with your UPI QR or Phone number so we can process your cashback reward! 🎁",
  announcement: "🚌 NPTEL April 2026 booking is LIVE! Reserve your seat before slots fill up.",
  announcementOn: true,
  showSeatCounts: false,
  centers: [],
  dates: [],
  slots: [],
  pickupPoints: [
    "GLA Main Gate", "Chhatikara", "Govardhan Chauraha", "Tank Chauraha",
    "Krishna Valley", "Radha Valley", "Mandi chauraha", "Township chauraha"
  ],
  instructions:
    "1. Open PhonePe / Google Pay / Paytm\n2. Search or enter the UPI ID\n3. Pay the exact amount\n4. Take a clear screenshot of the success screen\n5. Note your UTR / Transaction ID",
  footerNote: "Operated by students, for students. Safe · Punctual · Affordable.",
};
