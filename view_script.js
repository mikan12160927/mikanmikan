const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadPosts() {
    const { data, error } = await sb.from('posts').select('*').order('created_at', { ascending: false });
    const container = document.getElementById('posts-container');
    container.innerHTML = ''; // 一度空にする

    if (error) {
        container.innerHTML = "読み込みエラーです";
        return;
    }

    data.forEach(post => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // 画像がある場合のみ表示
        const imgHtml = post.image_url ? `<img src="${post.image_url}" alt="商品">` : '<div style="height:180px; background:#eee; display:flex; align-items:center; justify-content:center; border-radius:10px;">画像なし</div>';
        
        card.innerHTML = `
            ${imgHtml}
            <h3>${post.product_name}</h3>
            <p><strong>店名:</strong> ${post.store_name}</p>
            <p><strong>日時:</strong> ${new Date(post.date_time).toLocaleString()}</p>
            <button onclick="window.location.href='detail.html?id=${post.id}'">詳細を見る</button>
        `;
        container.appendChild(card);
    });
}

loadPosts();
