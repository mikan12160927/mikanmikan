const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async function() {
    // 1. URLパラメータから ID を取得
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('loading').innerHTML = "❌ データが見つかりません。";
        return;
    }

    // 2. Supabase からその ID のデータ 1 件だけを取得
    const { data, error } = await sb
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        document.getElementById('loading').innerHTML = "🚨 データの取得に失敗しました。";
        return;
    }

    // 3. 画面に反映
    document.getElementById('det-product').innerText = data.product_name;
    document.getElementById('det-store').innerText = data.store_name;
    
    const date = new Date(data.date_time);
    document.getElementById('det-date').innerText = date.toLocaleString('ja-JP');

    // 4. GoogleマップのURLを作成（APIキー不要の検索モード）
    const query = encodeURIComponent(data.store_name);
    const mapUrl = `https://www.google.com/maps?output=embed&q=${query}`;
    document.getElementById('map-frame').src = mapUrl;

    // 5. 表示を切り替え
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
});
