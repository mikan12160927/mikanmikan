const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm'); 
    const messageDiv = document.getElementById('message');
    const successScreen = document.getElementById('successScreen'); 
    const submitButton = document.getElementById('submitButton'); 

    if (!postForm) return; 

    postForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const dataToInsert = {
            product_name: document.getElementById('product-name').value.trim(),
            store_name: document.getElementById('store-name').value.trim(),
            date_time: document.getElementById('date-time').value
        };

        submitButton.disabled = true;
        submitButton.textContent = '投稿中...';

        const { error } = await sb.from('posts').insert([dataToInsert]); 

        if (error) {
            messageDiv.style.color = 'red';
            messageDiv.innerHTML = `❌ 失敗: ${error.message}`;
            submitButton.disabled = false;
            submitButton.textContent = '情報を投稿する';
        } else {
            postForm.style.display = 'none';
            successScreen.style.display = 'block';
        }
    });

    document.getElementById('viewPosts').onclick = () => window.location.href = 'view.html';
    document.getElementById('newPost').onclick = () => location.reload();
    document.getElementById('backToView').onclick = () => window.location.href = 'view.html';
});
