-- Categories
INSERT INTO categories (name, slug, description) VALUES
('Cats', 'cats', 'Everything for your feline friends'),
('Dogs', 'dogs', 'Premium products for your canine companions'),
('Birds', 'birds', 'Supplies and toys for your feathered friends'),
('Fish', 'fish', 'Aquarium essentials and decorations'),
('Small Pets', 'small-pets', 'For hamsters, rabbits, guinea pigs and more');

-- Products
INSERT INTO products (name, slug, description, price, images, stock, category_id, is_featured, rating, review_count) VALUES
('Cozy Cat House', 'cozy-cat-house', 'A premium cozy house for your feline friend. Made with soft, durable materials that provide warmth and comfort.', 49.99, '', 15, 1, TRUE, 4.8, 128),
('Cat Scratching Post', 'cat-scratching-post', 'Natural sisal scratching post to keep your cat entertained and your furniture safe.', 34.99, '', 20, 1, FALSE, 4.5, 67),
('Dog Walking Harness', 'dog-walking-harness', 'Comfortable and secure harness for daily walks. Adjustable straps for a perfect fit.', 39.99, '', 23, 2, TRUE, 4.6, 89),
('Premium Dog Bed', 'premium-dog-bed', 'Orthopedic memory foam dog bed for ultimate comfort. Machine washable cover.', 79.99, '', 10, 2, FALSE, 4.7, 45),
('Bird Cage Deluxe', 'bird-cage-deluxe', 'Spacious bird cage with multiple perches and feeding stations.', 129.99, '', 8, 3, FALSE, 4.4, 23),
('Aquarium Filter System', 'aquarium-filter-system', 'Advanced 3-stage filtration system for crystal clear water.', 54.99, '', 12, 4, FALSE, 4.3, 34),
('Hamster Exercise Wheel', 'hamster-exercise-wheel', 'Quiet, stable exercise wheel for small pets. Anti-slip surface.', 19.99, '', 30, 5, FALSE, 4.2, 56),
('Interactive Cat Toy Set', 'interactive-cat-toy-set', 'A set of engaging toys to keep your cat active and stimulated.', 24.99, '', 25, 1, FALSE, 4.6, 92);

-- Blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, cover_image, author, published) VALUES
('How to Choose the Perfect Bed for Your Pet', 'how-to-choose-pet-bed',
'Choosing the right bed for your pet is essential for their health and happiness. Consider factors like size, sleeping style, and material preferences.

For cats, enclosed beds provide a sense of security. Dogs often prefer orthopedic beds that support their joints, especially for older pets.

Always measure your pet before purchasing and look for machine-washable covers for easy maintenance.',
'A comprehensive guide to finding the most comfortable bed for your furry friend.',
'',
'CozyPaws Team', TRUE),

('Top 10 Pet Toys of 2026', 'best-pet-toys-2026',
'We have rounded up the best pet toys of 2026 based on durability, engagement, and customer reviews.

Interactive toys that stimulate your pet mentally are becoming increasingly popular. Puzzle feeders, automated laser toys, and treat-dispensing balls top our list.

Safety is paramount - always choose toys appropriate for your pet size and chewing habits.',
'Keep your pets entertained with the best toys on the market this year.',
'',
'CozyPaws Team', TRUE),

('Essential Nutrition Tips for Your Cat', 'nutrition-tips-for-cats',
'Proper nutrition is the foundation of your cat health. Cats are obligate carnivores, meaning they require meat in their diet.

Look for high-protein, low-carbohydrate foods. Wet food can help maintain urinary tract health and provide hydration.

Always provide fresh water and consult your veterinarian before making significant dietary changes.',
'Learn what your cat needs to stay healthy and happy.',
'',
'CozyPaws Team', TRUE);
