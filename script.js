// === CONFIGURAÇÃO DOS VOTOS (definidos via código) === //
const totalVotos = 14; // total de votos possíveis
const votos = {
  BNK: 3,
  PUR: 3,
  THYRD: 4
};

// === FUNÇÃO PRINCIPAL === //
function atualizarApuracao() {
  const candidatesWrap = document.getElementById('candidates');
  const totalBox = document.getElementById('totalBox');
  const sectionsText = document.getElementById('sectionsText');
  const progressBar = document.getElementById('progressBar');
  const lastUpdate = document.getElementById('lastUpdate');

  // Soma e porcentagens
  const somaVotos = votos.BNK + votos.PUR + votos.THYRD;
  const porcentagens = {
    BNK: ((votos.BNK / somaVotos) * 100).toFixed(2),
    PUR: ((votos.PUR / somaVotos) * 100).toFixed(2),
    THYRD: ((votos.THYRD / somaVotos) * 100).toFixed(2)
  };

  // Ordena por votos
  const candidatos = [
    { id: 'BNK', name: 'BNK', party: 'BNK - PA.T.G]', photo: 'https://i.ibb.co/v6zZSgqz/image.png', votos: votos.BNK, percent: porcentagens.BNK },
    { id: 'PUR', name: 'PUR', party: 'PUR - [C.U]', photo: 'https://i.ibb.co/gZB1ZzXq/Screenshot-12.png', votos: votos.PUR, percent: porcentagens.PUR },
    { id: 'THYRD', name: 'THYRD', party: 'THYRD - [Partido CTR]', photo: 'https://i.ibb.co/WW1DYk6J/oiieee.png', votos: votos.THYRD, percent: porcentagens.THYRD }
  ].sort((a, b) => b.votos - a.votos);

  const temSegundoTurno = candidatos.every(c => parseFloat(c.percent) <= 50);

  // Renderiza cards
  candidatesWrap.innerHTML = '';
  candidatos.forEach((c, index) => {
    let status = '';
    if (temSegundoTurno && (index === 0 || index === 1)) {
      status = '⚠️ Segundo Turno';
    } else if (!temSegundoTurno && index === 0) {
      status = '✅ Eleito (1º turno)';
    } else {
      status = 'Não Eleito';
    }

    const card = document.createElement('article');
    card.className = 'candidateCard';
    card.innerHTML = `
      <div class="avatar"><img src="${c.photo}" alt="${c.name}"></div>
      <div class="info">
        <div class="nameRow">
          <div>
            <div class="name">${c.name}</div>
            <div class="party">${c.party}</div>
          </div>
          <div>
            <div class="badge">${status}</div>
          </div>
        </div>
        <div class="votesRow">
          <div>
            <div style="font-size:0.75rem;color:var(--muted)">Votos</div>
            <div class="votes">${c.votos.toLocaleString()}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:0.75rem;color:var(--muted)">Porcentagem</div>
            <div class="percent">${c.percent}%</div>
          </div>
        </div>
      </div>`;

    // adiciona gráfico apenas no vencedor
    if (index === 0) {
      const chartContainer = document.createElement('div');
      chartContainer.style.marginTop = '14px';
      chartContainer.innerHTML = `<canvas id="barChart"></canvas>`;
      card.appendChild(chartContainer);
    }

    candidatesWrap.appendChild(card);
  });

  // Atualiza totais e barra de progresso
  totalBox.textContent = somaVotos.toLocaleString();
  const apuracaoPercent = ((somaVotos / totalVotos) * 100).toFixed(2);
  sectionsText.textContent = `${apuracaoPercent}% dos votos totalizados`;
  progressBar.style.width = `${apuracaoPercent}%`;
  lastUpdate.textContent = `Última atualização: ${new Date().toLocaleString()}`;

  // Cria gráfico no card do vencedor
  const ctx = document.getElementById('barChart').getContext('2d');
  if (window.barChart) window.barChart.destroy();
  window.barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: candidatos.map(c => c.name),
      datasets: [{
        label: 'Votos',
        data: candidatos.map(c => c.votos),
        borderRadius: 8,
        barThickness: 28,
        backgroundColor: ['#4f46e5', '#22c55e', '#f59e0b']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// === INICIALIZAÇÃO === //
document.addEventListener('DOMContentLoaded', atualizarApuracao);
