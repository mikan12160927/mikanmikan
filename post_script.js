const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';

let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
    
    const postForm = document.getElementById('postForm'); 
    const messageDiv = document.getElementById('message');
    const successScreen = document.getElementById('successScreen'); 
    const submitButton = document.getElementById('submitButton'); 

    const productNameInput = document.getElementById('product-name');
    const storeNameInput = document.getElementById('store-name');
    const dateTimeInput = document.getElementById('date-time');

    if (!postForm) return; 

    postForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        messageDiv.innerHTML = '';
        
        const dataToInsert = {
            product_name: productNameInput.value.trim(),
            store_name: storeNameInput.value.trim(),
            date_time: dateTimeInput.value
        };
        
        if (!dataToInsert.product_name || !dataToInsert.store_name || !dataToInsert.date_time) {
            messageDiv.style.color = 'red';
            messageDiv.innerHTML = '⚠️ 全ての項目を入力してください。';
            return; 
        }

        submitButton.disabled = true;
        submitButton.textContent = '投稿中...';

        const { error } = await sb
            .from('posts')
            .insert([dataToInsert]); 
        
        submitButton.textContent = '情報を投稿する';
        submitButton.disabled = false;

        if (error) {
            console.error('投稿エラー:', error);
            messageDiv.style.color = 'red';
            messageDiv.innerHTML = `❌ 投稿に失敗しました: ${error.message}`;
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
                dateTimeInput.value = '';
                messageDiv.innerHTML = '';
                window.scrollTo(0, 0); 
            });
        }
    });
});
