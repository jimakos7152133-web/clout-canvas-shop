import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Product = Database['public']['Tables']['products']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
  });
};

export const useProducts = (categorySlug?: string) => {
  return useQuery({
    queryKey: ['products', categorySlug],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (categorySlug) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();
        
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as (Product & { categories: Category | null })[];
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data as Product & { categories: Category | null };
    },
  });
};

export const useCartItems = (sessionId: string) => {
  return useQuery({
    queryKey: ['cart', sessionId],
    queryFn: async () => {
      // Security: Validate session ID before querying
      if (!sessionId || sessionId.length < 10) {
        throw new Error('Invalid session ID');
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            name,
            slug,
            images,
            base_price
          )
        `)
        .eq('session_id', sessionId); // Always filter by session_id for security
      
      if (error) throw error;
      return data as (CartItem & { products: Product | null })[];
    },
    enabled: !!sessionId && sessionId.length > 10, // Only run query with valid session
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      productId,
      sessionId,
      quantity,
      selectedColor,
      selectedSize,
      customOptions,
      price,
    }: {
      productId: string;
      sessionId: string;
      quantity: number;
      selectedColor?: string;
      selectedSize?: string;
      customOptions?: any;
      price: number;
    }) => {
      // Security: Validate all inputs
      if (!productId || !sessionId || !price || quantity < 1) {
        throw new Error('Invalid input parameters');
      }

      if (sessionId.length < 10) {
        throw new Error('Invalid session ID format');
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          product_id: productId,
          session_id: sessionId, // Secured by RLS and validation
          quantity,
          selected_color: selectedColor,
          selected_size: selectedSize,
          custom_options: customOptions,
          price,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.sessionId] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      id,
      quantity,
      sessionId,
    }: {
      id: string;
      quantity: number;
      sessionId: string;
    }) => {
      // Security: Validate inputs and ensure session ownership
      if (!id || !sessionId || quantity < 1) {
        throw new Error('Invalid update parameters');
      }

      // Double-check: Update only items that belong to this session
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .eq('session_id', sessionId) // Ensure session ownership
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.sessionId] });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, sessionId }: { id: string; sessionId: string }) => {
      // Security: Validate inputs and ensure session ownership
      if (!id || !sessionId) {
        throw new Error('Invalid remove parameters');
      }

      // Double-check: Delete only items that belong to this session
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('session_id', sessionId); // Ensure session ownership
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.sessionId] });
    },
  });
};