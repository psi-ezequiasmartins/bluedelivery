export function imprimirListagemDePedidos(dadosParaImpressao) {
  if (!dadosParaImpressao || dadosParaImpressao.length === 0) {
    console.warn('Nenhum dado disponível para criar o corpo do documento.');
    return [{ text: 'Nenhum pedido em aberto.', style: 'noData' }];
  }

  const maxLinesPerPage = 50; // Ajustado para aproveitar melhor o espaço
  let currentLineCount = 0; // Contador de linhas na página atual
  const body = [];

  // Header do relatório
  body.push(
    {text: 'LISTAGEM DE PEDIDOS EM ABERTO (FILA DE PEDIDOS)', style: 'headerTitle', alignment: 'center', margin: [0, 0, 0, 10] },
    {text: '____________________________________________________________________________________________________________________________________________________________', style: 'separator' }, // Linha separadora
  );

  dadosParaImpressao.forEach((pedido) => {
    // Calcula o número de linhas do pedido
    const baseLines = 9; // Linhas fixas do pedido (cabeçalho, infos, valores)
    const itemLines = Array.isArray(pedido.ITENS)
      ? pedido.ITENS.reduce((count, item) => {
          const acrescimosLines = item.ACRESCIMOS && item.ACRESCIMOS.length > 0 ? 1 : 0;
          const obsLines = item.OBS ? 1 : 0;
          return count + 1 + acrescimosLines + obsLines; // 1 linha para o item + acréscimos + observações
        }, 0)
      : 1; // Caso não tenha itens, conta 1 linha padrão

    const totalLines = baseLines + itemLines;

    // Verifica se o pedido cabe na página atual
    if (currentLineCount + totalLines > maxLinesPerPage) {
      body.push({ text: '', pageBreak: 'before' }); // Força quebra de página
      currentLineCount = 0; // Reseta o contador de linhas para a nova página
    }

    // Adiciona o pedido ao corpo do documento
    const itens = Array.isArray(pedido.ITENS)
      ? pedido.ITENS.map((item) => {
          const acrescimos = item.ACRESCIMOS && item.ACRESCIMOS.length > 0
            ? `Acréscimos: ${item.ACRESCIMOS.map((a) => a.DESCRICAO).join(', ')}`
            : null; // Suprime se não houver acréscimos
          const obs = item.OBS ? `Obs: ${item.OBS}` : null; // Suprime se não houver observações
          return [
            `${item.QTD}x ${item.PRODUTO_NOME}`,
            acrescimos,
            obs,
          ]
            .filter((line) => line) // Remove linhas nulas ou vazias
            .join('\n');
        }).join('\n')
      : 'Nenhum item encontrado.';

    body.push(
      { text: `PEDIDO: ${pedido.PEDIDO_ID} - STATUS: ${pedido.STATUS}`, style: 'pedidoHeader' },
      { text: `DATA/HORA: ${pedido.DATA}`, style: 'pedidoInfo' },
      { text: `CLIENTE: ${pedido.USER_ID} - ${pedido.CLIENTE}`, style: 'pedidoInfo' },
      { text: `ENDEREÇO: ${pedido.ENDERECO_ENTREGA}`, style: 'pedidoInfo' },
      { text: `ITENS:\n${itens}`, style: 'pedidoItens' },
      { text: `SUB-TOTAL: R$ ${parseFloat(pedido.VR_SUBTOTAL || 0).toFixed(2).replace('.', ',')}`, style: 'pedidoValores' },
      { text: `TAXA DE ENTREGA: R$ ${parseFloat(pedido.TAXA_ENTREGA || 0).toFixed(2).replace('.', ',')}`, style: 'pedidoValores' },
      { text: `VALOR TOTAL: R$ ${parseFloat(pedido.VR_TOTAL || 0).toFixed(2).replace('.', ',')}`, style: 'pedidoValores' },
    );

    currentLineCount += totalLines; // Atualiza o contador de linhas
  });

  return {
    pageSize: 'A4',
    pageMargins: [10, 20, 15, 50],
    content: body,
    footer(currentPage, pageCount) {
      const dataHoraAtual = new Date().toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });

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
      headerTitle: {
        fontSize: 14,
        bold: true,
        color: '#145E7D',
      },
      pedidoHeader: {
        fontSize: 10,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      pedidoInfo: {
        fontSize: 9,
        margin: [0, 2, 0, 2],
      },
      pedidoItens: {
        fontSize: 9,
        margin: [0, 5, 0, 5],
      },
      pedidoValores: {
        fontSize: 9,
        bold: false,
        margin: [0, 2, 0, 2],
      },
      separator: {
        fontSize: 8,
        alignment: 'center',
        margin: [0, 10, 0, 10],
      },
      noData: {
        fontSize: 10,
        alignment: 'center',
        margin: [0, 20, 0, 20],
      },
    },
  };
}