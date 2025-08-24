-- Fix critical security vulnerability: Restrict orders and order_items access
-- Orders contain sensitive PII (emails, addresses) and must be protected

-- First, check current policies on orders table
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Users can view their orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert orders" ON public.orders;

-- Also fix order_items table policies  
DROP POLICY IF EXISTS "Order items are viewable with orders" ON public.order_items;

-- Re-enable RLS to ensure it's properly configured
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create secure policies for orders table
-- Orders contain sensitive PII and must be restricted to the customer who placed them

-- Policy 1: View orders - customers can only see their own orders
-- Support both session-based (guests) and user-based (authenticated) access
CREATE POLICY "customers_view_own_orders" 
ON public.orders 
FOR SELECT 
USING (
  -- Allow access if session matches (guest orders)
  session_id = current_setting('app.current_session_id', true)
  OR
  -- Allow access if user is authenticated and owns the order
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- Allow access by email verification (for order lookup)
  email = current_setting('app.customer_email', true)
);

-- Policy 2: Insert orders - customers can only create orders for themselves
CREATE POLICY "customers_create_own_orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- For guest orders, session must match
  (session_id = current_setting('app.current_session_id', true) AND user_id IS NULL)
  OR
  -- For authenticated orders, user must match
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- Policy 3: No updates or deletes - orders should be immutable after creation
-- (Orders can only be cancelled via status updates by admin functions)

-- Create secure policies for order_items table
-- Order items should only be visible with their parent orders

CREATE POLICY "customers_view_own_order_items" 
ON public.order_items 
FOR SELECT 
USING (
  -- Check if the parent order is accessible to the current user
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.session_id = current_setting('app.current_session_id', true)
      OR (auth.uid() IS NOT NULL AND orders.user_id = auth.uid())
      OR orders.email = current_setting('app.customer_email', true)
    )
  )
);

-- Order items should only be created during order creation process
CREATE POLICY "order_items_insert_with_order" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  -- Verify the parent order exists and belongs to the current user/session
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.session_id = current_setting('app.current_session_id', true)
      OR (auth.uid() IS NOT NULL AND orders.user_id = auth.uid())
    )
  )
);

-- Add documentation comments
COMMENT ON TABLE public.orders IS 'Security: Contains sensitive PII (email, addresses). Access restricted by session_id, user_id, or email verification.';
COMMENT ON TABLE public.order_items IS 'Security: Access controlled through parent orders table policies.';