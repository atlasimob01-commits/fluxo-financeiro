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
const nomeCliente = document.getElementById("nomeCliente");

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

// Máscaras
[
    valorImovel,
    renda,
    ato,
    fgts,
    anuaisValor
].forEach(formatar);

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

}// =========================================
// CÁLCULO PRINCIPAL
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

    const percFin = imovel
        ? (fin / imovel) * 100
        : 0;

    const percEnt = imovel
        ? (entradaV / imovel) * 100
        : 0;

    let saldo = entradaV - atoV - fgtsV - totalAnuais;

    if (saldo < 0) {
        saldo = 0;
    }

    const parcela = saldo / qtdParcelas;

    // RESULTADOS

    faixa.textContent = faixaMCMV(rendaV);

    financiado.textContent = moeda(fin);

    entrada.textContent = moeda(entradaV);

    restante.textContent = moeda(saldo);

    valorParcela.textContent = moeda(parcela);

    barra.style.width = percFin + "%";

    textoBarra.textContent =
        percFin.toFixed(1) + "%";

    percFinanciadoSmall.textContent =
        percFin.toFixed(1) + "%";

    percEntradaSmall.textContent =
        percEnt.toFixed(1) + "%";

    parcelasSmall.textContent =
        qtdParcelas + "x";

    anuaisResumo.textContent =
        moeda(totalAnuais);

    const valorUnitario =
        qtdAnuais > 0
            ? totalAnuais / qtdAnuais
            : 0;

    anuaisDetalhe.textContent =
        qtdAnuais + "x de " + moeda(valorUnitario);

}

// =========================================
// EVENTOS
// =========================================

parcelas.addEventListener("input", calcular);

anuaisVezes.addEventListener("input", calcular);

// =========================================
// INICIALIZAÇÃO
// =========================================

calcular();

// =========================================
// BOTÃO PDF
// =========================================

const btnWhatsapp = document.getElementById("btnWhatsapp");
const btnPdf = document.getElementById("btnPdf");
const btnImprimir = document.getElementById("btnImprimir");

console.log("Whats:", btnWhatsapp);
console.log("PDF:", btnPdf);
console.log("Imprimir:", btnImprimir);

btnWhatsapp.addEventListener("click", abrirModalWhatsapp);

btnPdf.addEventListener("click", gerarPDF);

btnImprimir.addEventListener("click", () => {
    window.print();
});

const { jsPDF } = window.jspdf;

function gerarPDF() {

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const cliente =
        nomeCliente.value.trim() || "Não informado";

    const dataHora =
        new Date().toLocaleString("pt-BR");

    // =====================================
    // CABEÇALHO
    // =====================================

    doc.setFillColor(0,59,115);
    doc.rect(0,0,210,30,"F");

    doc.setTextColor(255,255,255);

    doc.setFont("helvetica","bold");
    doc.setFontSize(21);

    doc.text(
        "FLUXO FINANCEIRO SHARKS",
        105,
        13,
        {align:"center"}
    );

    doc.setFontSize(11);

    doc.text(
        "Simulação Financeira",
        105,
        21,
        {align:"center"}
    );

    // =====================================
    // CLIENTE
    // =====================================

    doc.setTextColor(40);

    doc.setFont("helvetica","bold");
    doc.setFontSize(12);

    doc.text(
        "CLIENTE",
        20,
        42
    );

    doc.setFont("helvetica","normal");

    doc.text(
        cliente,
        20,
        49
    );

    doc.setFont("helvetica","bold");

    doc.text(
        "DATA",
        145,
        42
    );

    doc.setFont("helvetica","normal");

    doc.text(
        dataHora,
        145,
        49
    );

    // =====================================
    // RESULTADO
    // =====================================

    doc.setDrawColor(220);
    doc.roundedRect(15,60,180,55,3,3);

    doc.setFont("helvetica","bold");
    doc.setFontSize(14);

    doc.text(
        "RESULTADO DA SIMULAÇÃO",
        20,
        70
    );

    doc.setFontSize(11);

    doc.setFont("helvetica","bold");

    doc.text(
        "Financiado",
        25,
        84
    );

    doc.setFontSize(18);

    doc.setTextColor(0,59,115);

    doc.text(
        financiado.textContent,
        25,
        94
    );

    doc.setTextColor(40);

    doc.setFontSize(11);

    doc.setFont("helvetica","bold");

    doc.text(
        "Entrada",
        110,
        84
    );

    doc.setFontSize(18);

    doc.setTextColor(20,140,60);

    doc.text(
        entrada.textContent,
        110,
        94
    );

    doc.setTextColor(40);    doc.setFontSize(11);
    doc.setFont("helvetica","bold");
    doc.setTextColor(40);

    doc.text(
        "Parcelamento",
        25,
        108
    );

    doc.setFont("helvetica","normal");
    doc.setFontSize(14);

    doc.text(
        parcelasSmall.textContent +
        " de " +
        valorParcela.textContent,
        25,
        116
    );

    // =====================================
    // DADOS DA COMPRA
    // =====================================

    let y = 132;

    doc.setDrawColor(220);
    doc.roundedRect(15,y,180,78,3,3);

    doc.setFont("helvetica","bold");
    doc.setFontSize(14);

    doc.text(
        "DADOS DA COMPRA",
        20,
        y + 10
    );

    y += 22;

    doc.setFontSize(10);

    doc.setFont("helvetica","bold");
    doc.text("Valor do Imóvel",20,y);

    doc.setFont("helvetica","normal");
    doc.text(valorImovel.value || "-",105,y,{align:"right"});

    y += 8;

    doc.setFont("helvetica","bold");
    doc.text("Renda Bruta",20,y);

    doc.setFont("helvetica","normal");
    doc.text(renda.value || "-",105,y,{align:"right"});

    y += 8;

    doc.setFont("helvetica","bold");
    doc.text("ATO",20,y);

    doc.setFont("helvetica","normal");
    doc.text(ato.value || "-",105,y,{align:"right"});

    y += 8;

    doc.setFont("helvetica","bold");
    doc.text("FGTS",20,y);

    doc.setFont("helvetica","normal");
    doc.text(fgts.value || "-",105,y,{align:"right"});

    y += 8;

    doc.setFont("helvetica","bold");
    doc.text("Parcelamento",20,y);

    doc.setFont("helvetica","normal");
    doc.text(parcelas.value + "x",105,y,{align:"right"});

    y += 8;

    doc.setFont("helvetica","bold");
    doc.text("Valor da Anual",20,y);

    doc.setFont("helvetica","normal");
    doc.text(anuaisValor.value || "-",105,y,{align:"right"});

    y += 8;

    doc.setFont("helvetica","bold");
    doc.text("Anuais",20,y);

    doc.setFont("helvetica","normal");
    doc.text(String(anuaisVezes.value || "0"),105,y,{align:"right"});    // =====================================
    // RESUMO DA SIMULAÇÃO
    // =====================================

    y += 16;

    doc.setDrawColor(220);
    doc.roundedRect(15,y,180,42,3,3);

    doc.setFont("helvetica","bold");
    doc.setFontSize(14);

    doc.text(
        "RESUMO",
        20,
        y + 10
    );

    doc.setFontSize(10);

    doc.setFont("helvetica","bold");

    doc.text(
        "Faixa MCMV",
        20,
        y + 22
    );

    doc.setFont("helvetica","normal");

    doc.text(
        faixa.textContent,
        70,
        y + 22
    );

    doc.setFont("helvetica","bold");

    doc.text(
        "Saldo Restante",
        110,
        y + 22
    );

    doc.setFont("helvetica","normal");

    doc.text(
        restante.textContent,
        190,
        y + 22,
        {align:"right"}
    );

    doc.setFont("helvetica","bold");

    doc.text(
        "Percentual Financiado",
        20,
        y + 34
    );

    doc.setFont("helvetica","normal");

    doc.text(
        percFinanciadoSmall.textContent,
        70,
        y + 34
    );

    doc.setFont("helvetica","bold");

    doc.text(
        "Percentual Entrada",
        110,
        y + 34
    );

    doc.setFont("helvetica","normal");

    doc.text(
        percEntradaSmall.textContent,
        190,
        y + 34,
        {align:"right"}
    );

    // =====================================
    // AVISO LEGAL
    // =====================================

    y += 55;

    doc.setFillColor(246,246,246);

    doc.roundedRect(
        15,
        y,
        180,
        48,
        3,
        3,
        "F"
    );

    doc.setFont("helvetica","bold");
    doc.setFontSize(10);

    doc.setTextColor(40);

    doc.text(
        "AVISO LEGAL",
        20,
        y + 8
    );

    doc.setFont("helvetica","normal");
    doc.setFontSize(7);

    const aviso =
        "Esta simulação possui caráter exclusivamente informativo e não constitui proposta, garantia de aprovação de crédito ou compromisso contratual. Os valores apresentados são estimativas calculadas com base nas informações fornecidas e poderão sofrer alterações após a análise da instituição financeira. A aprovação do financiamento, bem como as condições finais de crédito, taxas de juros, valor financiado, entrada, prazos e parcelas, dependerão da análise cadastral e de crédito do cliente, considerando renda comprovada, score de crédito, situação cadastral do CPF, documentação apresentada, avaliação do imóvel e demais critérios adotados pela instituição financeira.";

    const linhas =
        doc.splitTextToSize(
            aviso,
            170
        );

    doc.text(
        linhas,
        20,
        y + 14
    );    
    // =====================================
    // RODAPÉ
    // =====================================

    doc.setDrawColor(220);
    doc.line(15,287,195,287);

    doc.setFont("helvetica","normal");
    doc.setFontSize(8);
    doc.setTextColor(120);

    doc.text(
        "Fluxo Financeiro Sharks • Documento gerado automaticamente para fins exclusivos de simulação.",
        105,
        292,
        { align: "center" }
    );

  // =====================================
// SALVAR PDF
// =====================================

let nomeArquivo;

if (cliente !== "Não informado") {

    nomeArquivo = `Simulação - ${cliente}.pdf`;

} else {

    const hoje = new Date();

    const data = hoje
        .toLocaleDateString("pt-BR")
        .replace(/\//g, "-");

    nomeArquivo = `Simulação - ${data}.pdf`;

} // <-- ESTA CHAVE ESTAVA FALTANDO

doc.save(nomeArquivo);

} 

// =========================================
// WHATSAPP
// =========================================

const modalWhatsapp = document.getElementById("modalWhatsapp");
const telefoneWhatsapp = document.getElementById("telefoneWhatsapp");

const btnCancelarWhatsapp = document.getElementById("btnCancelarWhatsapp");
const btnEnviarWhatsapp = document.getElementById("btnEnviarWhatsapp");

// =========================================
// MÁSCARA TELEFONE BRASIL
// =========================================

telefoneWhatsapp.addEventListener("input", function () {

    let valor = this.value.replace(/\D/g, "");

    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }

    if (valor.length > 10) {

        valor = valor.replace(
            /^(\d{2})(\d{5})(\d{4}).*/,
            "($1) $2-$3"
        );

    } else if (valor.length > 6) {

        valor = valor.replace(
            /^(\d{2})(\d{4})(\d{0,4}).*/,
            "($1) $2-$3"
        );

    } else if (valor.length > 2) {

        valor = valor.replace(
            /^(\d{2})(\d+)/,
            "($1) $2"
        );

    } else if (valor.length > 0) {

        valor = valor.replace(
            /^(\d+)/,
            "($1"
        );

    }

    this.value = valor;

});

function abrirModalWhatsapp() {

    telefoneWhatsapp.value = "";

    modalWhatsapp.classList.add("ativo");

    telefoneWhatsapp.focus();

}

function fecharModalWhatsapp() {

    modalWhatsapp.classList.remove("ativo");

}

btnCancelarWhatsapp.addEventListener("click", fecharModalWhatsapp);

modalWhatsapp.addEventListener("click", function(e){

    if(e.target === modalWhatsapp){

        fecharModalWhatsapp();

    }

});

btnEnviarWhatsapp.addEventListener("click", enviarWhatsapp);

function enviarWhatsapp(){

    let telefone = telefoneWhatsapp.value.replace(/\D/g,"");

    if(telefone.length < 10){

        alert("Digite um telefone válido.");

        telefoneWhatsapp.focus();

        return;

    }

    if(!telefone.startsWith("55")){

        telefone = "55" + telefone;

    }

    const cliente = nomeCliente.value.trim();

    let mensagem = "";

    if(cliente){

        mensagem += "Olá, " + cliente + "!%0A%0A";

    }else{

        mensagem += "Olá!%0A%0A";

    }

    mensagem +=
        "Segue sua simulação financeira em anexo.%0A%0A";

    mensagem +=
        "Caso tenha qualquer dúvida, fico à disposição.%0A%0A";

    mensagem +=
        "Equipe Sharks 🦈";

// Altera o botão enquanto envia
btnEnviarWhatsapp.disabled = true;
btnEnviarWhatsapp.textContent = "⏳ Enviando...";

// Gera o PDF
gerarPDF();

// Aguarda o download iniciar
setTimeout(() => {

    window.open(

        "https://wa.me/" +
        telefone +
        "?text=" +
        mensagem,

        "_blank"

    );

    // Fecha o modal
    fecharModalWhatsapp();

    // Restaura o botão
    btnEnviarWhatsapp.disabled = false;
    btnEnviarWhatsapp.textContent = "Enviar";

}, 700);
}
