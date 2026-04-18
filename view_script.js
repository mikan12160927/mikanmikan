const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadPosts() {
    console.log("投稿データの取得を開始します...");
    
    // データを取得 (作成日時順)
    const { data, error } = await sb
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    const container = document.getElementById('posts-container');
    container.innerHTML = ''; // 一度コンテナを空にする

    if (error) {
        console.error("データ取得エラー:", error);
        container.innerHTML = `<p style="color:red;">データの読み込みに失敗しました: ${error.message}</p>`;
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p>まだ投稿がありません。</p>";
        return;
    }

    console.log(`${data.length} 件の投稿を表示します`);

    // 取得したデータをループでカード化
    data.forEach(post => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // 画像の出し分け
        const imgHtml = post.image_url 
            ? `<img src="${post.image_url}" alt="商品画像" onerror="this.style.display='none'">` 
            : '<div style="height:180px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; border-radius:10px;">画像なし</div>';
        
        // カードのHTML構成
        card.innerHTML = `
            ${imgHtml}
            <h3>${post.product_name}</h3>
            <p style="font-size: 0.9em; color: #666;"><strong>店名:</strong> ${post.store_name}</p>
            <p style="font-size: 0.9em; color: #666;"><strong>日時:</strong> ${new Date(post.date_time).toLocaleString()}</p>
            <button onclick="window.location.href='detail.html?id=${post.id}'" 
                    style="margin-top: 10px; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                詳細を見る
            </button>
        `;
        container.appendChild(card);
    });
}

// ページ読み込み時に実行
loadPosts();
