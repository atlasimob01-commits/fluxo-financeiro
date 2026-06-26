// =========================================
// FLUXO FINANCEIRO SHARKS
// Feito por Atlas
// =========================================

// ---------- CONFIG ----------

const CONFIG = {
    multiplicadorRenda: 60,
    percentualMaximo: 0.80
};

// ---------- CAMPOS ----------

const valorImovel = document.getElementById("valorImovel");
const renda = document.getElementById("renda");
const ato = document.getElementById("ato");
const fgts = document.getElementById("fgts");
const parcelas = document.getElementById("parcelas");

// ANUAIS
const anuaisValor = document.getElementById("anuaisValor");
const anuaisVezes = document.getElementById("anuaisVezes");
const anuaisResumo = document.getElementById("anuaisResumo");

// ---------- RESULTADOS ----------

const faixa = document.getElementById("faixa");
const financiado = document.getElementById("financiado");
const percFinanciado = document.getElementById("percFinanciado");
const entrada = document.getElementById("entrada");
const percEntrada = document.getElementById("percEntrada");
const restante = document.getElementById("restante");
const valorParcela = document.getElementById("valorParcela");

const barra = document.getElementById("barraFinanciamento");
const textoBarra = document.getElementById("textoBarra");

// =========================================
// FORMATAÇÃO
// =========================================

function formatarMoeda(valor) {
    valor = valor.replace(/\D/g, "");
    if (valor === "") valor = "0";

    return (parseInt(valor) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function numero(campo) {
    return Number(campo.value.replace(/\D/g, "")) / 100;
}

function moeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// =========================================
// MÁSCARA
// =========================================

function aplicarMascara(input) {
    input.addEventListener("input", function () {
        this.value = formatarMoeda(this.value);
        calcular();
    });
}

aplicarMascara(valorImovel);
aplicarMascara(renda);
aplicarMascara(ato);
aplicarMascara(fgts);
aplicarMascara(anuaisValor);

// =========================================
// FAIXA MCMV
// =========================================

function calcularFaixa(renda) {
    if (renda <= 3200) return "Faixa 1";
    if (renda <= 5000) return "Faixa 2";
    if (renda <= 9600) return "Faixa 3";
    if (renda <= 13000) return "Faixa 4";
    return "Fora do MCMV";
}

// =========================================
// FINANCIAMENTO
// =========================================

function calcularFinanciamento(imovel, renda) {
    const pelaRenda = renda * CONFIG.multiplicadorRenda;
    const limite = imovel * CONFIG.percentualMaximo;

    return Math.min(pelaRenda, limite);
}

// =========================================
// CÁLCULO PRINCIPAL
// =========================================

function calcular() {

    const imovel = numero(valorImovel);
    const rendaBruta = numero(renda);
    const valorAto = numero(ato);
    const valorFgts = numero(fgts);

    const qtdParcelas = Number(parcelas.value) || 1;

    // ANUAIS
    const valorAnuais = numero(anuaisValor);
    const qtdAnuais = Number(anuaisVezes.value) || 1;
    const totalAnuais = valorAnuais * qtdAnuais;

    const faixaAtual = calcularFaixa(rendaBruta);

    const valorFinanciado = calcularFinanciamento(imovel, rendaBruta);

    const valorEntrada = Math.max(0, imovel - valorFinanciado);

    const percentualFinanciado =
        imovel > 0 ? (valorFinanciado / imovel) * 100 : 0;

    const percentualEntrada =
        imovel > 0 ? (valorEntrada / imovel) * 100 : 0;

    // SALDO ENTRADA
    let saldoEntrada =
        valorEntrada
        - valorAto
        - valorFgts
        - totalAnuais;

    if (saldoEntrada < 0) saldoEntrada = 0;

    const parcela = saldoEntrada / qtdParcelas;

    // =========================================
    // ATUALIZA UI
    // =========================================

    faixa.textContent = faixaAtual;
    financiado.textContent = moeda(valorFinanciado);
    entrada.textContent = moeda(valorEntrada);
    restante.textContent = moeda(saldoEntrada);

    percFinanciado.textContent = percentualFinanciado.toFixed(1) + "%";
    percEntrada.textContent = percentualEntrada.toFixed(1) + "%";

    barra.style.width = percentualFinanciado + "%";

    textoBarra.textContent =
        percentualFinanciado.toFixed(1) +
        "% Financiado | " +
        percentualEntrada.toFixed(1) +
        "% Entrada";

    // 🔥 ALTERAÇÃO FEITA AQUI (VALOR DA PARCELA)
    valorParcela.textContent =
        qtdParcelas + "x de " + moeda(parcela);

    // ANUAIS RESUMO
    anuaisResumo.textContent =
        qtdAnuais + "x de " + moeda(valorAnuais) +
        " = " + moeda(totalAnuais);
}

// =========================================
// EVENTOS
// =========================================

parcelas.addEventListener("input", calcular);
anuaisVezes.addEventListener("input", calcular);

// =========================================
// INICIALIZAÇÃO
// =========================================

valorImovel.value = formatarMoeda("0");
renda.value = formatarMoeda("0");
ato.value = formatarMoeda("0");
fgts.value = formatarMoeda("0");
anuaisValor.value = formatarMoeda("0");

calcular();