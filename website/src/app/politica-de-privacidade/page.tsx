import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como a CIFRA trata os dados pessoais informados no site, em conformidade com a LGPD.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <PageHeader
        title="Política de Privacidade"
        description="Como tratamos os dados que você informa neste site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 , LGPD)."
        currentLabel="Política de Privacidade"
      />

      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-10 px-4 text-base leading-relaxed text-graphite-700 sm:px-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              1. Quem somos
            </h2>
            <p className="mt-3">
              Esta política se aplica ao site {siteConfig.domain}, mantido pela
              CIFRA , Consultoria Tributária de Obra (&quot;CIFRA&quot;,
              &quot;nós&quot;). Ao utilizar o site, você concorda com as
              práticas descritas aqui.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              2. Quais dados coletamos
            </h2>
            <p className="mt-3">
              O site coleta apenas os dados que você informa voluntariamente no
              formulário de análise inicial: nome, telefone com WhatsApp,
              e-mail (opcional), cidade e estado, e informações sobre a obra
              (tipo de cliente, situação, tipo, área aproximada, datas
              aproximadas, existência de CNO e aferição no SERO, valor de INSS
              apresentado e observações).
            </p>
            <p className="mt-3">
              Com o seu consentimento, também podemos coletar dados de
              navegação por meio de cookies de medição (ver seção 6).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              3. Para que usamos os dados
            </h2>
            <p className="mt-3">
              Os dados do formulário são utilizados exclusivamente para
              realizar o atendimento comercial solicitado por você: analisar as
              informações da obra e dar sequência à conversa pelo WhatsApp.
              Não vendemos nem compartilhamos seus dados com terceiros para
              fins de marketing.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              4. Como os dados trafegam
            </h2>
            <p className="mt-3">
              Este site não armazena os dados do formulário em servidores
              próprios. Ao enviar o formulário, as informações são organizadas
              em uma mensagem e encaminhadas diretamente ao WhatsApp da CIFRA,
              por meio do aplicativo ou do WhatsApp Web no seu próprio
              dispositivo. A partir daí, a conversa fica sujeita também aos
              termos e à política de privacidade do WhatsApp.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              5. Base legal e consentimento
            </h2>
            <p className="mt-3">
              O envio do formulário exige o aceite expresso desta política
              (art. 7º, I, da LGPD , consentimento) e destina-se à execução de
              procedimentos preliminares ao contrato de consultoria (art. 7º,
              V). Você pode retirar o consentimento a qualquer momento
              solicitando a exclusão dos seus dados pelos nossos canais de
              contato.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              6. Cookies e medição de audiência
            </h2>
            <p className="mt-3">
              Podemos utilizar cookies de medição e marketing por meio do
              Tagflow somente após o seu consentimento no aviso de cookies.
              Esses cookies ajudam a entender o uso do site e a medir campanhas
              , nenhum dado do formulário é enviado a essas ferramentas. Você
              pode recusar os cookies sem perder nenhuma funcionalidade do
              site.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              7. Seus direitos
            </h2>
            <p className="mt-3">
              Nos termos da LGPD, você pode solicitar a confirmação de
              tratamento, o acesso, a correção, a anonimização ou a exclusão
              dos seus dados, bem como a revogação do consentimento. Para
              exercer esses direitos, fale conosco pelo WhatsApp disponível no
              site.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-graphite-900">
              8. Alterações desta política
            </h2>
            <p className="mt-3">
              Esta política pode ser atualizada para refletir mudanças legais
              ou operacionais. A versão vigente estará sempre publicada nesta
              página. Consulte também os nossos{" "}
              <Link
                href="/termos-de-uso/"
                className="font-semibold text-pine-700 underline underline-offset-2"
              >
                Termos de Uso
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
