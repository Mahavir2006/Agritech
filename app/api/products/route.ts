import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('seller_id');
    const category = searchParams.get('category');

    let query = supabase
      .from('products')
      .select(`
        *,
        users!products_seller_id_fkey (
          name,
          phone_number
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (sellerId) {
      query = query.eq('seller_id', sellerId);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Products fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    // SECURITY: Wholesaler Pricing Visibility Logic
    const userRole = request.headers.get('x-user-role') || 'buyer';
    const isWholesaler = userRole === 'wholesaler' || userRole === 'farmer'; // Farmers also see it

    const transformedProducts = products?.map(product => ({
      ...product,
      seller_name: product.users?.name,
      seller_phone: product.users?.phone_number,
      photos: product.photos || [],
      // HIDE bulk pricing if not wholesaler/farmer
      price_multiple: isWholesaler ? product.price_multiple : null,
      min_bulk_quantity: isWholesaler ? product.min_bulk_quantity : null
    })) || [];

    // Debug logging (Careful not to log filtered data in prod)
    // console.log(`Serving products to role: ${userRole}. Bulk info included: ${isWholesaler}`);

    return NextResponse.json({
      products: transformedProducts
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();

    const { name, category, quantity, seller_id, price_single, price_multiple, min_bulk_quantity, location, description } = productData;

    if (!name || !category || !quantity || !seller_id || !price_single) {
      return NextResponse.json(
        { error: 'Name, category, quantity, seller_id, and price_single are required' },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        category,
        quantity,
        seller_id,
        price_single,
        price_multiple,
        min_bulk_quantity,
        location,
        description,
        status: 'active',
        photos: []
      })
      .select()
      .single();

    if (error) {
      console.error('Product creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Products POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}