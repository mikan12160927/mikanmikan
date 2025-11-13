// 【重要】ここに Supabase の情報を設定してください！
// ステップ1-3で控えた情報をここに貼り付けます。
const SUPABASE_URL = https://xoefqmgwjpauuebjhfgp.supabase.co; 
const SUPABASE_ANON_KEY = https://xoefqmgwjpauuebjhfgp.supabase.co; 

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const postForm = document.getElementById('postForm');
const messageDiv = document.getElementById('message');

// フォームが送信されたときの処理
postForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // フォームの通常の送信をキャンセル
    
    // フォームからデータを取得
    const formData = new FormData(postForm);
    const dataToInsert = {
        product_name: formData.get('product_name'),
        store_name: formData.get('store_name'),
        address: formData.get('address'), // 住所を直接保存
        date_time: formData.get('date_time')
    };

    // Supabaseにデータを挿入
    const { data, error } = await supabase
        .from('posts') // ステップ1-2で作成したテーブル名
        .insert([dataToInsert]);
    
    if (error) {
        console.error('投稿エラー:', error);
        messageDiv.style.color = 'red';
        messageDiv.innerHTML = `❌ 投稿に失敗しました: ${error.message}`;
    } else {
        messageDiv.style.color = 'green';
        messageDiv.innerHTML = '✅ 情報を投稿しました！データベースに保存されました。';
        postForm.reset(); // フォームをクリア
        console.log('投稿成功:', data);
    }
});

