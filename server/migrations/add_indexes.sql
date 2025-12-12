-- ============================================================
-- MIGRATION: Adicionar índices para performance
-- ============================================================

-- Índices para tabela users
CREATE INDEX IF NOT EXISTS idx_users_openId ON users(openId);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Índices para tabela profiles
CREATE INDEX IF NOT EXISTS idx_profiles_userId ON profiles(userId);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_isStreamer ON profiles(isStreamer);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(verified);

-- Índices para tabela callsHistory
CREATE INDEX IF NOT EXISTS idx_callsHistory_streamerId ON callsHistory(streamerId);
CREATE INDEX IF NOT EXISTS idx_callsHistory_viewerId ON callsHistory(viewerId);
CREATE INDEX IF NOT EXISTS idx_callsHistory_created_at ON callsHistory(created_at);
CREATE INDEX IF NOT EXISTS idx_callsHistory_status ON callsHistory(status);

-- Índices para tabela transactions
CREATE INDEX IF NOT EXISTS idx_transactions_userId ON transactions(userId);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Índices para tabela withdrawals
CREATE INDEX IF NOT EXISTS idx_withdrawals_userId ON withdrawals(userId);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals(created_at);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);

-- Índices para tabela kycVerifications
CREATE INDEX IF NOT EXISTS idx_kycVerifications_userId ON kycVerifications(userId);
CREATE INDEX IF NOT EXISTS idx_kycVerifications_status ON kycVerifications(status);
CREATE INDEX IF NOT EXISTS idx_kycVerifications_created_at ON kycVerifications(created_at);
CREATE INDEX IF NOT EXISTS idx_kycVerifications_cpf ON kycVerifications(cpf);

-- Índices para tabela activeCalls
CREATE INDEX IF NOT EXISTS idx_activeCalls_streamerId ON activeCalls(streamerId);
CREATE INDEX IF NOT EXISTS idx_activeCalls_viewerId ON activeCalls(viewerId);
CREATE INDEX IF NOT EXISTS idx_activeCalls_status ON activeCalls(status);

-- Índices para tabela notifications
CREATE INDEX IF NOT EXISTS idx_notifications_userId ON notifications(userId);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Índices para tabela moderationLogs
CREATE INDEX IF NOT EXISTS idx_moderationLogs_userId ON moderationLogs(userId);
CREATE INDEX IF NOT EXISTS idx_moderationLogs_created_at ON moderationLogs(created_at);
CREATE INDEX IF NOT EXISTS idx_moderationLogs_action ON moderationLogs(action);

-- Índices compostos para queries comuns
CREATE INDEX IF NOT EXISTS idx_callsHistory_streamer_date ON callsHistory(streamerId, created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(userId, created_at);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_status ON withdrawals(userId, status);
CREATE INDEX IF NOT EXISTS idx_kycVerifications_user_status ON kycVerifications(userId, status);

-- Índices para busca de texto (se suportado)
-- Nota: MySQL/MariaDB suporta FULLTEXT
-- CREATE FULLTEXT INDEX idx_profiles_bio ON profiles(bio);
-- CREATE FULLTEXT INDEX idx_profiles_tags ON profiles(tags);
