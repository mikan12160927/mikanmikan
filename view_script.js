// view_script.js
const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co'; 
// ★★★ ここにあなたの正しいAnonキーを貼り付ける ★★★
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U'; 

let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 

// ----------------------------------------------------
// グローバル関数として定義し、HTMLから直接呼び出す
// ----------------------------------------------------
async function fetchAndDisplayItems(clickedButtonId) {
    
    const itemListContainer = document.getElementById('itemListContainer');
    const searchProductInput = document.getElementById('searchProduct');
    const sortDateSelect = document.getElementById('sortDate');
    
    // 押されたボタンの要素を取得
    const clickedButton = document.getElementById(clickedButtonId); 

    // ★★★ 修正点 1: 処理開始時、押されたボタンのみを無効化する ★★★
    if (clickedButton) {
        clickedButton.classList.add('disabled');
    }
    // --------------------------------------------------------

    const searchTerm = searchProductInput.value.trim();
    const sortOrder = sortDateSelect.value === 'newest' ? 'desc' : 'asc';

    itemListContainer.innerHTML = '<p class="loading-message">情報を読み込み中です...</p>';

    let query = sb
        .from('posts')
        .select('product_name, store_name, address, date_time')
        .order('date_time', { ascending: sortOrder === 'asc' });

    if (searchTerm) {
        query = query.ilike('product_name', `%${searchTerm}%`);
    }

    const { data, error } = await query;
    
    // ★★★ 修正点 2: 処理終了後、押されたボタンのみを有効化に戻す ★★★
    if (clickedButton) {
        clickedButton.classList.remove('disabled');
    }
    // -----------------------------------------------------------

    if (error) {
        console.error('データ取得エラー:', error);
        itemListContainer.innerHTML = `<p class="loading-message" style="color:#DC3545;">🚨 データ取得エラーが発生しました。<br>【原因】: APIキーまたはRLSポリシー（SELECT権限）を確認してください。<br>エラーメッセージ: ${error.message}</p>`;
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
    // 押されたボタンのIDを引数として渡す
    const clickedId = event.currentTarget.id; 
    fetchAndDisplayItems(clickedId);
}

// ページロード時にデータを取得（初期表示は検索ボタンが押された体で処理）
document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayItems('searchButton');
});
