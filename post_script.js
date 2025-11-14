// 【重要】ここに Supabase の情報を設定してください！
const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmh-E4s-U'; 

// Supabaseクライアントの初期化
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 必要なHTML要素の取得
const postForm = document.getElementById('postForm');
const messageDiv = document.getElementById('message');
const successScreen = document.getElementById('successScreen'); 
const submitButton = document.getElementById('submitButton'); // ★★ 新しく追加 ★★

// フォーム送信ではなく、ボタンのクリックで処理を実行する
// ★★ イベントリスナーを postForm.submit から submitButton.click に変更 ★★
submitButton.addEventListener('click', async function(event) {
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
    
    // ★★ 必須項目のチェックを追加 ★★
    // フォームに必須項目があるにもかかわらず、ボタンがsubmitではないため、ここでチェック
    if (!dataToInsert.product_name || !dataToInsert.store_name || !dataToInsert.address || !dataToInsert.date_time) {
        messageDiv.style.color = 'red';
        messageDiv.innerHTML = '❌ 全ての必須項目を入力してください。';
        return; 
    }

    // Supabaseにデータを挿入
    const { error } = await supabase
        .from('posts')
        .insert([dataToInsert]); 
    
    if (error) {
        // エラー処理
        console.error('投稿エラー:', error);
        messageDiv.style.color = 'red';
        messageDiv.innerHTML = `❌ 投稿に失敗しました: ${error.message} <br> (原因: RLS設定を確認してください)`;
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
        
        // [さらに投稿する] ボタン (UIリセットとURLクリーンアップ)
        document.getElementById('newPost').addEventListener('click', function(event) {
            event.preventDefault(); 
            
            // 1. UIの表示を元に戻す
            successScreen.style.display = 'none';
            postForm.style.display = 'block';
            postForm.reset(); 
            messageDiv.innerHTML = '';
            window.scrollTo(0, 0); 

            // 2. URLに # があれば強制的に削除する
            if (window.location.hash) {
                history.replaceState(null, '', window.location.pathname);
            }
            
            // 3. 念のため、DOMの処理が完了した後に再度URLをクリーンに
            setTimeout(() => {
                if (window.location.hash) {
                    history.replaceState(null, '', window.location.pathname);
                }
            }, 100); 
        });
    }
});
