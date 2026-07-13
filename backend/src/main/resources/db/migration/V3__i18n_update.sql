-- Update categories with Chinese names
UPDATE categories SET name = '猫咪', description = '猫咪用品大全' WHERE slug = 'cats';
UPDATE categories SET name = '狗狗', description = '爱犬优质用品' WHERE slug = 'dogs';
UPDATE categories SET name = '鸟类', description = '鸟类用品和玩具' WHERE slug = 'birds';
UPDATE categories SET name = '鱼类', description = '水族箱必备品' WHERE slug = 'fish';
UPDATE categories SET name = '小宠物', description = '仓鼠、兔子、豚鼠等' WHERE slug = 'small-pets';

-- Update products with Chinese names, descriptions, and real images
UPDATE products SET
  name = '温馨猫屋',
  description = '为您的猫咪打造的温馨小窝。采用柔软耐用的材料制成，提供温暖和舒适感，适合各种体型的猫咪。',
  images = 'https://images.unsplash.com/photo-1545249390-6b684a5c3f97?w=600'
WHERE slug = 'cozy-cat-house';

UPDATE products SET
  name = '猫抓板',
  description = '天然剑麻猫抓板，让猫咪尽情磨爪，保护您的家具。',
  images = 'https://images.unsplash.com/photo-1595348024922-235ff1ab7d35?w=600'
WHERE slug = 'cat-scratching-post';

UPDATE products SET
  name = '狗狗牵引绳',
  description = '舒适安全的牵引绳，适合日常散步。可调节绑带，完美贴合。',
  images = 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=600'
WHERE slug = 'dog-walking-harness';

UPDATE products SET
  name = '高级狗窝',
  description = '记忆海绵狗窝，提供极致舒适体验。可机洗外套，方便清洁。',
  images = 'https://images.unsplash.com/photo-1555008250-bb26b32a6df3?w=600'
WHERE slug = 'premium-dog-bed';

UPDATE products SET
  name = '豪华鸟笼',
  description = '宽敞的鸟笼，配有多个栖木和喂食器。',
  images = 'https://images.unsplash.com/photo-1480044965905-02098d419e96?w=600'
WHERE slug = 'bird-cage-deluxe';

UPDATE products SET
  name = '水族箱过滤系统',
  description = '先进的三级过滤系统，让水质清澈透明。',
  images = 'https://images.unsplash.com/photo-1519121785383-3229633bb75b?w=600'
WHERE slug = 'aquarium-filter-system';

UPDATE products SET
  name = '仓鼠跑轮',
  description = '静音稳定的运动跑轮，适合小宠物使用。防滑表面设计。',
  images = 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600'
WHERE slug = 'hamster-exercise-wheel';

UPDATE products SET
  name = '猫咪互动玩具套装',
  description = '一套趣味十足的玩具，让猫咪保持活力和快乐。',
  images = 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600'
WHERE slug = 'interactive-cat-toy-set';

-- Update blog posts with Chinese content and images
UPDATE blog_posts SET
  title = '如何为爱宠选择合适的窝',
  excerpt = '为您的毛茸茸朋友找到最舒适小窝的全面指南。',
  content = '为您的爱宠选择合适的窝对它们的健康和幸福至关重要。需要考虑宠物的大小、睡眠习惯和材质偏好等因素。\n\n对于猫咪来说，封闭式的窝能提供安全感。狗狗则更喜欢有支撑性的慢回弹窝，尤其是老年犬。\n\n购买前请务必测量您的爱宠，选择可机洗的窝套以便日常清洁维护。',
  cover_image = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800'
WHERE slug = 'how-to-choose-pet-bed';

UPDATE blog_posts SET
  title = '2026年十大宠物玩具推荐',
  excerpt = '用今年市场上最好的玩具让您的爱宠保持快乐。',
  content = '我们根据耐用性、互动性和客户评价，为您精选了2026年最佳宠物玩具。\n\n能够激发宠物智力的互动玩具越来越受欢迎。益智喂食器、自动激光逗猫棒和零食分发球位列榜首。\n\n安全至上 - 请始终选择适合您宠物体型和咀嚼习惯的玩具。',
  cover_image = 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800'
WHERE slug = 'best-pet-toys-2026';

UPDATE blog_posts SET
  title = '猫咪营养指南',
  excerpt = '了解您的猫咪健康快乐成长所需的营养。',
  content = '合理的营养是猫咪健康的基础。猫咪是专性肉食动物，这意味着它们的饮食中需要肉类。\n\n请选择高蛋白、低碳水化合物的食物。湿粮有助于维持尿道健康并提供水分。\n\n始终提供新鲜饮用水，在改变饮食习惯前请咨询兽医。',
  cover_image = 'https://images.unsplash.com/photo-1545249390-6b684a5c3f97?w=800'
WHERE slug = 'nutrition-tips-for-cats';
