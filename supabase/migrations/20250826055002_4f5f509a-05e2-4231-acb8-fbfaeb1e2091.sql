-- Update product images with the generated images
UPDATE products SET images = ARRAY['/src/assets/product-hoodie.jpg'] WHERE slug = 'premium-hoodie';
UPDATE products SET images = ARRAY['/src/assets/product-tshirt-white.jpg'] WHERE slug = 'classic-tshirt';
UPDATE products SET images = ARRAY['/src/assets/product-bomber-black.jpg'] WHERE slug = 'bomber-jacket';
UPDATE products SET images = ARRAY['/src/assets/product-polo.jpg'] WHERE slug = 'business-polo';