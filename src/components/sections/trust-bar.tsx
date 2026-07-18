import { BadgeCheck, Globe, Headset, ShieldCheck } from "lucide-react";

const items = [
  { icon: BadgeCheck, label: "Consultoria especializada" },
  { icon: Globe, label: "Atendimento em todo o Brasil" },
  { icon: ShieldCheck, label: "Processo seguro e documentado" },
  { icon: Headset, label: "Suporte em todas as etapas" },
];

/** Faixa de credibilidade abaixo do hero. */
export function TrustBar() {
  return (
    <section aria-label="Por que confiar na CIFRA" className="border-y border-graphite-100 bg-cream">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-5 px-4 py-8 sm:px-6 lg:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-3 text-sm font-semibold text-graphite-700"
          >
            <Icon aria-hidden="true" className="size-5 shrink-0 text-pine-700" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
