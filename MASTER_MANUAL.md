# MASTER MANUAL — Smile Premium Dental SaaS
**Versão:** 2.0 Gold  
**Data:** 2026-04-14  
**Proprietário:** Ricardo Porto  
**Stack:** TanStack Start · React · TypeScript · Cloudflare Workers · D1

---

## 1. VISÃO DO PRODUTO

### O que é
Um SaaS de agendamento inteligente, começando pela vertical de **Odontologia**, construído com qualidade de produto Apple e lógica de negócio real de consultório. Não é um CRUD genérico — é um sistema especializado com:
- Conflict detection engine (zero double-bookings)
- WhatsApp automation nativa
- PDF tickets com QR code
- Dashboard financeiro em tempo real
- Expansão modular para 20+ verticais

### Cliente âncora
**Fernando Álvarez** — Smile Premium Dental, Miami-Dade, FL  
Caso de uso: substituir papel, ligações telefônicas e planilhas por um sistema elegante que os pacientes amam usar.

### Visão de escala
1 clínica → 20 clínicas → 20 verticais → plataforma SaaS B2B nacional

---

## 2. ARQUITETURA TÉCNICA

### Stack
| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TanStack Start (Router + Query) |
| Build | Vite + Cloudflare Vite Plugin |
| Backend | Cloudflare Workers (edge, serverless) |
| Banco | Cloudflare D1 (SQLite serverless) |
| ORM | Drizzle ORM |
| Animações | Framer Motion |
| Formulários | react-hook-form + Zod |
| PDF | jsPDF v4 (dynamic import) |
| QR Code | qrcode.react |
| WhatsApp Bot | Cloudflare Worker separado (worker/) |
| Deploy | Vercel (frontend) + Cloudflare Workers (backend/bot) |

### Estrutura de rotas
```
/           → Golden Voice (produto Gabriele — locução com IA)
/home       → Sales Landing Page (vender o SaaS dental ao Fernando)
/dental     → Módulo de Agendamento (pacientes agendam aqui)
/admin      → Dashboard do Fernando (gerencia tudo)
/settings   → Configurações do sistema
```

### Estrutura de arquivos críticos
```
src/
  routes/
    __root.tsx          → Shell HTML, meta tags, CSS
    index.tsx           → Golden Voice homepage
    home.tsx            → Sales page do dental SaaS
    dental.tsx          → Wrapper do agendador
    admin.tsx           → Dashboard wrapper
    settings.tsx        → Settings wrapper
  components/
    dental/
      DentalScheduler.tsx → Wizard 5 etapas de agendamento
      TicketCard.tsx      → Ticket visual + PDF download + WhatsApp share
    admin/
      AdminDashboard.tsx  → Dashboard completo do Fernando
  lib/
    dental/
      actions.ts          → Server functions (getOccupiedSlots, createAppointment)
      types.ts            → TypeScript types
    theme.ts              → ThemeCtx + getColors() (dark/light mode)
    db.ts                 → Drizzle schema + DB connection
    utils.ts              → Helpers
  hooks/
    useColorScheme.ts     → Detecta preferência do sistema (dark/light)
```

---

## 3. MÓDULO DE AGENDAMENTO (DENTAL)

### Fluxo de 5 etapas
```
Etapa 1 → Serviço
Etapa 2 → Profissional
Etapa 3 → Data & Hora
Etapa 4 → Dados do Paciente
Etapa 5 → Resumo → CONFIRMAR
           ↓
    TicketCard (PDF + WhatsApp)
    LoyaltyCard (Care Journey)
    Add to Google Calendar
```

### Serviços disponíveis
| ID | Nome | Duração | Doutores |
|----|------|---------|---------|
| checkup | Checkup & Cleaning | 45 min | Sarah, Emily, Any |
| whitening | Teeth Whitening | 90 min | Emily, Sarah, Any |
| ortho | Orthodontic Consult | 60 min | James, Any |
| implant | Implant Assessment | 45 min | Michael, Any |
| emergency | Emergency Care | 30 min | Sarah, Michael, Any |

### Doutores
| ID | Nome | Especialidade | Exp | Rating |
|----|------|--------------|-----|--------|
| sarah | Dr. Sarah Mitchell | General Dentist | 12 anos | 4.9 |
| james | Dr. James Ortega | Orthodontist | 15 anos | 4.8 |
| emily | Dr. Emily Chen | Cosmetic Specialist | 9 anos | 5.0 |
| michael | Dr. Michael Torres | Implantologist | 18 anos | 4.9 |

### Horários disponíveis
Manhã: 08:00 / 08:30 / 09:00 / 09:30 / 10:00 / 10:30 / 11:00 / 11:30  
Tarde: 14:00 / 14:30 / 15:00 / 15:30 / 16:00 / 16:30 / 17:00

### Regras de conflito
- Nenhum doutor pode ter 2 consultas no mesmo horário
- Buffer automático de 15 minutos entre consultas
- Fins de semana são bloqueados
- Datas passadas são bloqueadas

---

## 4. MÓDULO DE PDF TICKET

### Como funciona
1. Paciente confirma agendamento → `confirmedApt` é setado
2. `StepSummary` renderiza `<TicketCard appointment={confirmedApt}/>`
3. `TicketCard` mostra ticket visual e botões de ação
4. Botão "Download PDF" → `handleDownloadPDF()` → `downloadPDF(apt, dateFormatted, qrDataUrl)`
5. jsPDF gera documento A5 com:
   - Header gradient azul/índigo com nome da clínica e ID do agendamento
   - Perforated divider (linha tracejada estilo ticket aéreo)
   - 7 linhas de dados (SERVICE, DOCTOR, DATE, TIME, PATIENT, PHONE, EMAIL)
   - QR code embedido (300x300px canvas → PNG → inserido no PDF)
   - Footer com timestamp de geração
6. Arquivo salvo como `SmileDental-{Nome}-{ID}.pdf`

### QR Code no PDF
- `QRCodeCanvas` renderizado off-screen (position: absolute, left: -9999px)
- `canvas.toDataURL("image/png")` captura a imagem
- `doc.addImage(qrDataUrl, "PNG", ...)` insere no PDF

---

## 5. DASHBOARD DO FERNANDO (/admin)

### Métricas em tempo real
- Total de agendamentos hoje
- Revenue estimado do dia (baseado nos serviços confirmados)
- Novos pacientes
- Cancelamentos

### Visualizações
- Day View: timeline de todos os doutores por horário
- Week View: visão semanal agregada
- Productivity Chart: barras de eficiência por doutor
- Lista de pacientes com filtros

### Ações por agendamento
- Confirmar (Pending → Confirmed)
- Cancelar (any → Cancelled)
- Reagendar (abre novo fluxo)

---

## 6. BOTÕES DE SAIR E SUPORTE

Obrigatórios em toda interface do módulo dental:

### Botão Suporte
- Ação: `window.open("https://wa.me/13059227181", "_blank")`
- Cor: `#25D366` (WhatsApp green)
- Ícone: `MessageCircle` (lucide)
- Texto: "Suporte" ou "Falar com Suporte"
- Posição: sidebar (parte inferior) ou header

### Botão Sair
- Ação: `window.location.href = "/home"`
- Cor: ghost/secondary (border + texto, sem preenchimento)
- Ícone: `LogOut` (lucide)
- Texto: "Sair" ou "Voltar ao Início"
- Posição: sidebar (parte inferior) ou header

---

## 7. LANDING PAGE DE VENDAS (/home)

### Objetivo
Convencer o Fernando (e outros donos de clínica) a contratar o SaaS.

### Seções
1. **Nav** — logo, links, botão "Book Now"
2. **Hero** — headline impactante, subtitle, 2 CTAs, mockup do scheduler
3. **Stats** — 4 números: 20s booking, 100% WhatsApp, 4 doutores, 0 conflitos
4. **Features** — 6 cards: Smart Scheduling, WhatsApp, Admin, Conflict-Free, Status, Revenue
5. **Dashboard Preview** — screenshot mockup + checklist de features
6. **Testimonials** — Fernando, Dr. Sarah, Dr. Emily
7. **How it Works** — 3 passos: Book → Confirm → Manage
8. **Platform Vision** — 8 profissões (Dentistry LIVE, + 7 coming)
9. **Architecture Callout** — Modular SaaS engine explicado
10. **CTA** — Book Now + Admin Dashboard
11. **Footer** — links simples

---

## 8. PLANO DE EXPANSÃO — 20 VERTICAIS

### Fase 1 (Dentistry — LIVE)
- Smile Premium Dental, Miami
- Sistema completo: scheduling, PDF, WhatsApp, dashboard
- Preço target: $297/mês

### Fase 2 (Next — Aesthetics, Physiotherapy)
- Mesmo engine, nova skin
- Serviços diferentes (botox, peeling, sessions de fisio)
- Tempo de setup: 2–3 dias por vertical

### Fase 3 (Coming — Psychology, Veterinary, Beauty, Fitness, Ophthalmology)
- Multi-tenant: clinicId no banco
- White-label: cada clínica tem seu subdomínio
- Billing: Stripe + Cloudflare Workers

### Roadmap técnico para multi-tenant
```sql
-- Migration a adicionar:
ALTER TABLE appointments ADD COLUMN clinic_id TEXT NOT NULL DEFAULT 'smile-miami';
ALTER TABLE appointments ADD INDEX idx_clinic_date (clinic_id, date);
```

### KPIs de escala
| Meta | MRR | Clínicas |
|------|-----|----------|
| Fase 1 | $297 | 1 |
| Fase 2 | $2.970 | 10 |
| Fase 3 | $5.940 | 20 |
| Fase 4 | $29.700 | 100 |

---

## 9. CONTATOS E CONFIGURAÇÕES

### Clínica
- Nome: Smile Premium Dental
- Telefone: +1 (305) 922-7181
- WhatsApp: 13059227181
- Endereço: Miami-Dade, FL, USA
- URL: smilepremialdental.com

### Ambiente de desenvolvimento
```bash
bun dev          # Inicia Vite dev server
bun bot:dev      # Inicia Cloudflare Worker (bot WhatsApp)
bun build        # Build de produção
bun bot:deploy   # Deploy do worker
```

---

## 10. PADRÃO DE QUALIDADE — PRODUTO DE ELITE

Todo componente novo deve satisfazer:
- [ ] Funciona em monitor 49" ultrawide (5120x1440)
- [ ] Dark mode automático via `useColorScheme()`
- [ ] Animações com Framer Motion (não CSS transitions brutas)
- [ ] Tipografia Apple System Font
- [ ] Botões com `whileHover` + `whileTap` no Motion
- [ ] Estados de loading (spinner) e erro (AlertTriangle)
- [ ] Validação no frontend antes de chamar server functions
- [ ] Responsive mínimo: funciona em 1280px+

---

*Este documento é a fonte primária de verdade do produto. Qualquer decisão técnica, de design ou de negócio deve ser consistente com os princípios aqui definidos.*
