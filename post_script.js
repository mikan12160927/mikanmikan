// 【重要】ここに Supabase の情報を設定してください！
const SUPABASE_URL = https://xoefqmgwjpauuebjhfgp.supabase.co; 
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U; 

// Supabaseクライアントの初期化
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const postForm = document.getElementById('postForm');
const messageDiv = document.getElementById('message');
const successScreen = document.getElementById('successScreen'); // 成功画面の要素

// フォームが送信されたときの処理
postForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    // エラーメッセージがあればリセット
    messageDiv.innerHTML = '';
    messageDiv.style.color = '';

    // フォームからデータを取得
    const formData = new FormData(postForm);
    const dataToInsert = {
        product_name: formData.get('product_name'),
        store_name: formData.get('store_name'),
        address: formData.get('address'),
        date_time: formData.get('date_time')
    };

    // Supabaseにデータを挿入
    const { error } = await supabase
        .from('posts')
        .insert([dataToInsert]); 
    
    if (error) {
        // エラー処理
        console.error('投稿エラー:', error);
        messageDiv.style.color = 'red';
        messageDiv.innerHTML = `❌ 投稿に失敗しました: ${error.message} <br> (原因: RLS設定またはキーの貼り間違いの可能性)`;
// post_script.js の修正後の成功処理ブロック (elseの中)

    // ... (中略) ...

    } else {
        // ★ 投稿成功時の画面切り替えロジック
        
        // 1. フォームを非表示にする
        postForm.style.display = 'none';
        
        // 2. 成功画面を表示する
        successScreen.style.display = 'block';
        
        // 3. ボタンにイベントリスナーを設定する
        
        // [みんなの投稿を見る] ボタン
        document.getElementById('viewPosts').onclick = function() {
            window.location.href = 'view.html'; // 閲覧ページへ移動
        };
        
        // [さらに投稿する] ボタンの修正
        document.getElementById('newPost').onclick = function() {
            // 成功画面を非表示にする必要はありません（リロードされるため）。
            
            // ★★ 【重要】ページ全体を強制的に再読み込みする
            // 引数に true を渡すことで、キャッシュを無視して強制リロードします。
            window.location.reload(true); 
        };
    }
});
