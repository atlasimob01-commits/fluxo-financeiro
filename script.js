// =========================================
// FLUXO FINANCEIRO SHARKS
// =========================================

const CONFIG = {
    multiplicadorRenda: 60,
    percentualMaximo: 0.80
};

// INPUTS
const valorImovel = document.getElementById("valorImovel");
const renda = document.getElementById("renda");
const ato = document.getElementById("ato");
const fgts = document.getElementById("fgts");
const parcelas = document.getElementById("parcelas");
const anuaisValor = document.getElementById("anuaisValor");
const anuaisVezes = document.getElementById("anuaisVezes");

// OUTPUTS
const faixa = document.getElementById("faixa");
const financiado = document.getElementById("financiado");
const entrada = document.getElementById("entrada");
const restante = document.getElementById("restante");
const valorParcela = document.getElementById("valorParcela");

const barra = document.getElementById("barraFinanciamento");
const textoBarra = document.getElementById("textoBarra");

// SMALL UI
const percFinanciadoSmall = document.getElementById("percFinanciadoSmall");
const percEntradaSmall = document.getElementById("percEntradaSmall");
const parcelasSmall = document.getElementById("parcelasSmall");

// ANUAIS
const anuaisResumo = document.getElementById("anuaisResumo");
const anuaisDetalhe = document.getElementById("anuaisDetalhe");

// =========================================
// FORMAT
// =========================================

function numero(campo) {
    return Number(campo.value.replace(/\D/g, "")) / 100 || 0;
}

function moeda(v) {
    return v.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatar(input) {
    input.addEventListener("input", () => {
        let v = input.value.replace(/\D/g, "");
        input.value = (Number(v) / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
        calcular();
    });
}

// máscaras
[valorImovel, renda, ato, fgts, anuaisValor].forEach(formatar);

// =========================================
// LÓGICA
// =========================================

function faixaMCMV(renda) {
    if (renda <= 3200) return "Faixa 1";
    if (renda <= 5000) return "Faixa 2";
    if (renda <= 9600) return "Faixa 3";
    if (renda <= 13000) return "Faixa 4";
    return "Fora";
}

function financiamento(imovel, renda) {
    return Math.min(
        renda * CONFIG.multiplicadorRenda,
        imovel * CONFIG.percentualMaximo
    );
}

// =========================================
// CALCULO PRINCIPAL
// =========================================

function calcular() {

    const imovel = numero(valorImovel);
    const rendaV = numero(renda);
    const atoV = numero(ato);
    const fgtsV = numero(fgts);

    const qtdParcelas = Number(parcelas.value) || 1;

    const valorAnuais = numero(anuaisValor);
    const qtdAnuais = Number(anuaisVezes.value) || 0;

    const totalAnuais = valorAnuais * qtdAnuais;

    const fin = financiamento(imovel, rendaV);
    const entradaV = Math.max(0, imovel - fin);

    const percFin = imovel ? (fin / imovel) * 100 : 0;
    const percEnt = imovel ? (entradaV / imovel) * 100 : 0;

    let saldo = entradaV - atoV - fgtsV - totalAnuais;
    if (saldo < 0) saldo = 0;

    const parcela = saldo / qtdParcelas;

    // UI principal
    faixa.textContent = faixaMCMV(rendaV);
    financiado.textContent = moeda(fin);
    entrada.textContent = moeda(entradaV);
    restante.textContent = moeda(saldo);

    valorParcela.textContent = moeda(parcela);

    barra.style.width = percFin + "%";
    textoBarra.textContent = percFin.toFixed(1) + "%";

    percFinanciadoSmall.textContent = percFin.toFixed(1) + "%";
    percEntradaSmall.textContent = percEnt.toFixed(1) + "%";

    parcelasSmall.textContent = qtdParcelas + "x";

    // =========================================
    // ANUAIS FINAL LIMPO (SEM BUG)
    // =========================================

    anuaisResumo.textContent = moeda(totalAnuais);

    const valorUnitario = qtdAnuais > 0 ? (totalAnuais / qtdAnuais) : 0;

    anuaisDetalhe.textContent =
        qtdAnuais + "x de " + moeda(valorUnitario);
}

// eventos
parcelas.addEventListener("input", calcular);
anuaisVezes.addEventListener("input", calcular);

// init
calcular();
