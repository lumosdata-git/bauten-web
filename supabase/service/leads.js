/**
 * Serviço de leads.
 *
 * O cliente Supabase é recebido por parâmetro para manter este módulo
 * independente da configuração de ambiente e fácil de testar.
 */

const MAX_NAME_LENGTH = 120
const MAX_INTEREST_LENGTH = 120

function normalizeWhitespace(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ')
}

function normalizePhone(value) {
  return String(value ?? '').replace(/\D/g, '')
}

export function normalizeLead(input = {}) {
  return {
    name: normalizeWhitespace(input.name).slice(0, MAX_NAME_LENGTH),
    email: normalizeWhitespace(input.email).toLowerCase(),
    phone: normalizePhone(input.phone),
    interest: normalizeWhitespace(input.interest).toLowerCase().slice(0, MAX_INTEREST_LENGTH)
  }
}

export function validateLead(lead) {
  const errors = {}

  if (lead.name.length < 2) errors.name = 'Informe seu nome.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.email = 'Informe um email válido.'
  if (!/^\d{11}$/.test(lead.phone)) errors.phone = 'Informe um celular válido com DDD.'
  if (lead.interest.length < 2) errors.interest = 'Informe o interesse do contato.'

  return errors
}

/**
 * Normaliza, valida e persiste um lead usando um cliente Supabase já configurado.
 * Retorna o registro criado e lança um Error com `validationErrors` quando os dados
 * não forem válidos ou com a mensagem da API quando o insert falhar.
 */
export async function submitLead(supabase, input) {
  if (!supabase?.from) throw new Error('Cliente Supabase não configurado.')

  const lead = normalizeLead(input)
  const validationErrors = validateLead(lead)
  if (Object.keys(validationErrors).length) {
    const error = new Error('Dados do lead inválidos.')
    error.validationErrors = validationErrors
    throw error
  }

  const { error } = await supabase.from('leads').insert(lead)

  if (error) throw error
  return lead
}
