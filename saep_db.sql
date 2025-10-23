-- ========================================
-- 1. TABELA GENDERS
-- ========================================
INSERT INTO genders (id, name, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Masculino', '2024-01-01 10:00:00'),
('550e8400-e29b-41d4-a716-446655440002', 'Feminino', '2024-01-01 10:00:00'),
('550e8400-e29b-41d4-a716-446655440003', 'Outro', '2024-01-01 10:00:00'),
('550e8400-e29b-41d4-a716-446655440004', 'Prefiro não informar', '2024-01-01 10:00:00');

-- ========================================
-- 2. TABELA ROLES
-- ========================================
INSERT INTO roles (id, name, description, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Administrador', 'Administrador do sistema com acesso total', '2024-01-01 10:00:00'),
('660e8400-e29b-41d4-a716-446655440002', 'Gerente', 'Gerente de depósito com acesso operacional', '2024-01-01 10:00:00'),
('660e8400-e29b-41d4-a716-446655440003', 'Funcionário', 'Funcionário regular com acesso limitado', '2024-01-01 10:00:00'),
('660e8400-e29b-41d4-a716-446655440004', 'Operador', 'Operador com acesso operacional básico', '2024-01-01 10:00:00');

-- ========================================
-- 3. TABELA CATEGORIES - CATEGORIAS DE FERRAMENTAS
-- ========================================
INSERT INTO categories (id, name, description, active, created_at, updated_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Ferramentas Manuais', 'Martelos, alicates, chaves e ferramentas de mão', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('770e8400-e29b-41d4-a716-446655440002', 'Ferramentas Elétricas', 'Furadeiras, serras elétricas e equipamentos elétricos', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('770e8400-e29b-41d4-a716-446655440003', 'Ferramentas de Medição', 'Trenas, paquímetros, níveis e instrumentos de medição', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('770e8400-e29b-41d4-a716-446655440004', 'Ferramentas de Corte', 'Serras, tesouras, estiletes e ferramentas de corte', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('770e8400-e29b-41d4-a716-446655440005', 'Ferramentas de Fixação', 'Parafusos, porcas, buchas e elementos de fixação', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('770e8400-e29b-41d4-a716-446655440006', 'Equipamentos de Segurança', 'EPIs e equipamentos de proteção individual', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('770e8400-e29b-41d4-a716-446655440007', 'Ferramentas Pneumáticas', 'Ferramentas a ar comprimido', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('770e8400-e29b-41d4-a716-446655440008', 'Acessórios e Consumíveis', 'Brocas, discos, lixas e materiais de consumo', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00');

-- ========================================
-- 4. TABELA WAREHOUSES
-- ========================================
INSERT INTO warehouses (id, name, description, active, created_at, updated_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'São Paulo - Centro de Distribuição', 'Armazém principal em São Paulo', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('880e8400-e29b-41d4-a716-446655440002', 'Rio de Janeiro - Filial', 'Armazém regional no Rio de Janeiro', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('880e8400-e29b-41d4-a716-446655440003', 'Belo Horizonte - Regional', 'Armazém regional em Minas Gerais', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('880e8400-e29b-41d4-a716-446655440004', 'Porto Alegre - Sul', 'Armazém da região sul', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('880e8400-e29b-41d4-a716-446655440005', 'Curitiba - Depósito', 'Depósito auxiliar no Paraná', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00');

-- ========================================
-- 5. TABELA USERS
-- ========================================
-- Nota: Senha padrão é "password123" (hash bcrypt)
INSERT INTO users (id, name, email, password_hash, gender_id, role_id, active, created_at, updated_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Administrador Sistema', 'admin@ferramentas.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2QJb0bVG.O', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('990e8400-e29b-41d4-a716-446655440002', 'Roberto Silva', 'roberto.silva@ferramentas.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2QJb0bVG.O', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('990e8400-e29b-41d4-a716-446655440003', 'Fernanda Costa', 'fernanda.costa@ferramentas.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2QJb0bVG.O', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('990e8400-e29b-41d4-a716-446655440004', 'Paulo Henrique', 'paulo.henrique@ferramentas.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2QJb0bVG.O', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('990e8400-e29b-41d4-a716-446655440005', 'Juliana Alves', 'juliana.alves@ferramentas.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2QJb0bVG.O', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00');

-- ========================================
-- 6. TABELA PRODUCTS - FERRAMENTAS E EQUIPAMENTOS
-- ========================================
INSERT INTO products (id, name, category_id, warehouse_id, min_quantity, unit_cost, observation, active, created_at, updated_at) VALUES
-- Ferramentas Manuais
('aa0e8400-e29b-41d4-a716-446655440001', 'Martelo Unha 25mm', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 30.00, 28.50, 'Martelo de unha com cabo de madeira', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440002', 'Martelo Borracha', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 25.00, 22.90, 'Martelo de borracha preta', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440003', 'Alicate Universal 8"', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 40.00, 35.00, 'Alicate universal profissional 8 polegadas', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440004', 'Alicate de Corte 6"', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 35.00, 32.50, 'Alicate de corte diagonal 6 polegadas', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440005', 'Chave de Fenda 1/4"', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 50.00, 12.50, 'Chave de fenda ponta chata 1/4"', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440006', 'Chave Phillips 1/4"', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 50.00, 12.50, 'Chave Phillips cruciforme 1/4"', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440007', 'Jogo de Chaves Allen', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 20.00, 45.00, 'Jogo com 9 chaves Allen hexagonais', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440008', 'Chave Inglesa 12"', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 15.00, 58.90, 'Chave inglesa ajustável 12 polegadas', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),

-- Ferramentas Elétricas
('aa0e8400-e29b-41d4-a716-446655440009', 'Furadeira de Impacto 550W', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 8.00, 289.90, 'Furadeira de impacto elétrica 550W com maleta', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440010', 'Parafusadeira sem Fio 12V', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 10.00, 245.00, 'Parafusadeira/furadeira sem fio com bateria', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440011', 'Serra Circular 1400W', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440003', 5.00, 389.90, 'Serra circular profissional 1400W', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440012', 'Esmerilhadeira Angular 4.1/2"', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440004', 6.00, 199.90, 'Esmerilhadeira angular 820W', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440013', 'Lixadeira Orbital 220W', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 7.00, 179.90, 'Lixadeira orbital com coletor de pó', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440014', 'Serra Tico-Tico 450W', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 5.00, 189.90, 'Serra tico-tico 450W com regulagem', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),

-- Ferramentas de Medição
('aa0e8400-e29b-41d4-a716-446655440015', 'Trena 5m', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 60.00, 18.90, 'Trena emborrachada 5 metros', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440016', 'Trena 8m Profissional', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 40.00, 32.50, 'Trena profissional 8 metros com trava', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440017', 'Paquímetro Digital 150mm', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002', 12.00, 89.90, 'Paquímetro digital aço inox 150mm', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440018', 'Nível Bolha 40cm', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004', 25.00, 24.90, 'Nível de bolha alumínio 40cm', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440019', 'Esquadro Metálico 12"', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 30.00, 35.00, 'Esquadro em aço carbono 12 polegadas', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440020', 'Transferidor 180°', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002', 35.00, 15.50, 'Transferidor de precisão 180 graus', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),

-- Ferramentas de Corte
('aa0e8400-e29b-41d4-a716-446655440021', 'Serrote 18"', '770e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440003', 20.00, 42.50, 'Serrote para madeira 18 polegadas', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440022', 'Arco de Serra Manual', '770e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440001', 35.00, 28.90, 'Arco de serra manual ajustável', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440023', 'Estilete Retrátil', '770e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440002', 80.00, 8.50, 'Estilete retrátil com lâmina de 18mm', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440024', 'Tesoura para Chapa', '770e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 15.00, 65.00, 'Tesoura profissional para corte de chapa', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),

-- Ferramentas de Fixação
('aa0e8400-e29b-41d4-a716-446655440025', 'Parafuso Philips 3x10mm Cx 500un', '770e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440001', 100.00, 15.90, 'Caixa com 500 parafusos philips', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440026', 'Porca Sextavada M6 Cx 200un', '770e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440002', 80.00, 12.50, 'Caixa com 200 porcas sextavadas', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440027', 'Bucha Nylon S6 Cx 100un', '770e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440003', 90.00, 8.90, 'Caixa com 100 buchas de nylon S6', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440028', 'Arruela Lisa M8 Cx 300un', '770e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440004', 70.00, 10.50, 'Caixa com 300 arruelas lisas M8', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),

-- Equipamentos de Segurança
('aa0e8400-e29b-41d4-a716-446655440029', 'Capacete de Segurança Amarelo', '770e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440001', 40.00, 28.50, 'Capacete classe A com carneira', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440030', 'Óculos de Proteção Incolor', '770e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440002', 100.00, 12.90, 'Óculos de proteção com lente incolor', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440031', 'Luvas de Vaqueta', '770e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440003', 120.00, 15.50, 'Par de luvas de vaqueta reforçada', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('aa0e8400-e29b-41d4-a716-446655440032', 'Botina de Segurança', '770e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440004', 50.00, 89.90, 'Botina com biqueira de aço', TRUE, '2024-01-01 10:00:00', '2024-01-01 10:00:00');

-- ========================================
-- 7. TABELA ENTRIES (Entradas de Estoque)
-- ========================================
INSERT INTO entries (id, product_id, entry_date, quantity, observation, created_at, updated_at) VALUES
-- Entradas de Ferramentas Manuais
('bb0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '2024-01-15', 50.00, 'Compra fornecedor nacional', '2024-01-15 09:00:00', '2024-01-15 09:00:00'),
('bb0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', '2024-01-16', 40.00, 'Reposição de estoque', '2024-01-16 10:30:00', '2024-01-16 10:30:00'),
('bb0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', '2024-01-17', 80.00, 'Compra em lote - promoção', '2024-01-17 14:20:00', '2024-01-17 14:20:00'),
('bb0e8400-e29b-41d4-a716-446655440004', 'aa0e8400-e29b-41d4-a716-446655440004', '2024-01-18', 70.00, 'Estoque inicial filial', '2024-01-18 11:45:00', '2024-01-18 11:45:00'),
('bb0e8400-e29b-41d4-a716-446655440005', 'aa0e8400-e29b-41d4-a716-446655440005', '2024-01-20', 100.00, 'Pedido mensal', '2024-01-20 08:00:00', '2024-01-20 08:00:00'),
('bb0e8400-e29b-41d4-a716-446655440006', 'aa0e8400-e29b-41d4-a716-446655440006', '2024-01-21', 100.00, 'Pedido mensal', '2024-01-21 15:30:00', '2024-01-21 15:30:00'),
('bb0e8400-e29b-41d4-a716-446655440007', 'aa0e8400-e29b-41d4-a716-446655440007', '2024-01-22', 40.00, 'Kit profissional', '2024-01-22 12:15:00', '2024-01-22 12:15:00'),
('bb0e8400-e29b-41d4-a716-446655440008', 'aa0e8400-e29b-41d4-a716-446655440008', '2024-01-23', 30.00, 'Compra especial', '2024-01-23 16:00:00', '2024-01-23 16:00:00');

-- ========================================
-- 8. EXITS TABLE (Stock Exit Movements)
-- ========================================
INSERT INTO exits (id, product_id, exit_date, quantity, observation, created_at, updated_at) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '2024-02-01', 2.00, 'Uso administrativo', '2024-02-01 10:00:00', '2024-02-01 10:00:00'),
('cc0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', '2024-02-02', 15.00, 'Distribuição para equipes', '2024-02-02 14:30:00', '2024-02-02 14:30:00'),
('cc0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', '2024-02-03', 8.00, 'Setup de workstations', '2024-02-03 09:15:00', '2024-02-03 09:15:00'),
-- Exits for Materiais de Escritório
