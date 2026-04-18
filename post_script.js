const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm'); 
    const submitButton = document.getElementById('submitButton'); 

    if (!postForm) return; 

    postForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // --- 未来の日時チェック ---
        const inputDate = new Date(document.getElementById('date-time').value);
        const now = new Date();
        if (inputDate > now) {
            alert("未来の日時は指定できません。現在の日時以前を選択してください。");
            return; 
        }

        submitButton.disabled = true;
        submitButton.textContent = '投稿中...';

        const file = document.getElementById('image-file').files[0];
        let imageUrl = null;

        if (file) {
            const fileName = `${Date.now()}_${file.name}`;
            const { data: uploadData, error: uploadError } = await sb.storage
                .from('post-images')
                .upload(fileName, file);

            if (uploadError) {
                console.error('Storage Error:', uploadError);
            } else {
                const { data: publicUrlData } = sb.storage
                    .from('post-images')
                    .getPublicUrl(fileName);
                imageUrl = publicUrlData.publicUrl;
            }
        }

        const dataToInsert = {
            product_name: document.getElementById('product-name').value.trim(),
            store_name: document.getElementById('store-name').value.trim(),
            date_time: document.getElementById('date-time').value,
            sold_out_count: 0,
            thanks_count: 0,
            image_url: imageUrl
        };

        const { error } = await sb.from('posts').insert([dataToInsert]); 

        if (error) {
            alert('❌ エラー: ' + error.message);
            submitButton.disabled = false;
            submitButton.textContent = '情報を投稿する';
        } else {
            postForm.style.display = 'none';
            document.getElementById('successScreen').style.display = 'block';
        }
    });

    document.getElementById('viewPosts').onclick = () => window.location.href = 'view.html';
    document.getElementById('newPost').onclick = () => location.reload();
});
