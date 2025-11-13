// 【重要】ここに Supabase の情報を設定してください！
const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmh-E4s-U'; 

// Supabaseクライアントの初期化
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const postForm = document.getElementById('postForm');
const messageDiv = document.getElementById('message');
const successScreen = document.getElementById('successScreen'); 

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
        messageDiv.innerHTML = `❌ 投稿に失敗しました: ${error.message} <br> (原因: RLS設定やキーが原因の可能性)`;
// post_script.js の投稿成功時 (else) の処理

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
            window.location.href = 'view.html'; 
        };
        
        // [さらに投稿する] ボタン (URLを完全にクリーンにする処理を追加)
        document.getElementById('newPost').addEventListener('click', function(event) {
            event.preventDefault(); 
            
            // ★★ 【最終解決策】アドレスバーのURLを強制的に書き換える ★★
            // ページ履歴に新しいエントリを追加せず、現在のURLをクリーンなものに置き換える
            history.replaceState(null, '', '/'); 
            
            // 成功画面を非表示にする
            successScreen.style.display = 'none';
            
            // フォームを再表示する
            postForm.style.display = 'block';
            
            // フォームの内容をクリアする
            postForm.reset(); 
            
            // エラーメッセージをクリア
            messageDiv.innerHTML = '';
            
            // 画面の最上部へスクロール
            window.scrollTo(0, 0); 
        });
    }
});
