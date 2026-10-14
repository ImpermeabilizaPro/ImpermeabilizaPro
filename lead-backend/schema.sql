CREATE TABLE IF NOT EXISTS leads (
 id TEXT PRIMARY KEY,
 created_at TEXT NOT NULL,
 tipo TEXT NOT NULL,
 area TEXT,
 local TEXT NOT NULL,
 estado TEXT,
 acesso TEXT,
 prazo TEXT,
 momento TEXT,
 base TEXT,
 descricao TEXT,
 nome TEXT,
 telefone TEXT,
 email TEXT,
 consent_at TEXT NOT NULL,
 email_status TEXT NOT NULL DEFAULT 'pending'
);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email_status ON leads(email_status);
