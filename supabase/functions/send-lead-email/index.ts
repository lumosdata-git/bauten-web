import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? ''
const commercialEmail = Deno.env.get('COMMERCIAL_EMAIL') ?? 'comercial01@bauten.cc'
const senderEmail = Deno.env.get('SENDER_EMAIL') ?? 'Bauten <onboarding@resend.dev>'

const adminClient = createClient(supabaseUrl, serviceRoleKey)

function normalizeWhitespace(value: unknown) {
  return String(value ?? '').trim().replace(/\s+/g, ' ')
}

function normalizeLead(input: Record<string, unknown>) {
  return {
    name: normalizeWhitespace(input.name).slice(0, 120),
    email: normalizeWhitespace(input.email).toLowerCase(),
    phone: String(input.phone ?? '').replace(/\D/g, '').slice(0, 11),
    interest: normalizeWhitespace(input.interest).toLowerCase().slice(0, 120)
  }
}

function validateLead(lead: ReturnType<typeof normalizeLead>) {
  return lead.name.length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) &&
    /^\d{11}$/.test(lead.phone) &&
    lead.interest.length >= 2
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Método não permitido.' }, 405)
  if (!supabaseUrl || !serviceRoleKey || !resendApiKey) return json({ error: 'Serviço de email não configurado.' }, 500)

  try {
    const lead = normalizeLead(await request.json())
    if (!validateLead(lead)) return json({ error: 'Dados do lead inválidos.' }, 400)

    const { error: insertError } = await adminClient.from('leads').insert(lead)
    if (insertError) {
      console.error('Erro ao salvar lead:', insertError)
      return json({ error: 'Não foi possível salvar o contato.' }, 500)
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [commercialEmail],
        reply_to: lead.email,
        subject: `Novo contato pelo site Bauten — ${lead.interest}`,
        text: `Nome: ${lead.name}\nEmail: ${lead.email}\nCelular: ${lead.phone}\nInteresse: ${lead.interest}`
      })
    })

    if (!emailResponse.ok) {
      console.error('Erro ao enviar email:', await emailResponse.text())
      return json({ error: 'Lead salvo, mas o email não pôde ser enviado.' }, 502)
    }

    return json({ success: true })
  } catch (error) {
    console.error('Erro inesperado:', error)
    return json({ error: 'Não foi possível processar o contato.' }, 500)
  }
})
