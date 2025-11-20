// 即時実行関数で囲み、グローバルスコープの汚染を防ぐ
(function() {
    // 【重要】ここに Supabase の情報を設定してください！
    const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co'; 
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmh-E4s-U'; 

    // DOMContentLoadedイベント内で全てを実行
    document.addEventListener('DOMContentLoaded', function() {
        
        // Supabaseクライアントの初期化をDOMContentLoaded内に移動（確実性向上）
        const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // 必要なHTML要素の取得
        const postForm = document.getElementById('postForm'); 
        const messageDiv = document.getElementById('message');
        const successScreen = document.getElementById('successScreen'); 
        const submitButton = document.getElementById('submitButton'); 

        // 各入力フィールドの取得
        const productNameInput = document.getElementById('product-name');
        const storeNameInput = document.getElementById('store-name');
        const addressInput = document.getElementById('address');
        const dateTimeInput = document.getElementById('date-time');

        // エラーチェック（要素が存在しない場合、コンソールに表示して処理を停止）
        if (!submitButton || !postForm) {
            console.error("致命的なエラー: 必要なHTML要素が見つかりません。IDを確認してください。");
            return; 
        }

        // ボタンのクリックイベントで処理を実行
        submitButton.addEventListener('click', async function(event) {
            event.preventDefault(); 
            
            // 投稿処理開始前のUIリセット
            messageDiv.innerHTML = '';
            messageDiv.style.color = '';
            submitButton.disabled = true; // 二重送信防止のためボタンを無効化
            submitButton.textContent = '投稿中...';

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
                submitButton.textContent = '情報を投稿する';
                submitButton.disabled = false;
                return; 
            }

            // Supabaseにデータを挿入
            const { error } = await supabase
                .from('posts')
                .insert([dataToInsert]); 
            
            submitButton.textContent = '情報を投稿する'; // 処理完了
            submitButton.disabled = false;

            if (error) {
                // エラー処理
                console.error('投稿エラー:', error);
                messageDiv.style.color = 'red';
                // RLSエラーの可能性が高いのでメッセージを強調
                messageDiv.innerHTML = `❌ 投稿に失敗しました: ${error.message} <br> **【重要】SupabaseのRLSポリシーを必ず確認してください。**`;
            } else {
                // 投稿成功時の画面切り替えロジック
                postForm.style.display = 'none';
                successScreen.style.display = 'block';
                
                document.getElementById('viewPosts').onclick = function() {
                    window.location.href = 'view.html'; 
                };
                
                document.getElementById('newPost').addEventListener('click', function(event) {
                    event.preventDefault(); 
                    
                    // UIの表示を元に戻す
                    successScreen.style.display = 'none';
                    postForm.style.display = 'block';
                    
                    // 入力値をクリア
                    productNameInput.value = '';
                    storeNameInput.value = '';
                    addressInput.value = '';
                    dateTimeInput.value = '';
                    
                    messageDiv.innerHTML = '';
                    window.scrollTo(0, 0); 

                    // URLから # を強制的に削除
                    if (window.location.hash) {
                        history.replaceState(null, '', window.location.pathname);
                    }
                    setTimeout(() => {
                        if (window.location.hash) {
                            history.replaceState(null, '', window.location.pathname);
                        }
                    }, 100); 
                });
            }
        });
    });
})();
