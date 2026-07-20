const MESES_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const MESES_ABREV_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function getPeriodoAtual(date = new Date()) {
  const mesIndex = date.getMonth();
  const ano = date.getFullYear();
  return {
    mesIndex,
    mes: mesIndex + 1,
    mesExtenso: MESES_PT[mesIndex],
    mesAbrev: MESES_ABREV_PT[mesIndex],
    ano,
    anoAbrev: String(ano).slice(-2),
    trimestre: Math.floor(mesIndex / 3) + 1,
    dia: date.getDate(),
  };
}

export function getCicloLabel(date = new Date()) {
  const p = getPeriodoAtual(date);
  return `Ciclo Q${p.trimestre} · ${p.mesAbrev} ${p.anoAbrev}`;
}

// String "AAAA-MM" (mesma convenção do <input type="month">) — usada como formato
// canônico do mês selecionado globalmente no portal.
export function mesStringAtual(date = new Date()) {
  const p = getPeriodoAtual(date);
  return `${p.ano}-${String(p.mes).padStart(2, '0')}`;
}

export function mudarMesString(mesStr, delta) {
  const [ano, mes] = mesStr.split('-').map(Number);
  const d = new Date(ano, mes - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function getPeriodoDoMes(mesStr) {
  const [ano, mes] = mesStr.split('-').map(Number);
  return getPeriodoAtual(new Date(ano, mes - 1, 1));
}

// Intervalo [inicio, fim] (datas "AAAA-MM-DD") do mês — para filtros .gte/.lte no Supabase.
export function getIntervaloDoMes(mesStr) {
  const [ano, mes] = mesStr.split('-').map(Number);
  const inicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const fim = `${ano}-${String(mes).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`;
  return { inicio, fim };
}

export function parseDiaMesNascimento(str) {
  if (!str || typeof str !== 'string') return null;
  const s = str.trim();
  if (!s) return null;
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) {
    const mes = Number(m[2]), dia = Number(m[3]);
    if (mes >= 1 && mes <= 12 && dia >= 1 && dia <= 31) return { dia, mes };
  }
  m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?$/);
  if (m) {
    const dia = Number(m[1]), mes = Number(m[2]);
    if (mes >= 1 && mes <= 12 && dia >= 1 && dia <= 31) return { dia, mes };
  }
  return null;
}
