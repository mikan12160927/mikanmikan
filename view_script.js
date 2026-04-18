const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchAndDisplayItems(clickedButtonId) {
    const itemListContainer = document.getElementById('itemListContainer');
    const searchProductInput = document.getElementById('searchProduct');
    const sortDateSelect = document.getElementById('sortDate');
    const clickedButton = clickedButtonId ? document.getElementById(clickedButtonId) : null;

    // グリッド用クラスを確実に付与
    itemListContainer.className = 'item-list grid-container';

    if (clickedButton) clickedButton.classList.add('disabled');

    const searchTerm = searchProductInput.value.trim();
    const sortOrder = sortDateSelect.value === 'newest' ? 'desc' : 'asc';
    itemListContainer.innerHTML = '<p class="loading-message">情報を読み込み中です...</p>';

    let query = sb.from('posts').select('*').order('date_time', { ascending: sortOrder === 'asc' });
    if (searchTerm) query = query.ilike('product_name', `%${searchTerm}%`);

    let { data, error } = await query;
    if (clickedButton) clickedButton.classList.remove('disabled');

    if (error) {
        itemListContainer.innerHTML = `<p class="loading-message">🚨 取得失敗: ${error.message}</p>`;
        return;
    }

    itemListContainer.innerHTML = '';
    
    if (!data || data.length === 0) {
        itemListContainer.innerHTML = '<p>該当する投稿はありません。</p>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.onclick = () => { window.location.href = `detail.html?id=${item.id}`; };

        const date = new Date(item.date_time);
        let warningHtml = item.sold_out_count >= 3 ? `<p style="color: #AE2012; font-weight: bold; font-size: 0.8em;">⚠️ 売り切れ報告あり</p>` : '';

        // 画像がある場合のみimgタグを追加
        const imgHtml = item.image_url ? `<img src="${item.image_url}" style="width:100%; height:150px; object-fit:cover; border-radius:10px; margin-bottom:10px;">` : '';

        card.innerHTML = `
            ${imgHtml}
            <h3>${item.product_name}</h3>
            <p><strong>店舗名:</strong> ${item.store_name}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <span style="font-size: 0.8em; color: #666;">📅 ${date.toLocaleString('ja-JP')}</span>
                <span style="font-size: 0.9em; background: #D8F3DC; padding: 2px 8px; border-radius: 10px;">🙌 ${item.thanks_count || 0}</span>
            </div>
            ${warningHtml}
        `;
        itemListContainer.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayItems();
    document.getElementById('searchButton').onclick = () => fetchAndDisplayItems('searchButton');
    document.getElementById('refreshButton').onclick = () => fetchAndDisplayItems('refreshButton');
});
