"use client";

import * as React from "react";
import { trackEvent } from "@/lib/tagflow";

interface EmailLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  email: string;
}

/** Link mailto com rastreamento de clique. */
export function EmailLink({ email, onClick, children, ...props }: EmailLinkProps) {
  return (
    <a
      href={`mailto:${email}`}
      onClick={(e) => {
        trackEvent("click_email", { placement: "footer" });
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
