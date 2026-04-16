const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm'); 
    const submitButton = document.getElementById('submitButton'); 

    // HTMLに <input type="file" id="image-file"> を追加しておいてください
    postForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = '投稿中...';

        const file = document.getElementById('image-file').files[0];
        let imageUrl = null;

        // 画像がある場合はStorageにアップロード
        if (file) {
            const fileName = `${Date.now()}_${file.name}`;
            const { data: uploadData, error: uploadError } = await sb.storage
                .from('post-images')
                .upload(fileName, file);

            if (uploadError) {
                alert('画像アップロード失敗: ' + uploadError.message);
            } else {
                // 公開URLを取得
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
            thanks_count: 0, // ★3の初期値
            image_url: imageUrl // ★5のURL
        };

        const { error } = await sb.from('posts').insert([dataToInsert]); 

        if (error) {
            alert('投稿失敗: ' + error.message);
            submitButton.disabled = false;
        } else {
            postForm.style.display = 'none';
            document.getElementById('successScreen').style.display = 'block';
        }
    });
});
