INSERT INTO users (email, password, name, role) VALUES
('admin@cozypaws.com', '$2a$10$0sBKBPpN4gxHQhZu7G8DNOLujC1VL6H0oT44AGu17S.9wK.YnRvG.', 'Admin', 'ADMIN')
ON DUPLICATE KEY UPDATE role = 'ADMIN';
