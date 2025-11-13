// Normaliza una entrada de fecha: convierte cadenas vacías o valores inválidos a null,
// y convierte valores válidos a objetos Date para que pg los maneje correctamente.
function normalizeDate(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string' && v.trim() === '') return null;
  const parsed = Date.parse(v);
  return isNaN(parsed) ? null : new Date(parsed);
}

module.exports = normalizeDate;
