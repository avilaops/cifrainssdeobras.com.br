import Link from "next/link";
import { Facebook, Instagram, Mail, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CONTACT_EMAIL, FACEBOOK_URL, INSTAGRAM_URL } from "@/config/contact";
import { Logo } from "@/components/layout/logo";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { EmailLink } from "@/components/layout/email-link";
import { SocialLink } from "@/components/layout/social-link";

const footerServices = [
  { label: "INSS de obra", href: "/servicos/inss-de-obra/" },
  { label: "CNO", href: "/servicos/cno/" },
  { label: "SERO", href: "/servicos/sero/" },
  { label: "Aferição de obra", href: "/servicos/afericao-de-obra/" },
  { label: "Planejamento tributário", href: "/servicos/planejamento-tributario/" },
  { label: "Todos os serviços", href: "/servicos/" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-pine-950 text-sage-200">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="max-w-xs">
            <Logo tone="dark" />
            <p className="mt-4 text-sm leading-relaxed">
              Consultoria especializada em INSS de obra, CNO, SERO, aferição e
              regularização tributária de obras em todo o Brasil.
            </p>
            {(INSTAGRAM_URL || FACEBOOK_URL) && (
              <div className="mt-5 flex gap-3">
                {INSTAGRAM_URL && (
                  <SocialLink
                    network="instagram"
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram da CIFRA"
                    className="inline-flex size-10 items-center justify-center rounded-lg bg-paper/10 text-paper transition-colors hover:bg-paper/20"
                  >
                    <Instagram aria-hidden="true" className="size-5" />
                  </SocialLink>
                )}
                {FACEBOOK_URL && (
                  <SocialLink
                    network="facebook"
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook da CIFRA"
                    className="inline-flex size-10 items-center justify-center rounded-lg bg-paper/10 text-paper transition-colors hover:bg-paper/20"
                  >
                    <Facebook aria-hidden="true" className="size-5" />
                  </SocialLink>
                )}
              </div>
            )}
          </div>

          {/* Menu */}
          <nav aria-label="Menu do rodapé">
            <h2 className="text-sm font-bold tracking-wider text-paper uppercase">
              Menu
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/parceiros/"
                  className="transition-colors hover:text-paper"
                >
                  Parceiros
                </Link>
              </li>
            </ul>
          </nav>

          {/* Serviços */}
          <nav aria-label="Serviços">
            <h2 className="text-sm font-bold tracking-wider text-paper uppercase">
              Serviços
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerServices.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contato */}
          <div>
            <h2 className="text-sm font-bold tracking-wider text-paper uppercase">
              Contato
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <WhatsAppLink placement="footer" trackingLabel="WhatsApp comercial" className="inline-flex items-center gap-2 transition-colors hover:text-paper">
                  <MessageCircle aria-hidden="true" className="size-4" />
                  WhatsApp comercial
                </WhatsAppLink>
              </li>
              {CONTACT_EMAIL && (
                <li>
                  <EmailLink
                    email={CONTACT_EMAIL}
                    className="inline-flex items-center gap-2 transition-colors hover:text-paper"
                  >
                    <Mail aria-hidden="true" className="size-4" />
                    {CONTACT_EMAIL}
                  </EmailLink>
                </li>
              )}
              <li>
                <a
                  href={siteConfig.url}
                  className="transition-colors hover:text-paper"
                >
                  {siteConfig.domain}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Aviso legal */}
        <div className="mt-12 border-t border-paper/10 pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-sage-300">
            {siteConfig.footerLegal}
          </p>
          <div className="mt-6 flex flex-col gap-4 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {siteConfig.legalName}. Todos os direitos reservados.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <Link
                  href="/politica-de-privacidade/"
                  className="transition-colors hover:text-paper"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/termos-de-uso/"
                  className="transition-colors hover:text-paper"
                >
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
