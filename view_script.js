const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODg5OTA0Mn0.2Y0_q_K2Y4I4O_4o_0g1m_8Q5p_3M1L7dY6J7wXJ'; 

// ★★★ 修正済み: 変数名を sb (Supabase Clientの略) に変更し、エラーを回避します ★★★
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 

// ----------------------------------------------------
// ★ グローバル関数として定義し、HTMLから直接呼び出す ★
// ----------------------------------------------------
async function fetchAndDisplayItems() {
    
    const itemListContainer = document.getElementById('itemListContainer');
    const searchProductInput = document.getElementById('searchProduct');
    const sortDateSelect = document.getElementById('sortDate');
    const searchButton = document.getElementById('searchButton'); 
    const refreshButton = document.getElementById('refreshButton'); 

    if (searchButton) searchButton.classList.add('disabled');
    if (refreshButton) refreshButton.classList.add('disabled');

    const searchTerm = searchProductInput.value.trim();
    const sortOrder = sortDateSelect.value === 'newest' ? 'desc' : 'asc';

    itemListContainer.innerHTML = '<p class="loading-message">情報を読み込み中です...</p>';

    // ★ sb を使用してSELECT処理を実行 ★
    let query = sb
        .from('posts')
        .select('product_name, store_name, address, date_time')
        .order('date_time', { ascending: sortOrder === 'asc' });

    if (searchTerm) {
        query = query.ilike('product_name', `%${searchTerm}%`);
    }

    const { data, error } = await query;
    
    if (searchButton) searchButton.classList.remove('disabled');
    if (refreshButton) refreshButton.classList.remove('disabled');

    if (error) {
        console.error('データ取得エラー:', error);
        itemListContainer.innerHTML = `<p class="loading-message" style="color:#DC3545;">🚨 データ取得エラーが発生しました。<br>【原因】: RLSポリシー（SELECT権限）をご確認ください。<br>エラーメッセージ: ${error.message}</p>`;
        return;
    }

    if (data.length === 0) {
        itemListContainer.innerHTML = '<p class="loading-message">該当する情報は見つかりませんでした。</p>';
        return;
    }

    itemListContainer.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';

        const date = new Date(item.date_time);
        const formattedDate = date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        card.innerHTML = `
            <h3>${item.product_name}</h3>
            <p><strong>店舗名:</strong> ${item.store_name}</p>
            <p><strong>住所:</strong> ${item.address}</p>
            <p><strong>発見日時:</strong> ${formattedDate}</p>
        `;
        itemListContainer.appendChild(card);
    });
}

// onclickから呼び出すグローバル関数
window.handleSearchClick = function(event) {
    event.preventDefault();
    fetchAndDisplayItems();
}

// ページロード時にデータを取得
document.addEventListener('DOMContentLoaded', fetchAndDisplayItems);
