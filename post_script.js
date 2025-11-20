// Supabaseクライアントの初期化をグローバルに戻し、確実性を高める
const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmh-E4s-U'; 
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
    
    const postForm = document.getElementById('postForm'); 
    const messageDiv = document.getElementById('message');
    const successScreen = document.getElementById('successScreen'); 
    const submitButton = document.getElementById('submitButton'); 

    // 各入力フィールドの取得（FormDataを使うため、インプットのname属性が重要）
    const productNameInput = document.getElementById('product-name');
    const storeNameInput = document.getElementById('store-name');
    const addressInput = document.getElementById('address');
    const dateTimeInput = document.getElementById('date-time');

    if (!postForm) {
        console.error("致命的なエラー: HTML要素のID 'postForm' が見つかりません。");
        return; 
    }

    // ★ フォーム全体のsubmitイベントで処理を捕捉します ★
    postForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // デフォルトのページ遷移を防止
        
        messageDiv.innerHTML = '';
        messageDiv.style.color = '';
        
        // 入力値の取得
        const dataToInsert = {
            product_name: productNameInput.value.trim(),
            store_name: storeNameInput.value.trim(),
            address: addressInput.value.trim(),
            date_time: dateTimeInput.value
        };
        
        // ★ 必須項目のチェック（数値の注意書きはHTMLのrequired属性とこのチェックで代替します） ★
        if (!dataToInsert.product_name || !dataToInsert.store_name || !dataToInsert.address || !dataToInsert.date_time) {
            messageDiv.style.color = 'red';
            messageDiv.innerHTML = '⚠️ 全ての必須項目が入力されていません。ご確認ください。';
            return; 
        }

        // UIをフィードバック表示に切り替え
        submitButton.disabled = true;
        submitButton.textContent = '投稿中...';

        // Supabaseにデータを挿入
        const { error } = await supabase
            .from('posts')
            .insert([dataToInsert]); 
        
        submitButton.textContent = '情報を投稿する';
        submitButton.disabled = false;

        if (error) {
            console.error('投稿エラー:', error);
            messageDiv.style.color = 'red';
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
                
                // UIリセット
                successScreen.style.display = 'none';
                postForm.style.display = 'block';
                
                // 入力値クリア
                productNameInput.value = '';
                storeNameInput.value = '';
                addressInput.value = '';
                dateTimeInput.value = '';
                
                messageDiv.innerHTML = '';
                window.scrollTo(0, 0); 

                // URLのクリーンアップ
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
