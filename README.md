# Distribuidora Horizonte — Consultoria em TI

Trabalho final de Fundamentos de Sistemas de Informação (Estudo de caso 01).

**Equipe de consultoria:** Oliver Henrique, Lucas Vasconcelos, Marcos de Oliveira, Rayna Livia, Caio Vilanova e Talita Nasser.

Apresentação executiva interativa em 3D (Three.js) com os 8 desafios da equipe de consultoria:
diagnóstico, priorização, soluções, pesquisa de mercado, orçamento, implantação, benefícios e riscos e defesa diante da diretoria.

**Apresentação online:** https://oliverhenrique04.github.io/Projeto-Fundamentos-SI/

**Relatório de consultoria (Word):** [`relatorio/Relatorio_Consultoria_Distribuidora_Horizonte.docx`](relatorio/Relatorio_Consultoria_Distribuidora_Horizonte.docx)

## Ordem de apresentação (15 min)

| # | Integrante | Bloco | Min |
|---|---|---|---|
| 1 | Rayna Livia | Abertura, agenda e diagnóstico no prédio | 3 |
| 2 | Marcos de Oliveira | Cadeia de impactos e priorização | 2,5 |
| 3 | Talita Nasser | Soluções no prédio e rede lógica | 2,5 |
| 4 | Lucas Vasconcelos | ERP e pesquisa de mercado | 2 |
| 5 | Caio Vilanova | Orçamento e implantação | 2,5 |
| 6 | Oliver Henrique | Benefícios e riscos, defesa e fechamento | 2,5 |

As notas do apresentador (tecla N) mostram quem fala em cada tela e a frase de passagem para o próximo.

## Como usar a apresentação

| Ação | Atalho |
|---|---|
| Avançar / voltar | ← → ou espaço |
| Notas do apresentador | N |
| Cronômetro (15 min) | T |
| Tela cheia | F |

Arraste para girar a cena 3D e clique nos objetos para ver detalhes.

## Estrutura

- `index.html` — página publicada (gerada, autossuficiente; Three.js via CDN jsDelivr)
- `src/data.js` — dados da proposta (problemas, soluções, preços, cronograma, riscos)
- `src/core.js`, `src/building.js`, `src/slides.js`, `src/app.js` — cena 3D e navegação
- `src/style.css`, `src/shell.html` — layout
- `build.py` — junta os arquivos de `src/` em `index.html`

Para regenerar a página: `python3 build.py`

Preços pesquisados em 16/11/2026; as fontes estão no botão "Fontes" da apresentação e na seção de referências do relatório.
