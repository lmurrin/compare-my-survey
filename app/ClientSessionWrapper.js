"use client";

import { SessionProvider } from "next-auth/react";

// This wrapper will ensure the SessionProvider is only used on the client side
export default function ClientSessionWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
