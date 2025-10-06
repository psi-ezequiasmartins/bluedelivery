export function imprimirListagemDeItensAcrescimo(dadosParaImpressao) {
  if (!dadosParaImpressao || dadosParaImpressao.length === 0) {
    console.warn('Nenhum dado disponível para criar o corpo do documento.');
    return [{ text: 'Nenhum item de acréscimo disponível.', style: 'noData' }];
  }

  // Título do relatório
  const titulo = [
    {
      text: 'LISTAGEM DE ITENS DE ACRÉSCIMO (EXTRAS)',
      style: 'title',
      colSpan: 4,
      alignment: 'center',
    },
    {}, {}, {}, // Preenche as colunas restantes
  ];

  // Cabeçalho da tabela
  const header = [
    { text: 'ID', bold: true, fontSize: 9, margin: [5, 4, 0, 0] },
    { text: 'Delivery ID', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
    { text: 'Descrição', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
    { text: 'Valor Unitário', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
  ];

  // Linha separadora abaixo do cabeçalho
  const separador = [
    {
      text:
        '__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
      colSpan: 4,
      alignment: 'center',
      fontSize: 5,
    },
    {}, {}, {}, // Preenche as colunas restantes
  ];

  // Corpo da tabela
  const body = dadosParaImpressao.map((extra) => {
    return [
      { text: extra.EXTRA_ID || '-', fontSize: 8, margin: [5, 0, 0, 0] },
      { text: extra.DELIVERY_ID || '-', fontSize: 8 },
      { text: extra.DESCRICAO || '-', fontSize: 8 },
      { text: `R$ ${parseFloat(extra.VR_UNITARIO || 0).toFixed(2).replace('.', ',')}`, fontSize: 8 },
    ];
  });

  // Combina o título, cabeçalho, linha separadora e corpo
  const content = [titulo, header, separador, ...body];

  const dataHoraAtual = new Date().toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return {
    pageSize: 'A4',
    pageMargins: [10, 20, 15, 50],
    header: {
      margin: [15, 15, 15, 0],
      layout: 'noBorders',
      table: {
        widths: ['*'],
        body: [
          [
            {
              text: 'LISTAGEM DE ITENS DE ACRÉSCIMO (EXTRAS)',
              style: 'title',
            },
          ],
        ],
      },
    },
    content: [
      {
        layout: 'noBorders',
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', 'auto'],
          body: content,
        },
      },
    ],
    footer(currentPage, pageCount) {
      return {
        layout: 'noBorders',
        margin: [15, 0, 15, 20],
        table: {
          widths: ['*'],
          body: [
            [
              {
                text:
                  '_________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
                alignment: 'center',
                fontSize: 5,
              },
            ],
            [
              {
                text: `Página ${currentPage.toString()} de ${pageCount}`,
                fontSize: 7,
                alignment: 'right',
                margin: [3, 0],
              },
            ],
            [
              {
                text: `Impresso em: ${dataHoraAtual}`,
                fontSize: 7,
                alignment: 'right',
                margin: [3, 0],
              },
            ],
          ],
        },
      };
    },
    styles: {
      title: {
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, 10, 0, 10],
        color: '#145E7D',
      },
      noData: {
        fontSize: 10,
        alignment: 'center',
        margin: [0, 20, 0, 20],
      },
    },
  };
}