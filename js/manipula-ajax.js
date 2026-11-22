// Menu mobile (mesmo comportamento das outras páginas)
const mobileMenu = document.getElementById('mobile-menu');
const mainNav = document.getElementById('main-nav');

if (mobileMenu && mainNav) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
}

// Cria o objeto AJAX (XMLHttpRequest), com alternativa para navegadores antigos (IE)
function criarObjetoAjax() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    try {
        return new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
        try {
            return new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e2) {
            return null;
        }
    }
}

// Função de usuário chamada ao carregar a página
function listarVeiculos() {
    const resultado = document.getElementById('resultado');
    const ajax = criarObjetoAjax();

    if (!ajax) {
        resultado.innerHTML = '<p class="mensagem erro">Seu navegador não suporta AJAX.</p>';
        return;
    }

    // Arquivo PHP que será executado no servidor
    ajax.open('GET', 'listar_veiculos.php', true);

    ajax.onreadystatechange = function () {
        // readyState 4 = requisição concluída
        if (ajax.readyState === 4) {
            if (ajax.status === 200) {
                try {
                    const resposta = JSON.parse(ajax.responseText);
                    if (resposta.status === 'success') {
                        montarTabela(resposta.dados, resultado);
                    } else {
                        resultado.innerHTML = '<p class="mensagem erro">Erro: ' + escaparHtml(resposta.message) + '</p>';
                    }
                } catch (e) {
                    resultado.innerHTML = '<p class="mensagem erro">Resposta inválida do servidor.</p>';
                }
            } else {
                resultado.innerHTML = '<p class="mensagem erro">Falha na comunicação com o servidor (HTTP ' + ajax.status + ').</p>';
            }
        }
    };

    ajax.send(null);
}

// Monta a tabela com os dados dos veículos recebidos do servidor
function montarTabela(veiculos, destino) {
    if (!veiculos || veiculos.length === 0) {
        destino.innerHTML = '<p class="mensagem">Nenhum veículo cadastrado até o momento.</p>';
        return;
    }

    let html = '<table class="tabela-veiculos">' +
        '<thead><tr>' +
        '<th>ID</th><th>Marca</th><th>Modelo</th><th>Placa</th>' +
        '<th>ID Cliente</th><th>Cliente</th><th>Cadastrado em</th>' +
        '</tr></thead><tbody>';

    veiculos.forEach(function (v) {
        html += '<tr>' +
            '<td>' + escaparHtml(v.id) + '</td>' +
            '<td>' + escaparHtml(v.marca) + '</td>' +
            '<td>' + escaparHtml(v.modelo) + '</td>' +
            '<td class="placa">' + escaparHtml(v.placa) + '</td>' +
            '<td>' + escaparHtml(v.cliente_id) + '</td>' +
            '<td>' + escaparHtml(v.cliente_nome || '-') + '</td>' +
            '<td>' + formatarData(v.criado_em) + '</td>' +
            '</tr>';
    });

    html += '</tbody></table>' +
        '<p class="total">Total de veículos: ' + veiculos.length + '</p>';

    destino.innerHTML = html;
}

// Converte "2026-07-15 14:30:00" em "15/07/2026 14:30"
function formatarData(valor) {
    if (!valor) return '-';
    const partes = String(valor).split(' ');
    const data = partes[0].split('-');
    const hora = partes[1] ? partes[1].substring(0, 5) : '';
    return escaparHtml(data[2] + '/' + data[1] + '/' + data[0] + ' ' + hora);
}

// Evita que dados do banco sejam interpretados como HTML
function escaparHtml(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Chamada da função ao carregar a página
window.onload = listarVeiculos;
