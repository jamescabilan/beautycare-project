-- Insert sample products into the products table
-- These match the products shown in your BeautyCare app

INSERT INTO public.products (name, category, price, oprice, stock, emoji, badge, rating, description) VALUES
('Rose Glow Vitamin C Serum', 'Skincare', 899, 1200, 50, '🧴', 'Sale', 4.8, 'Brightening Vitamin C serum for radiant skin'),
('Hydra Velvet Lip Gloss', 'Makeup', 350, 350, 100, '💋', 'New', 4.6, 'Hydrating glossy lip color with velvet finish'),
('Silk Repair Hair Mask', 'Haircare', 650, 650, 75, '💆', 'Bestseller', 4.9, 'Deep conditioning hair mask with silk proteins'),
('Glow Mist Setting Spray', 'Skincare', 520, 520, 60, '✨', '', 4.5, 'Long-lasting makeup setting spray with glow'),
('Velvet Matte Foundation', 'Makeup', 1100, 1400, 45, '🎨', 'Sale', 4.7, 'Full coverage matte foundation for all skin tones'),
('Lavender Body Butter', 'Body Care', 480, 480, 80, '🫧', '', 4.4, 'Luxurious body butter with lavender essence'),
('Petal Bloom Eau de Parfum', 'Fragrance', 1850, 1850, 30, '🌸', 'New', 4.9, 'Floral fragrance with long-lasting scent'),
('Pro Blending Brush Set', 'Tools & Brushes', 750, 750, 40, '🖌', '', 4.6, 'Professional makeup brush set for perfect blending'),
('Niacinamide Pore Toner', 'Skincare', 420, 420, 90, '💧', '', 4.5, 'Pore-minimizing toner with niacinamide'),
('Glossy Brow Gel', 'Makeup', 280, 280, 120, '🪮', '', 4.3, 'Lightweight brow gel for perfect definition');
