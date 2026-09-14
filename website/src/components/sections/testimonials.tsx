import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

/**
 * PLACEHOLDER , nenhum depoimento real foi fornecido ainda.
 *
 * Enquanto esta lista estiver vazia, a seção NÃO é exibida no site
 * (nunca publicar depoimentos fictícios). Para ativar, adicione somente
 * depoimentos reais e autorizados, ex.:
 *
 * const testimonials: Testimonial[] = [
 *   {
 *     quote: "Texto do depoimento autorizado pelo cliente.",
 *     author: "Nome do cliente",
 *     role: "Cidade/UF ou perfil (ex.: Proprietário)",
 *   },
 * ];
 */
const testimonials: Testimonial[] = [];

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="depoimentos" className="bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Depoimentos"
            title="O que dizem sobre a CIFRA"
            align="center"
          />
        </Reveal>

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(({ quote, author, role }, index) => (
            <li key={author}>
              <Reveal
                delay={(index % 3) * 0.05}
                className="flex h-full flex-col rounded-xl border border-graphite-100 bg-white p-6 shadow-soft"
              >
                <Quote aria-hidden="true" className="size-6 text-sage-300" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-graphite-700">
                  “{quote}”
                </blockquote>
                <footer className="mt-5 border-t border-graphite-100 pt-4">
                  <p className="text-sm font-bold text-graphite-900">{author}</p>
                  <p className="text-xs text-graphite-500">{role}</p>
                </footer>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
