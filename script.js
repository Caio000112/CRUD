document.addEventListener('DOMContentLoaded', carregarPedidos);

document.getElementById('formularioPedido').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('cliente').value;
  const tipo = document.getElementById('tipoMarmita').value;
  const quantidade = parseInt(document.getElementById('quantidade').value);
  const restricoes = Array.from(document.querySelectorAll('.restricao:checked')).map(cb => cb.value);

  let valor = quantidade * 25;

  if (tipo === 'Vegetariana') valor *= 0.9;
  if (restricoes.length > 0) valor += quantidade * 5;

  const pedido = {
    nome,
    tipo,
    quantidade,
    restricoes: restricoes.join(', '),
    valorTotal: valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  };

  let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

  const editarIndice = parseInt(this.getAttribute('data-editar'));
  if (!isNaN(editarIndice)) {
    pedidos[editarIndice] = pedido;
    this.removeAttribute('data-editar');
  } else {
    pedidos.push(pedido);
  }

  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  this.reset();
  carregarPedidos();
});

function carregarPedidos() {
  const corpoTabela = document.getElementById('listaPedidos');
  corpoTabela.innerHTML = '';
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

  pedidos.forEach((p, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.tipo}</td>
      <td>${p.quantidade}</td>
      <td>${p.restricoes}</td>
      <td>${p.valorTotal}</td>
      <td>
        <button onclick="editarPedido(${i})">Editar</button>
        <button onclick="excluirPedido(${i})">Excluir</button>
      </td>
    `;
    corpoTabela.appendChild(tr);
  });
}

function editarPedido(indice) {
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  const p = pedidos[indice];

  document.getElementById('cliente').value = p.nome;
  document.getElementById('tipoMarmita').value = p.tipo;
  document.getElementById('quantidade').value = p.quantidade;

  document.querySelectorAll('.restricao').forEach(cb => {
    cb.checked = p.restricoes.includes(cb.value);
  });

  document.getElementById('formularioPedido').setAttribute('data-editar', indice);
}

function excluirPedido(indice) {
  let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  pedidos.splice(indice, 1);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  carregarPedidos();
}
