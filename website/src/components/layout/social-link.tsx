"use client";

import * as React from "react";
import { trackEvent } from "@/lib/tagflow";

interface SocialLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  network: "facebook" | "instagram";
}

export function SocialLink({ network, onClick, ...props }: SocialLinkProps) {
  return (
    <a
      onClick={(event) => {
        if (network === "facebook") {
          trackEvent("click_facebook", { placement: "footer" });
        }
        onClick?.(event);
      }}
      {...props}
    />
  );
}
