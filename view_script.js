const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm'); 
    const submitButton = document.getElementById('submitButton'); 

    if (!postForm) return; 

    postForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log("投稿ボタンが押されました");

        // --- 未来の日時チェック（バリデーション） ---
        const inputDate = new Date(document.getElementById('date-time').value);
        const now = new Date();
        console.log("入力日時:", inputDate, " 現在:", now);

        if (inputDate > now) {
            alert("未来の日時は指定できません。現在の日時以前を選択してください。");
            return; // ここで処理を止める
        }

        submitButton.disabled = true;
        submitButton.textContent = '投稿中...';

        // ファイル取得の確認
        const fileInput = document.getElementById('image-file');
        const file = fileInput.files[0];
        let imageUrl = null;

        // 画像がある場合はStorageにアップロード
        if (file) {
            console.log("画像アップロード開始:", file.name);
            const fileName = `${Date.now()}_${file.name}`;
            
            const { data: uploadData, error: uploadError } = await sb.storage
                .from('post-images')
                .upload(fileName, file);

            if (uploadError) {
                console.error('Storageアップロードエラー:', uploadError);
                alert('画像のアップロードに失敗しました');
            } else {
                console.log("アップロード成功:", uploadData);
                const { data: publicUrlData } = sb.storage
                    .from('post-images')
                    .getPublicUrl(fileName);
                imageUrl = publicUrlData.publicUrl;
                console.log("画像URL取得:", imageUrl);
            }
        } else {
            console.log("画像なしで投稿します");
        }

        // データベースへの登録データ準備
        const dataToInsert = {
            product_name: document.getElementById('product-name').value.trim(),
            store_name: document.getElementById('store-name').value.trim(),
            date_time: document.getElementById('date-time').value,
            sold_out_count: 0,
            thanks_count: 0,
            image_url: imageUrl
        };

        console.log("DB送信データ:", dataToInsert);

        const { error } = await sb.from('posts').insert([dataToInsert]); 

        if (error) {
            console.error("DB挿入エラー:", error);
            alert('❌ 投稿失敗: ' + error.message);
            submitButton.disabled = false;
            submitButton.textContent = '情報を投稿する';
        } else {
            console.log("DB挿入成功！");
            postForm.style.display = 'none';
            document.getElementById('successScreen').style.display = 'block';
        }
    });

    // 画面遷移用ボタン
    document.getElementById('viewPosts').onclick = () => window.location.href = 'view.html';
    document.getElementById('newPost').onclick = () => location.reload();
});
