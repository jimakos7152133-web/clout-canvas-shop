-- Update product images with correct public paths
UPDATE products SET images = ARRAY['/images/product-hoodie.jpg'] WHERE slug = 'premium-hoodie';
UPDATE products SET images = ARRAY['/images/product-tshirt-white.jpg'] WHERE slug = 'classic-tshirt';
UPDATE products SET images = ARRAY['/images/product-bomber-black.jpg'] WHERE slug = 'bomber-jacket';
UPDATE products SET images = ARRAY['/images/product-polo.jpg'] WHERE slug = 'business-polo';