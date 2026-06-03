import { BookOpen, Target, Zap } from 'lucide-react'

export const FUNNEL_STAGES = [
  {
    id: 'awareness',
    title: '1. Descoberta e Consciência',
    description: 'Entenda os conceitos básicos e identifique as necessidades da sua empresa.',
    icon: BookOpen,
    articles: [
      {
        id: 1,
        title: 'O que é ERP?',
        summary:
          'Entenda o conceito de Enterprise Resource Planning e como ele centraliza a gestão.',
        content: `O ERP (Enterprise Resource Planning) é um sistema de software corporativo que centraliza e integra os processos de negócios de uma empresa em uma única plataforma.\n\nAo invés de usar planilhas isoladas ou softwares diferentes para cada departamento (Vendas, Estoque, Financeiro, RH), o ERP conecta todos esses setores. Isso significa que quando uma venda é realizada, o estoque é atualizado automaticamente e a previsão de faturamento já é registrada no financeiro.\n\nEssa integração elimina o retrabalho, reduz drasticamente os erros humanos e fornece uma fonte única de verdade para a tomada de decisões estratégicas.`,
      },
      {
        id: 2,
        title: 'Por que usar um ERP?',
        summary: 'Descubra os principais motivos que levam empresas a adotarem sistemas de gestão.',
        content: `A adoção de um ERP geralmente é impulsionada pela necessidade de crescimento escalável. Quando os processos manuais começam a gerar gargalos, o ERP se torna a solução fundamental.\n\nOs principais benefícios incluem a automação de tarefas rotineiras, melhoria no controle financeiro, gestão eficiente de estoque e conformidade fiscal automatizada.\n\nAlém disso, com dados em tempo real, os gestores conseguem identificar oportunidades de redução de custos e prever demandas, garantindo uma operação muito mais enxuta e lucrativa.`,
      },
    ],
  },
  {
    id: 'consideration',
    title: '2. Consideração da Solução',
    description: 'Avalie as opções e entenda como um ERP se aplica ao seu cenário.',
    icon: Target,
    articles: [
      {
        id: 3,
        title: 'ERP para pequenas empresas vale a pena?',
        summary: 'Mitos e verdades sobre a adoção de ERP em negócios de menor porte.',
        content: `Existe um mito comum de que ERPs são sistemas complexos feitos apenas para multinacionais. A verdade é que pequenas empresas são as que mais se beneficiam da organização inicial.\n\nImplementar um ERP na fase de crescimento da empresa garante que a fundação seja sólida. Sem um sistema centralizado, o crescimento traz o caos operacional: pedidos perdidos, falhas no fluxo de caixa e perda de clientes por mau atendimento.\n\nExistem soluções de ERP dimensionadas e precificadas especificamente para pequenas e médias empresas, oferecendo um excelente retorno sobre o investimento desde os primeiros meses.`,
      },
      {
        id: 4,
        title: 'ERP são todos iguais?',
        summary: 'Entenda as diferenças entre sistemas genéricos e especialistas.',
        content: `Não, longe disso. Basicamente, o mercado se divide entre ERPs de prateleira (genéricos) e ERPs especialistas (nichados).\n\nUm ERP genérico atende superficialmente a maioria das empresas, mas pode exigir adaptações caras ou o uso de sistemas paralelos para resolver problemas específicos do seu setor.\n\nJá um ERP especialista (como um focado em Atacado ou Comércio Exterior) já traz embarcado as melhores práticas e regras de negócios daquele segmento, reduzindo o tempo de implantação e garantindo aderência real às necessidades da operação.`,
      },
      {
        id: 5,
        title: 'Como escolher um ERP?',
        summary: 'Critérios fundamentais para não errar na escolha do seu sistema.',
        content: `A escolha de um ERP deve ser tratada como uma decisão estratégica, não apenas tecnológica.\n\nO primeiro passo é mapear as dores atuais da empresa. O sistema escolhido resolve o seu principal gargalo? O segundo passo é avaliar a aderência do software ao seu setor.\n\nAlém das funcionalidades, avalie criticamente o fornecedor: como é o suporte técnico? Qual a metodologia de implantação? Eles possuem cases de sucesso no seu segmento? A parceria a longo prazo é tão importante quanto o código do software.`,
      },
      {
        id: 6,
        title: 'Quanto custa implantar um ERP?',
        summary: 'O que compõe o investimento e como calcular o ROI do projeto.',
        content: `O custo de um ERP envolve mais do que a licença de software. Geralmente o investimento é dividido em duas frentes: Implantação (setup inicial, treinamentos, parametrizações) e a Mensalidade (uso, suporte, atualizações).\n\nPara calcular o ROI (Retorno sobre Investimento), é preciso precificar as ineficiências atuais: quanto custa o tempo gasto em retrabalho? Quantas vendas são perdidas por ruptura de estoque? Quanto de multa fiscal é pago por erro humano?\n\nNa grande maioria dos casos em pequenas e médias empresas, o ERP se paga no primeiro ano apenas com a otimização de estoque e redução de custos operacionais invisíveis.`,
      },
    ],
  },
  {
    id: 'decision',
    title: '3. Decisão e Implantação',
    description: 'Prepare-se para o projeto e garanta o sucesso na adoção do sistema.',
    icon: Zap,
    articles: [
      {
        id: 7,
        title: 'Passo a passo para implantar um ERP',
        summary: 'As etapas cruciais para um Go-Live seguro e sem surpresas.',
        content: `A implantação de um ERP é um projeto que exige engajamento de toda a empresa. As principais etapas são:\n\n1. Planejamento (Kick-off e definição de cronograma)\n2. Mapeamento e Parametrização (Ajustando o software aos processos da empresa)\n3. Migração de Dados (Trazendo o histórico de planilhas para o novo sistema)\n4. Treinamento e Homologação (Validando os processos com a equipe)\n5. Go-Live (A virada de chave para o novo sistema)\n\nA comunicação transparente e a presença de usuários-chave (key users) dedicados ao projeto são fatores determinantes para o sucesso.`,
      },
      {
        id: 8,
        title: 'O que fazer após a Implantação do ERP?',
        summary: 'Como manter o engajamento da equipe e evoluir o uso do sistema.',
        content: `O dia do Go-Live é apenas o início da jornada. O verdadeiro valor do ERP é extraído nos meses seguintes.\n\nA primeira fase pós-implantação é a estabilização, onde a equipe se adapta à nova rotina e dúvidas operacionais são sanadas. Após esse período, o foco deve mudar para a melhoria contínua.\n\nÉ crucial auditar o uso do sistema, garantir que os colaboradores não voltem para planilhas paralelas e começar a explorar módulos avançados, automações e relatórios de Business Intelligence (BI) para tomar decisões cada vez mais precisas.`,
      },
    ],
  },
]

export const BLOG_POSTS = [
  {
    id: 1,
    title: '5 tendências de gestão para o setor atacadista em 2024',
    category: 'Gestão',
    date: '12 Mar 2024',
    readTime: '4 min',
    image: 'https://img.usecurling.com/p/600/400?q=warehouse&color=blue',
  },
  {
    id: 2,
    title: 'Como a Inteligência Artificial está transformando o ERP',
    category: 'Tecnologia',
    date: '08 Mar 2024',
    readTime: '6 min',
    image: 'https://img.usecurling.com/p/600/400?q=artificial%20intelligence&color=blue',
  },
  {
    id: 3,
    title: 'LGPD: Seu sistema de gestão está realmente preparado?',
    category: 'Segurança',
    date: '28 Fev 2024',
    readTime: '5 min',
    image: 'https://img.usecurling.com/p/600/400?q=cyber%20security&color=blue',
  },
]
