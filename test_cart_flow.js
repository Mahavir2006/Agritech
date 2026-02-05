const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
try {
    const envPath = path.resolve(__dirname, '.env');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} catch (e) {
    console.log('Could not load .env file, relying on process.env');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCartFlow() {
    console.log('--- Starting Cart Flow Test ---');

    // 1. Get a test user
    const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, email, name')
        .limit(1);

    if (userError || !users || users.length === 0) {
        console.error('Failed to get test user:', userError);
        return;
    }

    const testUser = users[0];
    console.log(`Using test user: ${testUser.name} (ID: ${testUser.id})`);

    // 2. Get a test product
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name')
        .limit(1);

    if (prodError || !products || products.length === 0) {
        console.error('Failed to get test product:', prodError);
        return;
    }

    const testProduct = products[0];
    console.log(`Using test product: ${testProduct.name} (ID: ${testProduct.id})`);

    // 3. Check existing cart
    console.log('Checking existing cart...');
    const { data: existingCart, error: fetchError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', testUser.id)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching cart:', fetchError);
        // Proceeding to try insert anyway to see error
    } else if (!existingCart) {
        console.log('No existing cart found.');
    } else {
        console.log('Existing cart found:', existingCart);
    }

    // 4. Try to Insert/Update
    const newItem = { product_id: testProduct.id, quantity: 1 };

    if (existingCart && existingCart.items) {
        console.log('Attempting UPDATE...');
        const updatedItems = [...existingCart.items, newItem];
        const { data, error } = await supabase
            .from('cart')
            .update({ items: updatedItems })
            .eq('user_id', testUser.id)
            .select();

        if (error) {
            console.error('UPDATE FAILED:', error);
        } else {
            console.log('UPDATE SUCCESS:', data);
        }
    } else {
        console.log('Attempting INSERT...');
        const { data, error } = await supabase
            .from('cart')
            .insert({
                user_id: testUser.id,
                items: [newItem]
            })
            .select();

        if (error) {
            console.error('INSERT FAILED:', error);
        } else {
            console.log('INSERT SUCCESS:', data);
        }
    }
}

testCartFlow();
