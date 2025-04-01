"use client";

import { SessionProvider } from "next-auth/react";

// Ensure the SessionProvider is only used on the client side
export default function ClientSessionWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
