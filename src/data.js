/* ============================================================
   DADOS DA PROPOSTA — Distribuidora Horizonte
   Preços coletados em 16/11/2026. Valores em R$.
   ============================================================ */
const BUDGET_CEILING = 45000;

const SOURCES = {
  pichau_er605: { name: "Pichau — TP-Link ER605", url: "https://www.pichau.com.br/roteador-tp-link-omada-vpn-multi-wan-gigabit-er605" },
  ep_switch: { name: "Escorrega o Preço (KaBuM) — switches TP-Link", url: "https://escorregaopreco.com.br/ofertas/kabum/8243086" },
  zoom_rack: { name: "Zoom — rack 12U GForce e patch panel 48p", url: "https://www.zoom.com.br/rack-acessorios-para-servidor?page=21" },
  orse: { name: "Composição ORSE-13407 — ponto Cat6 completo", url: "https://orcamentor.com/orse/composicoes/ORSE-13407/" },
  trf1: { name: "TRF1 — composição: certificação e identificação de ponto", url: "https://trf1.jus.br/sjrr/conteudo/files/COMPOSI__ES.pdf" },
  terabyte_ap: { name: "TerabyteShop — Access Point TP-Link EAP650", url: "https://www.terabyteshop.com.br/produto/41904/access-point-tp-link-ax3000-wi-fi-6-omada-eap650-montavel-em-teto" },
  ep_nobreak: { name: "Escorrega o Preço (KaBuM) — Nobreak SMS Lite 1200VA", url: "https://escorregaopreco.com.br/ofertas/kabum/4831037" },
  kabum_nas: { name: "KaBuM — Synology DS225+", url: "https://www.kabum.com.br/produto/1000939/synology-nas-ds225-2-baias" },
  amazon_nas: { name: "Amazon BR — Synology DS225+ (2ª referência)", url: "https://www.amazon.com.br/Synology-DiskStation-DS225-compartimentos-disco/dp/B0FB7KQLR1" },
  kabum_hd: { name: "KaBuM — HD WD Red Plus 4TB", url: "https://www.kabum.com.br/produto/460466/hd-wd-red-plus-4tb-5400-rpm-3-5-sata-wd40efpx" },
  kabum_hdext: { name: "KaBuM — HD externo Seagate Expansion 4TB", url: "https://www.kabum.com.br/produto/1005358/hd-externo-portatil-seagate-expansion-4tb-2-5-usb-3-0-preto-stgx4000400" },
  fast_pc: { name: "Fast Shop (vendido por Lenovo) — ThinkCentre neo 50s Gen 5", url: "https://site.fastshop.com.br/desktop-lenovo-thinkcentre-neo-50s-gen-5-intel-core-i5-14400-16gb-512gb-ssd-windows-11---13ej000pbo-preto-152604/p" },
  ahow: { name: "Ahow Solutions — preços de suporte de TI 2026 (hora técnica)", url: "https://ahowsolutions.com.br/quanto-custa-suporte-de-ti/" },
  bondfaro_elgin: { name: "Bondfaro — Elgin L42 Pro Full (KaBuM)", url: "https://www.bondfaro.com.br/impressora-de-codigo-de-barras" },
  bondfaro_leitor: { name: "Bondfaro — leitor C3Tech LB-W110BK (KaBuM)", url: "https://www.bondfaro.com.br/leitor-de-codigo-de-barras?page=3" },
  kabum_ssd: { name: "KaBuM — SSD Kingston A400 480GB", url: "https://www.kabum.com.br/produto/163130/ssd-kingston-480gb-a400-2-5-sata-3-sa400s37-480g" },
  kabum_ram: { name: "KaBuM — Kingston Fury Beast 8GB DDR4", url: "https://www.kabum.com.br/produto/172365/" },
  verum: { name: "Verum IT — terceirização de TI por dispositivo", url: "https://verumit.com.br/quanto-custa-terceirizar-a-ti/" },
  sa8: { name: "8SA — quanto custa suporte de TI (faixa de mercado)", url: "https://www.8sa.com.br/blog/quanto-custa-suporte-de-ti/" },
  m365: { name: "Microsoft — comparar planos Microsoft 365 para empresas", url: "https://www.microsoft.com/pt-br/microsoft-365/compare-all-microsoft-365-products?tab=2" },
  bling: { name: "Bling — planos e preços", url: "https://www.bling.com.br/planos-e-precos" },
  omie: { name: "Omie — preços", url: "https://www.omie.com.br/precos/" },
  ohub_print: { name: "oHub — preços de locação de impressoras (jan/2026)", url: "https://www.ohub.com.br/ideias/precos-de-locacao-de-impressoras/" },
  claro: { name: "Claro Empresas — Claro Fibra CNPJ", url: "https://www.claro.com.br/produtosclaro/claroempresas/" },
  vivo_loc: { name: "Vivo Empresas — locação de computadores", url: "https://vivo.com.br/para-empresas/produtos-e-servicos/aluguel-de-notebook-e-computador/pme" },
  brother: { name: "Ponto Frio — Brother DCP-L5662DN", url: "https://www.pontofrio.com.br/multifuncional-brother-dcp-l5662dn-laser-mono-duplex/p/1564433010" },
};

/* Itens de investimento inicial (CAPEX) */
const CAPEX = [
  // ONDA 1 — Fundação
  { id:"er605", onda:1, cat:"Rede", item:"Gateway/firewall TP-Link Omada ER605 (multi-WAN, VPN, VLAN)", qtd:1, un:489.99, src:"pichau_er605", forn:"Pichau", obs:"Preço à vista no PIX." },
  { id:"sw1", onda:1, cat:"Rede", item:"Switch gerenciável PoE+ 24 portas TP-Link TL-SG2428P", qtd:1, un:2424.90, src:"ep_switch", forn:"KaBuM", obs:"Alimenta os APs pelo cabo (PoE) e separa as VLANs." },
  { id:"sw2", onda:1, cat:"Rede", item:"Switch Easy Smart 24 portas TP-Link TL-SG1024DE", qtd:1, un:609.90, src:"ep_switch", forn:"KaBuM", obs:"Portas adicionais para estações e impressoras." },
  { id:"rack", onda:1, cat:"Rede", item:"Mini rack de parede 12U × 570 mm (GForce)", qtd:1, un:639.30, src:"zoom_rack", forn:"KaBuM", obs:"Centraliza os equipamentos, com chave." },
  { id:"patch", onda:1, cat:"Rede", item:"Patch panel 48 portas Cat6 2U", qtd:1, un:539.76, src:"zoom_rack", forn:"Magazine Luiza", obs:"Termina todos os pontos com identificação." },
  { id:"ponto", onda:1, cat:"Rede", item:"Ponto de rede Cat6 completo — material + mão de obra (térreo e backbone)", qtd:20, un:410.04, src:"orse", forn:"Instalador credenciado", obs:"Referência pública: composição ORSE-13407. Cotar com 3 instaladores." },
  { id:"cert", onda:1, cat:"Rede", item:"Certificação e identificação de ponto existente (andar superior)", qtd:16, un:68.18, src:"trf1", forn:"Instalador credenciado", obs:"Ponto reprovado é refeito com saldo de contingência." },
  { id:"ap", onda:1, cat:"Wi-Fi", item:"Access point Wi-Fi 6 TP-Link Omada EAP650 (teto, PoE)", qtd:5, un:789.99, src:"terabyte_ap", forn:"TerabyteShop", obs:"2 depósito · 1 expedição/comercial · 1 superior · 1 reuniões/recepção." },
  { id:"ups", onda:1, cat:"Energia", item:"Nobreak SMS Lite 1200VA bivolt", qtd:3, un:829.99, src:"ep_nobreak", forn:"KaBuM", obs:"1 no rack + 2 nas estações do financeiro." },
  { id:"nas", onda:1, cat:"Dados", item:"Servidor de arquivos NAS Synology DS225+ (2 baias)", qtd:1, un:3986.20, src:"kabum_nas", forn:"KaBuM", obs:"Indisponível no dia da pesquisa; 2ª referência Amazon BR R$ 4.686,54." },
  { id:"hd", onda:1, cat:"Dados", item:"HD WD Red Plus 4TB (NAS, RAID 1)", qtd:2, un:809.90, src:"kabum_hd", forn:"KaBuM", obs:"Discos espelhados: um falha, o outro segue." },
  { id:"hdext", onda:1, cat:"Dados", item:"HD externo Seagate Expansion 4TB (cópia offline em rodízio)", qtd:2, un:1189.99, src:"kabum_hdext", forn:"KaBuM", obs:"Um fica na empresa, outro fora; troca semanal." },
  { id:"pcfin", onda:1, cat:"Computadores", item:"Desktop Lenovo ThinkCentre neo 50s Gen 5 — i5-14400, 16GB, SSD 512GB, Win 11 Pro (financeiro)", qtd:2, un:5933.14, src:"fast_pc", forn:"Fast Shop / Lenovo", obs:"Substitui as 2 máquinas que travam no fechamento." },
  // ONDA 2 — Integração
  { id:"erpimp", onda:2, cat:"Sistemas", item:"Implantação do ERP: saneamento de cadastros, carga inicial e treinamento (horas técnicas)", qtd:16, un:150.00, src:"ahow", forn:"Consultoria/MSP", obs:"Piso da faixa de hora técnica (R$ 150–350)." },
  { id:"elgin", onda:2, cat:"Expedição", item:"Impressora térmica de etiquetas Elgin L42 Pro Full (USB/Ethernet)", qtd:1, un:1359.55, src:"bondfaro_elgin", forn:"KaBuM", obs:"Etiquetas de volume dedicadas à expedição." },
  { id:"leitor", onda:2, cat:"Expedição", item:"Leitor de código de barras sem fio C3Tech LB-W110BK (1D/2D)", qtd:3, un:285.81, src:"bondfaro_leitor", forn:"KaBuM", obs:"Conferência de entrada, separação e saída." },
  // ONDA 3 — Parque de computadores
  { id:"ssd", onda:3, cat:"Computadores", item:"SSD Kingston A400 480GB (upgrade de máquinas aproveitáveis)", qtd:11, un:660.00, src:"kabum_ssd", forn:"KaBuM", obs:"Maior ganho por real investido: fim da lentidão ao ligar." },
  { id:"ram", onda:3, cat:"Computadores", item:"Memória 8GB DDR4 Kingston Fury Beast", qtd:8, un:649.99, src:"kabum_ram", forn:"KaBuM", obs:"Somente nas máquinas com 4GB." },
  { id:"pc4", onda:3, cat:"Computadores", item:"Desktop Lenovo ThinkCentre neo 50s Gen 5 (substituição das 4 máquinas restantes com 7+ anos)", qtd:4, un:5933.14, src:"fast_pc", forn:"Fast Shop / Lenovo", obs:"Opção A (compra). Opção B: locação.", optA:true },
];

/* Custos recorrentes (OPEX mensal) */
const OPEX = [
  { id:"msp", item:"Suporte gerenciado de TI (help desk, monitoramento, preventiva, SLA)", qtd:24, un:98.00, unit:"dispositivo/mês", src:"verum", forn:"Empresa de TI gerenciada (MSP)", obs:"Faixa de mercado R$ 80–250/estação (8SA). SLA: 4 h para financeiro." , color:"#FF8A3D"},
  { id:"m365b", item:"Microsoft 365 Business Basic (e-mail, OneDrive 1TB, SharePoint, Teams)", qtd:24, un:33.40, unit:"usuário/mês", src:"m365", forn:"Microsoft", obs:"Pago anualmente; sem impostos." , color:"#4C8DFF"},
  { id:"m365a", item:"Microsoft 365 Apps para PMEs (Excel/Word desktop)", qtd:6, un:57.30, unit:"usuário/mês", src:"m365", forn:"Microsoft", obs:"Financeiro, administração e gerência." , color:"#7AA8FF"},
  { id:"erp", item:"ERP em nuvem Bling — plano Titânio (até 50 usuários)", qtd:1, un:120.00, unit:"mês (a partir de)", src:"bling", forn:"Bling", obs:"Preço 'a partir de' com cobrança anual. Alternativa: Omie, a partir de R$ 309/mês." , color:"#2EC4B6"},
  { id:"print", item:"Locação de multifuncional laser P&B (franquia 4.000 pág./mês)", qtd:2, un:280.00, unit:"equipamento/mês", src:"ohub_print", forn:"Locadora de impressão", obs:"Média de mercado; inclui toner, peças e troca em defeito." , color:"#B48CFF"},
  { id:"link2", item:"Link de internet secundário Claro Fibra 400 Mega (CNPJ)", qtd:1, un:79.90, unit:"mês", src:"claro", forn:"Claro Empresas", obs:"Operadora diferente da principal: redundância real." , color:"#5BD68A"},
];
const LEASE_OPTION = { qtd:4, un:192.99, meses:48, item:"Locação Positivo C6400 (i5 12ª, 8GB, SSD 256GB) — 48 meses", src:"vivo_loc", forn:"Vivo Empresas" };

/* Diagnóstico — problemas */
const PROBLEMS = [
  { id:"rede", n:1, short:"Rede física improvisada", icon:"🔌", where:"Teto / todos os setores",
    fato:"Cabos pelo teto, pontos sem identificação, switches de épocas diferentes; quedas no acesso a arquivos e falhas recorrentes no estoque.",
    causa:"Crescimento sem projeto: ampliações pontuais, sem cabeamento estruturado nem documentação.",
    processo:"Consulta de estoque, emissão de pedidos e acesso à pasta do financeiro são interrompidos.",
    resultado:"Atrasos, retrabalho e tempo perdido procurando a falha a cada parada.",
    U:5, I:5, onda:1 },
  { id:"wifi", n:2, short:"Wi-Fi inseguro e sem cobertura", icon:"📶", where:"Depósito · reuniões · recepção",
    fato:"3 roteadores (2 comprados por funcionários), áreas do depósito sem sinal, mesma senha para todos há ~4 anos, colada na recepção.",
    causa:"Equipamentos domésticos sem gestão central; rede de visitantes misturada à rede interna.",
    processo:"Conferência no depósito sem sistema; visitante na mesma rede dos computadores do financeiro.",
    resultado:"Risco de invasão e vazamento de dados (LGPD), conferência manual lenta.",
    U:5, I:4, onda:1 },
  { id:"dados", n:3, short:"Informações comerciais desencontradas", icon:"📊", where:"Comercial · administração · financeiro",
    fato:"Estoque em planilha num PC administrativo, pedidos em outra planilha, financeiro em programa de uma só máquina. Já houve venda de item indisponível e pedido duplicado.",
    causa:"Três bases de dados isoladas, atualizadas manualmente e com atraso.",
    processo:"Vender → separar → faturar → cobrar sem uma fonte única de verdade.",
    resultado:"Cancelamentos, reclamações de clientes e perda de vendas.",
    U:4, I:5, onda:2 },
  { id:"backup", n:4, short:"Arquivos sem backup", icon:"💾", where:"Financeiro · estações individuais",
    fato:"Documentos em cada PC; contratos acessados por pasta compartilhada em uma estação do financeiro. Planilha de fornecedores apagada e recuperada só em versão antiga. Nuvens pessoais.",
    causa:"Não há servidor de arquivos nem rotina de backup; dependência de uma máquina ligada.",
    processo:"Fechamento mensal, contratos e cadastros dependem de um único computador.",
    resultado:"Risco de perda definitiva de dados e de parada total (ransomware, defeito, furto).",
    U:5, I:5, onda:1 },
  { id:"pcs", n:5, short:"Computadores heterogêneos e lentos", icon:"🖥️", where:"Todos os setores",
    fato:"21 desktops de várias idades, alguns com mais de 7 anos; lentidão ao ligar e ao abrir planilhas; 2 PCs do financeiro travam no fechamento.",
    causa:"Discos mecânicos, pouca memória e máquinas sem suporte ao Windows 11.",
    processo:"Minutos perdidos por pessoa por dia; fechamento mensal sob risco.",
    resultado:"Produtividade menor e risco de atraso no fechamento.",
    U:4, I:4, onda:3 },
  { id:"print", n:6, short:"Impressão e fila na expedição", icon:"🖨️", where:"Expedição",
    fato:"4 impressoras; uma com defeito recorrente e manutenção bimestral; gastos com suprimentos crescendo; expedição divide impressora e forma fila de pedidos, etiquetas e documentos de transporte.",
    causa:"Equipamento inadequado ao volume e nenhuma impressora de etiquetas dedicada.",
    processo:"A carga espera a etiqueta e o documento de transporte.",
    resultado:"Atrasos na entrega e custo crescente sem controle.",
    U:3, I:3, onda:2 },
  { id:"suporte", n:7, short:"Suporte sob demanda, sem SLA", icon:"🛠️", where:"Toda a empresa",
    fato:"Sem profissional de TI; um funcionário administrativo resolve o simples e um técnico autônomo é chamado. Um PC essencial do financeiro ficou 2 dias parado.",
    causa:"Ausência de contrato com tempo de atendimento e de manutenção preventiva.",
    processo:"Toda falha vira emergência; ninguém mantém o inventário nem as atualizações.",
    resultado:"Paradas longas e custo invisível de horas improdutivas.",
    U:4, I:4, onda:1 },
  { id:"net", n:8, short:"Internet: gargalo desconhecido", icon:"🌐", where:"Entrada do link",
    fato:"500 Mbps contratados, mas ninguém sabe se a lentidão vem da operadora, dos equipamentos ou do cabeamento. Um único link.",
    causa:"Sem medição nem equipamento que mostre o consumo; roteador da operadora faz tudo.",
    processo:"Com ERP e arquivos na nuvem, a internet passa a ser crítica.",
    resultado:"Queda do link = empresa parada.",
    U:3, I:3, onda:1 },
];

/* Cadeia de impacto (diagnóstico → processos → resultados) */
const PROCESSES = [
  { id:"vender", label:"Vender", from:["dados","rede","pcs"] },
  { id:"separar", label:"Separar e expedir", from:["wifi","print","dados","rede"] },
  { id:"faturar", label:"Faturar e cobrar", from:["dados","pcs","backup"] },
  { id:"fechar", label:"Fechar o mês", from:["pcs","backup","suporte"] },
  { id:"operar", label:"Manter a operação", from:["suporte","net","rede","wifi"] },
];
const RESULTS = [
  { id:"atrasos", label:"Atrasos", from:["separar","operar","fechar"] },
  { id:"retrabalho", label:"Retrabalho", from:["vender","faturar","separar"] },
  { id:"reclam", label:"Reclamações", from:["vender","separar"] },
  { id:"risco", label:"Risco de perda de dados", from:["fechar","faturar","operar"] },
  { id:"custo", label:"Custo oculto", from:["operar","fechar","separar"] },
];

/* Dependências entre soluções (A → B: A precisa existir antes de B) */
const DEPS = [ ["rede","wifi"], ["rede","backup"], ["rede","dados"], ["wifi","dados"], ["dados","print"], ["suporte","pcs"], ["rede","net"] ];

/* Soluções */
const SOLUTIONS = [
  { id:"s-rede", problem:"rede", title:"Cabeamento estruturado + rack central",
    what:"Rack 12U com patch panel identificado, switch PoE+ gerenciável, gateway ER605 e nobreak. 20 pontos Cat6 novos no térreo e backbone; 16 pontos do superior certificados e etiquetados.",
    why:"Resolve a causa das quedas (cabo e conexão) em vez de trocar computadores. Tudo documentado: qualquer técnico encontra o ponto em minutos.",
    alt:"Alternativa descartada: só trocar switches. Mantém o cabo ruim e não acaba com as quedas." },
  { id:"s-wifi", problem:"wifi", title:"Wi-Fi 6 corporativo com redes separadas",
    what:"5 access points EAP650 no teto, gerenciados centralmente, com 3 redes (SSIDs/VLANs): Corporativa (login individual), Operação/Depósito e Visitantes isolada, com senha que troca periodicamente.",
    why:"Cobertura medida no depósito, visitante nunca enxerga o financeiro e os roteadores pessoais são recolhidos.",
    alt:"Alternativa descartada: repetidores. Dividem a banda e mantêm a rede plana e insegura." },
  { id:"s-erp", problem:"dados", title:"ERP em nuvem integrando estoque, vendas e financeiro",
    what:"Bling (plano Titânio, até 50 usuários): estoque em tempo real, pedido reserva o produto, NF-e, contas a pagar/receber e relatórios. Leitores de código de barras na conferência.",
    why:"Uma única base de dados: o comercial vê o saldo real e o pedido não se duplica. Nuvem dispensa servidor local e funciona fora da empresa.",
    alt:"Alternativa avaliada: Omie (a partir de R$ 309/mês), mais forte em financeiro/contábil. Bling vence em custo e folga de usuários para crescer 20%." },
  { id:"s-backup", problem:"backup", title:"Servidor de arquivos + backup 3-2-1",
    what:"NAS Synology com 2 discos espelhados (RAID 1) substitui a pasta na estação do financeiro. Backup diário com versões, cópia em HD externo rodiziado fora da empresa e documentos de trabalho no SharePoint/OneDrive.",
    why:"3 cópias, 2 mídias, 1 fora da empresa: arquivo apagado volta em minutos, e um ransomware não leva tudo. Nuvens pessoais deixam de ser necessárias.",
    alt:"Alternativa descartada: só nuvem. Depende 100% da internet e não protege a cópia local." },
  { id:"s-pcs", problem:"pcs", title:"Inventário → atualizar o que vale, trocar o que não vale",
    what:"Inventário técnico das 21 máquinas. Premissa a validar: 2 trocas imediatas (financeiro), 11 recebem SSD (8 também +8GB RAM), 4 com 7+ anos são substituídas na Onda 3 e 4 só precisam de limpeza.",
    why:"Atende à diretoria: não trocar tudo sem necessidade. SSD custa cerca de 11% de um desktop novo e acaba com a lentidão do início do expediente.",
    alt:"Para as 4 trocas da Onda 3: comprar (TCO 48 meses R$ 5.933/un.) ou locar (R$ 9.264/un. em 48 meses, com manutenção)." },
  { id:"s-print", problem:"print", title:"Impressão por locação + etiquetadora na expedição",
    what:"2 multifuncionais locadas (uma por andar) com franquia, toner e manutenção inclusos; impressora térmica Elgin dedicada à expedição; a impressora defeituosa é desativada.",
    why:"Acaba com a fila da expedição e transforma custo imprevisível em mensalidade fixa, sem consumir o orçamento de investimento.",
    alt:"Compra de 2 multifuncionais Brother DCP-L5662DN: R$ 9.558 iniciais, fora toner e manutenção. Fica como opção após 3 meses de medição dos contadores." },
  { id:"s-suporte", problem:"suporte", title:"Contrato de TI gerenciada com SLA",
    what:"Empresa de TI por dispositivo (24 equipamentos): help desk, monitoramento remoto, atualizações, antivírus gerenciado, verificação dos backups e visita preventiva mensal. SLA de 4 h para o financeiro.",
    why:"Custa menos que um analista CLT e cobre férias e madrugadas. Dois dias de financeiro parado não se repetem.",
    alt:"Alternativa: contratar analista de TI. Um só profissional não cobre férias nem o horário de sábado." },
  { id:"s-net", problem:"net", title:"Medir, depois redundar o link",
    what:"Teste de velocidade no ponto de entrada, no rack e na estação para isolar o gargalo. ER605 com 2 links de operadoras diferentes em balanceamento e failover automático.",
    why:"Com ERP e arquivos na nuvem, a internet vira infraestrutura crítica. O 2º link custa R$ 79,90/mês.",
    alt:"Alternativa descartada: aumentar a velocidade do link atual. Não resolve se o gargalo for interno e não traz redundância." },
];

/* Implantação — cronograma (semanas) */
const PLAN = [
  { id:"p0", onda:0, row:0, start:0, dur:1, title:"Kick-off, inventário e medições", detail:"Inventário das 21 máquinas (idade, disco, memória, compatibilidade com Windows 11), mapa de pontos, testes de velocidade, levantamento de cobertura Wi-Fi e contadores das impressoras.", when:"Horário normal, sem parada" },
  { id:"p1", onda:1, row:0, start:0, dur:1, title:"Ações de custo zero", detail:"Trocar a senha do Wi-Fi, criar rede de visitantes provisória, recolher roteadores pessoais, cópia imediata da pasta do financeiro em HD externo e política de não usar nuvens pessoais.", when:"Semana 1" },
  { id:"p2", onda:1, row:1, start:1, dur:1, title:"Contrato de suporte (MSP) e compras", detail:"Assinar contrato com SLA, cotar instaladores (3 propostas) e emitir pedidos dos equipamentos.", when:"Semana 2" },
  { id:"p3", onda:1, row:2, start:2, dur:3, title:"Cabeamento estruturado e rack", detail:"Execução por zonas: depósito e expedição nos sábados à tarde e após as 18h; backbone e rack em um sábado. Certificação dos pontos do andar superior.", when:"Semanas 3–5, fora do expediente" },
  { id:"p4", onda:1, row:3, start:4, dur:1, title:"Wi-Fi 6 e VLANs", detail:"Instalação dos 5 APs e configuração das redes Corporativa, Depósito e Visitantes; medição de cobertura após a instalação.", when:"Semana 5" },
  { id:"p5", onda:1, row:4, start:3, dur:2, title:"NAS, backup e PCs do financeiro", detail:"Migração da pasta compartilhada para o NAS, rotina de backup testada com restauração real; troca dos 2 PCs do financeiro FORA da janela de fechamento.", when:"Semanas 4–5" },
  { id:"p6", onda:2, row:5, start:5, dur:2, title:"Saneamento de cadastros e inventário físico", detail:"Padronização de produtos, clientes e fornecedores; contagem física do estoque para o saldo inicial do ERP.", when:"Semanas 6–7 (contagem em sábado)" },
  { id:"p7", onda:2, row:6, start:7, dur:2, title:"Treinamento e piloto do ERP", detail:"Treinamento por setor com usuários-chave; piloto com comercial e estoque; etiquetadora e leitores na expedição.", when:"Semanas 8–9" },
  { id:"p8", onda:2, row:7, start:9, dur:3, title:"Go-live e operação assistida", detail:"Virada no início de mês (logo após o fechamento), com 2 semanas de planilha em paralelo apenas para conferência. Locação das multifuncionais.", when:"Semanas 10–12" },
  { id:"p9", onda:3, row:8, start:14, dur:4, title:"Upgrade SSD/RAM em lotes", detail:"3 máquinas por noite, clonando o disco antigo: o usuário chega e o PC está pronto.", when:"Semanas 15–18, após as 18h" },
  { id:"p10", onda:3, row:9, start:18, dur:4, title:"Substituição das 4 máquinas antigas", detail:"Compra ou locação, decidida com os números do inventário e o caixa do trimestre.", when:"Semanas 19–22" },
  { id:"p11", onda:3, row:10, start:22, dur:2, title:"Revisão de resultados (KPIs)", detail:"Comparar indicadores com a linha de base da semana 1; ajustar contrato de impressão e plano do ERP.", when:"Semanas 23–24" },
];
const FREEZE = [ [3.6,4.6], [8,9], [12.4,13.4], [16.8,17.8], [21.2,22.2] ]; // janelas aproximadas de fechamento mensal (semanas)

/* Riscos */
const RISKS = [
  { id:"r1", name:"Resistência ao ERP", P:4, I:4, P2:2, I2:3, mit:"Usuários-chave por setor, treinamento prático e conferência paralela por 2 semanas. A diretoria patrocina a mudança." },
  { id:"r2", name:"Erros na migração de dados", P:3, I:5, P2:1, I2:4, mit:"Inventário físico antes da virada, cadastros saneados e conferência por amostragem no piloto." },
  { id:"r3", name:"Parada durante o cabeamento", P:3, I:3, P2:1, I2:2, mit:"Execução por zonas, aos sábados à tarde e após as 18h; rede antiga permanece até a nova ser testada." },
  { id:"r4", name:"Mudança no fechamento mensal", P:3, I:5, P2:1, I2:3, mit:"Congelamento de mudanças nos dias de fechamento; PCs do financeiro trocados fora da janela." },
  { id:"r5", name:"Queda da internet com ERP na nuvem", P:3, I:4, P2:1, I2:2, mit:"2º link de outra operadora com failover automático no ER605." },
  { id:"r6", name:"Ransomware / perda de dados", P:3, I:5, P2:1, I2:3, mit:"Backup 3-2-1 com cópia offline, antivírus gerenciado, MFA no Microsoft 365, redes separadas." },
  { id:"r7", name:"Variação de preços do hardware", P:4, I:2, P2:2, I2:2, mit:"Cotação com 3 fornecedores, compra da Onda 1 de uma vez e reserva nas Ondas 2–3." },
  { id:"r8", name:"Prestador de TI fraco", P:2, I:4, P2:1, I2:2, mit:"SLA com penalidade, relatório mensal de chamados e cláusula de saída em 90 dias." },
];

/* Benefícios / KPIs */
const KPIS = [
  { k:"Vendas de item sem estoque", antes:"Ocorrem", meta:"0 por mês", how:"Relatório de pedidos cancelados no ERP" },
  { k:"Pedidos duplicados", antes:"Ocorrem", meta:"0 por mês", how:"Numeração única do ERP" },
  { k:"Tempo de indisponibilidade de PC do financeiro", antes:"Até 2 dias", meta:"≤ 4 h (SLA)", how:"Chamados do MSP" },
  { k:"Arquivo apagado recuperado", antes:"Versão antiga, se houver", meta:"Versão do dia anterior em < 1 h", how:"Teste mensal de restauração" },
  { k:"Cobertura Wi-Fi no depósito", antes:"Pontos sem sinal", meta:"100% da área", how:"Medição após instalação" },
  { k:"Fila na impressora da expedição", antes:"Diária", meta:"Etiquetadora dedicada", how:"Tempo médio de expedição" },
  { k:"Rede de visitantes", antes:"Mesma senha da equipe", meta:"Isolada e rotativa", how:"Configuração das VLANs" },
  { k:"Queda do link principal", antes:"Empresa parada", meta:"Failover automático", how:"Teste de failover trimestral" },
];

/* Diretoria — perguntas e respostas */
const PERSONAS = [
  { id:"mariana", name:"Mariana Oliveira", role:"Diretora administrativa", color:"#FF8A3D",
    quote:"Estamos crescendo, mas não quero gastar dinheiro trocando tudo sem necessidade. Precisamos saber o que resolver primeiro.",
    answer:"Trocamos só 2 de 21 computadores agora; 11 recebem SSD. As Ondas 1 e 2 cabem no teto de R$ 45 mil, e a Onda 3 só começa depois de medirmos os resultados.",
    metric:"R$ 44.904,69 nas Ondas 1+2" },
  { id:"carlos", name:"Carlos Mendes", role:"Gerente comercial", color:"#2EC4B6",
    quote:"Às vezes vendemos produtos que não temos em estoque. A equipe precisa consultar dados confiáveis.",
    answer:"Com o ERP, o vendedor vê o saldo real e o pedido reserva o produto. A conferência com leitor de código de barras atualiza o estoque na hora.",
    metric:"Meta: 0 venda sem estoque" },
  { id:"fernanda", name:"Fernanda Lima", role:"Responsável financeira", color:"#4C8DFF",
    quote:"Tenho receio de perder nossos arquivos e preciso que os computadores funcionem no fechamento mensal.",
    answer:"Seus 2 PCs são trocados na Onda 1, fora da janela de fechamento, com nobreak. Os arquivos saem da estação para o NAS com backup 3-2-1 e restauração testada todo mês.",
    metric:"SLA de 4 h · backup diário" },
  { id:"roberto", name:"Roberto Alves", role:"Supervisor do estoque", color:"#5BD68A",
    quote:"A rede falha, o Wi-Fi não chega a todo o depósito e pedidos são conferidos manualmente.",
    answer:"O depósito é a primeira zona recabeada, recebe 2 APs e uma rede própria para a operação. A conferência passa a ser por código de barras direto no ERP.",
    metric:"100% de cobertura no depósito" },
];
const QA = [
  { q:"Por que não trocar todos os computadores de uma vez?", a:"Porque o gargalo principal é rede, dados e backup, não processador. Trocar os 21 PCs consumiria mais que o orçamento inteiro e manteria vendas sem estoque e arquivos sem backup. O SSD resolve a lentidão de 11 máquinas por cerca de 11% do preço de um PC novo cada." },
  { q:"E se a internet cair com o ERP na nuvem?", a:"O ER605 opera com dois links de operadoras diferentes e muda sozinho para o reserva (R$ 79,90/mês). Os arquivos do dia a dia continuam no NAS local." },
  { q:"O custo mensal de R$ 4,3 mil não é alto?", a:"Mais da metade é o suporte com SLA, que substitui o técnico avulso e evita paradas como os 2 dias do financeiro. O resto troca custos que já existem (impressão, licenças avulsas) por mensalidades previsíveis." },
  { q:"Por que Bling e não Omie?", a:"Os dois atendem. O Bling Titânio parte de R$ 120/mês com até 50 usuários (folga para crescer 20%). O Omie parte de R$ 309/mês e é mais forte em contábil. Se o contador exigir integração contábil, a troca de recomendação não muda o restante do projeto." },
  { q:"Vamos parar a empresa para instalar?", a:"Não. O cabeamento é feito por zonas aos sábados à tarde e após as 18h, a rede antiga só sai depois de a nova ser testada e nada muda nos dias de fechamento." },
  { q:"Como saberemos que deu certo?", a:"Linha de base medida na semana 1 e 8 indicadores revisados na semana 24: vendas sem estoque, duplicidade, indisponibilidade, cobertura Wi-Fi, restauração de arquivos, fila da expedição, segurança e failover." },
];

/* Roteiro da apresentação (15 min) — ordem combinada pelo grupo */
const PRESENTERS = [
  { id:"rayna", name:"Rayna Livia", part:"Abertura e diagnóstico no prédio", slides:[0,1,2] },
  { id:"marcos", name:"Marcos de Oliveira", part:"Impactos e priorização", slides:[3,4] },
  { id:"talita", name:"Talita Nasser", part:"Soluções de infraestrutura (prédio e rede)", slides:[5,6] },
  { id:"lucas", name:"Lucas Vasconcelos", part:"ERP e pesquisa de mercado", slides:[7,8] },
  { id:"caio", name:"Caio Vilanova", part:"Orçamento e implantação", slides:[9,10] },
  { id:"oliver", name:"Oliver Henrique", part:"Benefícios, riscos, defesa e fechamento", slides:[11,12,13] },
];
const presenterOf = i => PRESENTERS.find(p => p.slides.includes(i));
const SCRIPT = [
  { slide:0, min:0.5, who:"Abertura", by:"rayna", txt:"Apresenta a equipe e a promessa: resolver primeiro o que trava a operação." },
  { slide:1, min:0.5, who:"Agenda", by:"rayna", txt:"Os 8 desafios em 15 minutos." },
  { slide:2, min:2, who:"Diagnóstico", by:"rayna", txt:"Tour pelo prédio: um problema por setor, com o fato do caso." },
  { slide:3, min:1, who:"Diagnóstico", by:"marcos", txt:"Como os problemas viram atrasos, retrabalho e reclamações." },
  { slide:4, min:1.5, who:"Priorização", by:"marcos", txt:"Urgência × impacto e dependências: por que rede e backup vêm primeiro." },
  { slide:5, min:1.5, who:"Soluções", by:"talita", txt:"Antes e depois no prédio." },
  { slide:6, min:1, who:"Soluções", by:"talita", txt:"Topologia, redes separadas e failover." },
  { slide:7, min:1, who:"Soluções", by:"lucas", txt:"ERP: um pedido do início ao fim." },
  { slide:8, min:1, who:"Mercado", by:"lucas", txt:"Fornecedores, referências e comparativos compra × locação." },
  { slide:9, min:1.5, who:"Orçamento", by:"caio", txt:"Ondas 1+2 dentro de R$ 45 mil; custos mensais separados." },
  { slide:10, min:1, who:"Implantação", by:"caio", txt:"24 semanas sem parar a empresa." },
  { slide:11, min:1, who:"Benefícios/riscos", by:"oliver", txt:"Indicadores e riscos mitigados." },
  { slide:12, min:1, who:"Defesa", by:"oliver", txt:"Resposta direta a cada diretor." },
  { slide:13, min:0.5, who:"Fechamento", by:"oliver", txt:"Pedido de aprovação da Onda 1 e abertura para perguntas." },
];
/* Frase de passagem ao fim de cada bloco */
const HANDOFF = {
  2: "Passo a palavra para o Marcos, que vai mostrar como esses problemas se conectam e o que atacar primeiro.",
  4: "Agora a Talita mostra como fica o prédio depois das soluções.",
  6: "O Lucas continua com a parte de sistemas: o ERP e a pesquisa de preços.",
  8: "Com os preços em mãos, o Caio apresenta o orçamento e o cronograma.",
  10: "Para fechar, o Oliver apresenta os resultados esperados, os riscos e a nossa resposta à diretoria.",
};
