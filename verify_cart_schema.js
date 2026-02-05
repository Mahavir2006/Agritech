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

async function checkCartSchema() {
    console.log('Checking cart table schema...');

    // Try to select the 'items' column from 'cart'
    const { data, error } = await supabase
        .from('cart')
        .select('items')
        .limit(1);

    if (error) {
        console.error('Error selecting items column:', error);
        if (error.message.includes('does not exist')) {
            console.log('CONCLUSION: The "items" column likely does not exist. Schema update required.');
        }
    } else {
        console.log('Success! "items" column exists.');
        console.log('Sample data:', data);
    }
}

checkCartSchema();
