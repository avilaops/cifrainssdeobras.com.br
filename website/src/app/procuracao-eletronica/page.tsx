import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Procuração Eletrônica RFB",
  description:
    "Passo a passo para autorizar a CIFRA a acessar os sistemas da Receita Federal em seu nome, pelo gov.br.",
};

const CIFRA_CNPJ = "47.772.724/0001-17";
const PORTAL_URL =
  "https://servicos.receitafederal.gov.br/servico/autorizacoes/minhas-autorizacoes";

const stepsData = [
  {
    title: "Acesse o Portal de Serviços da Receita Federal",
    text: "Abra servicos.receitafederal.gov.br/servico/autorizacoes/minhas-autorizacoes e clique em Entrar com gov.br, informando seu CPF e senha.",
  },
  {
    title: "Abra Minhas Autorizações de Acesso",
    text: "Na tela inicial, clique no botão + Nova Autorização.",
  },
  {
    title: "Informe os dados da CIFRA",
    text: `Em Pessoa Autorizada, digite o CNPJ ${CIFRA_CNPJ} e confirme o nome CIFRA , Consultoria Tributária de Obra. Definir validade.`,
  },
  {
    title: "Selecione os serviços autorizados",
    text: "Clique em Selecionar Serviços e marque os itens do eSocial, SERO, CNO, DCTFWeb e PER/DCOMP.",
  },
  {
    title: "Revise e assine",
    text: "Clique em Avançar, confira o resumo da autorização e finalize clicando em Assinar com sua conta gov.br.",
  },
  {
    title: "Pronto",
    text: "A autorização passa a aparecer na aba Concedidas de Minhas Autorizações de Acesso.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como emitir procuração eletrônica para a CIFRA no e-CAC / Receita Federal",
  description:
    "Passo a passo simples para autorizar a CIFRA a acessar os sistemas da Receita Federal (SERO, CNO, DCTFWeb) via gov.br.",
  step: stepsData.map((step, idx) => ({
    "@type": "HowToStep",
    position: idx + 1,
    name: step.title,
    text: step.text,
  })),
};

const steps = [
  {
    title: "Acesse o Portal de Serviços da Receita Federal",
    description: (
      <>
        Abra{" "}
        <a
          href={PORTAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-pine-700 underline underline-offset-2"
        >
          servicos.receitafederal.gov.br/servico/autorizacoes/minhas-autorizacoes
        </a>{" "}
        e clique em <strong>&quot;Entrar com gov.br&quot;</strong>, informando
        seu CPF e senha.
      </>
    ),
  },
  {
    title: "Abra Minhas Autorizações de Acesso",
    description: (
      <>
        Na tela inicial, clique no botão{" "}
        <strong>&quot;+ Nova Autorização&quot;</strong>.
      </>
    ),
  },
  {
    title: "Informe os dados da CIFRA",
    description: (
      <>
        Em &quot;Pessoa Autorizada&quot;, digite o CNPJ{" "}
        <strong>{CIFRA_CNPJ}</strong> e confirme que o nome exibido é{" "}
        <strong>CIFRA , Consultoria Tributária de Obra</strong>. Em
        &quot;Validade&quot;, recomendamos 3 meses após o término previsto da
        obra (ou 2 meses a partir de hoje, se a obra já estiver concluída).
      </>
    ),
  },
  {
    title: "Selecione os serviços autorizados",
    description: (
      <>
        Clique em <strong>&quot;Selecionar Serviços&quot;</strong> e marque os
        itens abaixo , ou, para simplificar, ative a opção{" "}
        <strong>&quot;Todos&quot;</strong>.
      </>
    ),
  },
  {
    title: "Revise e assine",
    description: (
      <>
        Clique em <strong>&quot;Avançar&quot;</strong>, confira o resumo da
        autorização e finalize clicando em{" "}
        <strong>&quot;Assinar&quot;</strong> com sua conta gov.br.
      </>
    ),
  },
  {
    title: "Pronto",
    description: (
      <>
        A autorização passa a aparecer na aba <strong>&quot;Concedidas&quot;</strong>{" "}
        de &quot;Minhas Autorizações de Acesso&quot;. A partir daí, a CIFRA já
        consegue atuar em seu nome nos sistemas liberados.
      </>
    ),
  },
];

const services = [
  "eSocial , Download",
  "eSocial , Download Doméstico",
  "eSocial , Grupo de Acesso Web",
  "eSocial , Grupo Desligamento",
  "eSocial , Grupo Especial",
  "eSocial , Grupo Preliminar",
  "eSocial , Grupo Rotinas",
  "eSocial , Grupo SST",
  "eSocial , Processo Trabalhista",
  "Sistema DCTFWeb",
  "SERO , Aferição de Obras",
  "CNO , Cadastro Nacional de Obras",
  "PER/DCOMP Web (consulta e processamento)",
  "Situação Fiscal do Contribuinte",
  "Parcelamentos , solicitar e acompanhar",
  "Processos Digitais e Requerimentos Web",
  "Caixa Postal , Mensagens",
  "Declarações , DCTF",
];

export default function ProcuracaoEletronicaPage() {
  return (
    <>
      <JsonLd data={howToJsonLd} />
      <PageHeader
        title="Como autorizar a CIFRA a acessar seus dados na Receita Federal"
        description="A procuração eletrônica permite que a CIFRA cuide da regularização tributária da sua obra diretamente nos sistemas da Receita Federal, sem burocracia extra para você. Leva menos de 5 minutos."
        currentLabel="Procuração Eletrônica"
      />

      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ol className="relative space-y-2">
            {steps.map((step, index) => (
              <li key={step.title} className="relative pb-2 pl-16 last:pb-0">
                {index < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-12 left-[1.4rem] h-[calc(100%-2rem)] w-px bg-sage-200"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute top-1 left-0 inline-flex size-11 items-center justify-center rounded-full border border-pine-600/20 bg-white text-base font-extrabold text-pine-700 shadow-soft"
                >
                  {index + 1}
                </span>
                <div className="rounded-xl border border-graphite-100 bg-white p-5 shadow-soft">
                  <h2 className="text-base font-bold text-graphite-900">
                    {step.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-graphite-500">
                    {step.description}
                  </p>

                  {index === 3 && (
                    <ul className="mt-4 grid gap-x-6 gap-y-2 border-t border-graphite-100 pt-4 text-sm text-graphite-700 sm:grid-cols-2">
                      {services.map((service) => (
                        <li key={service} className="flex items-start gap-2">
                          <CheckCircle2
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0 text-pine-600"
                          />
                          {service}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-xl border border-graphite-100 bg-sage-50 p-6 text-center sm:p-8">
            <p className="text-base font-semibold text-graphite-900">
              Ficou com dúvida em algum passo?
            </p>
            <p className="mt-1.5 text-sm text-graphite-500">
              Fale com a gente pelo WhatsApp que ajudamos você a concluir.
            </p>
            <Button asChild className="mt-5" variant="whatsapp">
              <WhatsAppLink
                placement="process"
                trackingLabel="Dúvida na procuração eletrônica"
                message="Olá! Estou com uma dúvida na procuração eletrônica da Receita Federal."
              >
                Chamar no WhatsApp
              </WhatsAppLink>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
