// 【重要】ここに Supabase の情報を設定してください！
// Supabaseダッシュボードから取得した Project URL と Anon Public Key を ' 'で囲んで貼り付けてください。
const SUPABASE_URL = https://xoefqmgwjpauuebjhfgp.supabase.co　; 
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U; 

// Supabaseクライアントの初期化
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const postForm = document.getElementById('postForm');
const messageDiv = document.getElementById('message');

// フォームが送信されたときの処理
postForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // フォームの通常の送信をキャンセル
    
    // フォームからデータを取得
    const formData = new FormData(postForm);
    const dataToInsert = {
        // HTMLの name 属性と Supabase のカラム名が一致している必要があります
        product_name: formData.get('product_name'),
        store_name: formData.get('store_name'),
        address: formData.get('address'), // 住所を直接保存
        date_time: formData.get('date_time')
    };

    // Supabaseにデータを挿入
    const { data, error } = await supabase
        .from('posts') // テーブル名: posts
        .insert([dataToInsert])
        .select(); 
    
    if (error) {
        console.error('投稿エラー:', error);
        messageDiv.style.color = 'red';
        messageDiv.innerHTML = `❌ 投稿に失敗しました: ${error.message} <br> (原因: RLS設定またはキーの貼り間違いの可能性)`;
    } else {
        messageDiv.style.color = 'green';
        messageDiv.innerHTML = '✅ 情報を投稿しました！データベースに保存されました。';
        postForm.reset(); // フォームをクリア
        console.log('投稿成功:', data);
    }
});


