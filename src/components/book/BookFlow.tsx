"use client";

import { useState } from "react";
import PhoneOtpGate from "./PhoneOtpGate";
import BookingWizard from "./BookingWizard";

/**
 * Orchestrates the guest booking funnel: phone→OTP gate, then the wizard. If the
 * session later turns out to be invalid (401 on a call), we drop back to the gate.
 */
export default function BookFlow({ hasSession }: { hasSession: boolean }) {
  const [authed, setAuthed] = useState(hasSession);

  if (!authed) {
    return (
      <PhoneOtpGate
        collectName
        title="Book a pickup or delivery"
        subtitle="Confirm your number to get started — no account needed."
        verifyCtaLabel="Continue"
        onVerified={() => setAuthed(true)}
      />
    );
  }

  return <BookingWizard onSessionExpired={() => setAuthed(false)} />;
}
