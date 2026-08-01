import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInquiryEndpoint() {
  console.log("Testing Supabase 'inquiries' table insert...");
  
  const testData = {
    name: 'Test Admin',
    company: 'Testing Corp',
    email: 'test@mannadiarhandicrafts.com',
    phone: '+91 9999999999',
    budget: 'Just inquiring',
    requirements: 'This is an automated test to verify the Enquiry Cart JSON insertion.',
    products: JSON.stringify([
      { id: '123', title: 'Test Bronze Statue', sku: 'BR-123' },
      { id: '456', title: 'Test Wood Panel', sku: 'WD-456' }
    ])
  };

  try {
    // 1. Test Insert
    const { data: insertData, error: insertError } = await supabase
      .from('inquiries')
      .insert([testData])
      .select();

    if (insertError) {
      console.error("â Œ INSERT ERROR:", insertError.message);
      return;
    }
    
    console.log("âœ… INSERT SUCCESS: Successfully inserted inquiry with products JSON.");
    const newId = insertData[0].id;

    // 2. Test Fetch
    const { data: fetchData, error: fetchError } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', newId)
      .single();

    if (fetchError) {
      console.error("â Œ FETCH ERROR:", fetchError.message);
      return;
    }

    console.log("âœ… FETCH SUCCESS: Successfully retrieved the inquiry.");
    
    // Parse the JSON
    const parsedProducts = JSON.parse(fetchData.products);
    console.log("âœ… JSON VERIFICATION: Parsed products array length:", parsedProducts.length);
    console.log(`   - Product 1: ${parsedProducts[0].title} (SKU: ${parsedProducts[0].sku})`);
    
    // 3. Cleanup (optional, but good so we don't clutter the admin)
    const { error: deleteError } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', newId);
      
    if (deleteError) {
       console.log("âš ï¸  Could not delete test data (maybe due to RLS). No big deal.");
    } else {
       console.log("âœ… CLEANUP SUCCESS: Test data removed.");
    }

    console.log("\nðŸš€ ENDPOINT VERIFICATION COMPLETE: The database is perfectly configured!");

  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

testInquiryEndpoint();
