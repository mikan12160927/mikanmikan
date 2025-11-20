const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmh-E4s-U'; 
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
    
    const postForm = document.getElementById('postForm'); 
    const messageDiv = document.getElementById('message');
    const successScreen = document.getElementById('successScreen'); 
    const submitButton = document.getElementById('submitButton'); 

    const productNameInput = document.getElementById('product-name');
    const storeNameInput = document.getElementById('store-name');
    const addressInput = document.getElementById('address');
    const dateTimeInput = document.getElementById('date-time');

    if (!postForm) {
        console.error("致命的なエラー: HTML要素のID 'postForm' が見つかりません。");
        return; 
    }

    postForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        messageDiv.innerHTML = '';
        messageDiv.style.color = '';
        
        const dataToInsert = {
            product_name: productNameInput.value.trim(),
            store_name: storeNameInput.value.trim(),
            address: addressInput.value.trim(),
            date_time: dateTimeInput.value
        };
        
        if (!dataToInsert.product_name || !dataToInsert.store_name || !dataToInsert.address || !dataToInsert.date_time) {
            messageDiv.style.color = 'red';
            messageDiv.innerHTML = '⚠️ 全ての必須項目が入力されていません。ご確認ください。';
            return; 
        }

        submitButton.disabled = true;
        submitButton.textContent = '投稿中...';

        const { error } = await supabase
            .from('posts')
            .insert([dataToInsert]); 
        
        submitButton.textContent = '情報を投稿する';
        submitButton.disabled = false;

        if (error) {
            console.error('投稿エラー:', error);
            messageDiv.style.color = 'red';
            messageDiv.innerHTML = `❌ 投稿に失敗しました: ${error.message} <br> (原因: RLSポリシーまたはテーブルの列名をご確認ください)`;
        } else {
            postForm.style.display = 'none';
            successScreen.style.display = 'block';
            
            document.getElementById('viewPosts').onclick = function() {
                window.location.href = 'view.html'; 
            };
            
            document.getElementById('newPost').addEventListener('click', function(event) {
                event.preventDefault(); 
                
                successScreen.style.display = 'none';
                postForm.style.display = 'block';
                
                productNameInput.value = '';
                storeNameInput.value = '';
                addressInput.value = '';
                dateTimeInput.value = '';
                
                messageDiv.innerHTML = '';
                window.scrollTo(0, 0); 

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
