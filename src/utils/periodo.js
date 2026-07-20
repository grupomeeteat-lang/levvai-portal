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
