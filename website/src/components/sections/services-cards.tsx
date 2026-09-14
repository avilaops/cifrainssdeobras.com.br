import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/config/services";
import { Reveal } from "@/components/motion/reveal";

/** Grid de cards de serviços (usado na home e em /servicos). */
export function ServicesCards() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map(({ icon: Icon, title, description, href }, index) => (
        <li key={title}>
          <Reveal
            delay={(index % 3) * 0.05}
            className="group flex h-full flex-col rounded-xl border border-graphite-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-lg bg-sage-50 text-pine-700">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-bold text-graphite-900">
              {title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-500">
              {description}
            </p>
            <Link
              href={href}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-pine-700 transition-colors group-hover:text-pine-800"
            >
              Saiba mais
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
              <span className="sr-only"> sobre {title}</span>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
