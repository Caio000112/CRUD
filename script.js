const form = document.getElementById("reservaForm");
const tabela = document.getElementById("tabelaReservas");

let editIndex = null;

function calcularValor(tipo, diarias, cafe) {
let valorDiaria = {
"Compartilhado": 50,
"Privativo Simples": 90,
"Privativo Luxo": 150
}[tipo];

let valor = valorDiaria * diarias;
if (cafe) valor += 20 * diarias;

return valor;
}

function salvarLocalStorage(reservas) {
localStorage.setItem("reservas", JSON.stringify(reservas));
}

function carregarReservas() {
const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
tabela.innerHTML = "";
reservas.forEach((r, i) => {
const linha = document.createElement("tr");
linha.innerHTML = `
<td>${r.nome}</td>
<td>${r.tipo}</td>
<td>${r.diarias}</td>
<td>${r.cafe ? "Sim" : "Não"}</td>
<td>R$${r.valor.toFixed(2)}</td>
<td>
<button onclick="editar(${i})">Editar</button>
<button onclick="excluir(${i})">Excluir</button>
</td>
`;
tabela.appendChild(linha);
});
}

form.addEventListener("submit", (e) => {
e.preventDefault();

const nome = document.getElementById("nome").value;
const tipo = document.getElementById("tipoQuarto").value;
const diarias = parseInt(document.getElementById("diarias").value);
const cafe = document.getElementById("cafe").checked;
const valor = calcularValor(tipo, diarias, cafe);

const novaReserva = { nome, tipo, diarias, cafe, valor };

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

if (editIndex !== null) {
reservas[editIndex] = novaReserva;
editIndex = null;
} else {
reservas.push(novaReserva);
}

salvarLocalStorage(reservas);
carregarReservas();
form.reset();
});

function editar(index) {
const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
const r = reservas[index];
document.getElementById("nome").value = r.nome;
document.getElementById("tipoQuarto").value = r.tipo;
document.getElementById("diarias").value = r.diarias;
document.getElementById("cafe").checked = r.cafe;
editIndex = index;
}

function excluir(index) {
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
reservas.splice(index, 1);
salvarLocalStorage(reservas);
carregarReservas();
}

window.onload = carregarReservas;
