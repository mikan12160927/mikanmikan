// 【重要】ここに Supabase の情報を設定してください！
const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmh-E4s-U'; 

// Supabaseクライアントの初期化
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 必要なHTML要素の取得 (postFormは<div>になっています)
const postForm = document.getElementById('postForm'); 
const messageDiv = document.getElementById('message');
const successScreen = document.getElementById('successScreen'); 
const submitButton = document.getElementById('submitButton'); 

// 各入力フィールドの取得
const productNameInput = document.getElementById('product-name');
const storeNameInput = document.getElementById('store-name');
const addressInput = document.getElementById('address');
const dateTimeInput = document.getElementById('date-time');

// ボタンが存在する場合のみイベントリスナーを設定
if (submitButton) {
    // フォーム送信機能に依存せず、ボタンのクリックイベントで処理を実行
    submitButton.addEventListener('click', async function(event) {
        event.preventDefault(); 
        
        messageDiv.innerHTML = '';
        messageDiv.style.color = '';

        // インプット要素から直接データを取得
        const dataToInsert = {
            product_name: productNameInput.value.trim(),
            store_name: storeNameInput.value.trim(),
            address: addressInput.value.trim(),
            date_time: dateTimeInput.value
        };
        
        // 必須項目のチェック
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
            messageDiv.innerHTML = `❌ 投稿に失敗しました: ${error.message} <br> (原因: RLSポリシーの設定を確認してください)`;
        } else {
            // ★ 投稿成功時の画面切り替えロジック
            
            postForm.style.display = 'none';
            successScreen.style.display = 'block';
            
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
                
                // 2. 入力値をクリア
                productNameInput.value = '';
                storeNameInput.value = '';
                addressInput.value = '';
                dateTimeInput.value = '';
                
                messageDiv.innerHTML = '';
                window.scrollTo(0, 0); 

                // 3. URLに # があれば強制的に削除する
                if (window.location.hash) {
                    history.replaceState(null, '', window.location.pathname);
                }
                
                // 4. 念のため、DOMの処理が完了した後に再度URLをクリーンに
                setTimeout(() => {
                    if (window.location.hash) {
                        history.replaceState(null, '', window.location.pathname);
                    }
                }, 100); 
            });
        }
    });
}
