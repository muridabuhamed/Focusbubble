// Supabase Connection Verification Script
// Run this in your browser console to verify connection

console.log('🔍 SUPABASE CONNECTION VERIFICATION');
console.log('=====================================');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing');

// Check if Supabase client is initialized
if (window.supabase) {
  console.log('✅ Supabase client found');
  console.log('🔗 Supabase URL:', window.supabase.supabaseUrl);
  console.log('🔑 Anon Key (first 20 chars):', window.supabase.supabaseKey?.substring(0, 20) + '...');
} else {
  console.log('❌ Supabase client not found');
}

// Test connection
async function testConnection() {
  try {
    if (!window.supabase) {
      console.log('❌ Cannot test - Supabase client not available');
      return;
    }

    console.log('\n🧪 Testing Database Connection...');
    const { data, error } = await window.supabase
      .from('auth.users')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Connection test failed:', error.message);
    } else {
      console.log('✅ Database connection successful');
      console.log('📊 User count:', data);
    }
  } catch (err) {
    console.log('❌ Connection test error:', err.message);
  }
}

// Run tests
testConnection();

console.log('\n📋 VERIFICATION CHECKLIST:');
console.log('1. Check Supabase Dashboard → Settings → API');
console.log('2. Verify Project URL matches your .env.local');
console.log('3. Verify anon/public key matches your .env.local');
console.log('4. Check Authentication → Settings → Site URL');
console.log('5. Ensure Authentication → Providers → Google is configured');