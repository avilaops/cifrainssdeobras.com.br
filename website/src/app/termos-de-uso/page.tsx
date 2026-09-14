import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Condições de uso do site da CIFRA , Consultoria Tributária de Obra.",
};

export default function TermosDeUsoPage() {
  return (
    <>
      <PageHeader
        title="Termos de Uso"
        description="Condições para utilização deste site e do seu conteúdo."
        currentLabel="Termos de Uso"
      />

      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-10 px-4 text-base leading-relaxed text-graphite-700 sm:px-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              1. Aceitação
            </h2>
            <p className="mt-3">
              Ao acessar o site {siteConfig.domain}, você concorda com estes
              Termos de Uso e com a{" "}
              <Link
                href="/politica-de-privacidade/"
                className="font-semibold text-pine-700 underline underline-offset-2"
              >
                Política de Privacidade
              </Link>
              . Se não concordar, recomendamos não utilizar o site.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              2. Natureza do conteúdo
            </h2>
            <p className="mt-3">
              O conteúdo deste site tem caráter informativo e institucional.
              Ele apresenta, em linguagem simplificada, temas relacionados à
              regularização previdenciária de obras (INSS de obra, CNO, SERO e
              aferição), e não substitui a análise individual do seu caso nem
              constitui parecer definitivo, promessa de resultado ou
              aconselhamento formal.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              3. Resultados e possibilidades de economia
            </h2>
            <p className="mt-3">
              A CIFRA presta serviços de consultoria tributária e
              administrativa relacionados à regularização de obras. Resultados
              e possibilidades de economia dependem da análise individual de
              cada caso, das características da obra, da documentação
              disponível e da legislação vigente. Nenhuma informação deste site
              deve ser interpretada como garantia de redução de valores.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              4. Uso do formulário e do WhatsApp
            </h2>
            <p className="mt-3">
              O formulário de análise inicial destina-se a contatos comerciais
              legítimos. É vedado utilizá-lo para envio de conteúdo ilícito,
              ofensivo ou automatizado (spam). O redirecionamento ao WhatsApp
              utiliza o serviço wa.me, sujeito aos termos do próprio WhatsApp.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              5. Propriedade intelectual
            </h2>
            <p className="mt-3">
              A marca CIFRA, os textos, o layout e os elementos visuais deste
              site pertencem à CIFRA ou aos seus licenciantes, sendo vedada a
              reprodução sem autorização prévia.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              6. Alterações
            </h2>
            <p className="mt-3">
              Estes termos podem ser atualizados a qualquer momento, e a versão
              vigente estará sempre publicada nesta página.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
