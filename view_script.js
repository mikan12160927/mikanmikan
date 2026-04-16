const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';

let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchAndDisplayItems(clickedButtonId) {
    const itemListContainer = document.getElementById('itemListContainer');
    const searchProductInput = document.getElementById('searchProduct');
    const sortDateSelect = document.getElementById('sortDate');
    const clickedButton = document.getElementById(clickedButtonId);

    if (clickedButton) {
        clickedButton.classList.add('disabled');
    }

    const searchTerm = searchProductInput.value.trim();
    const sortOrder = sortDateSelect.value === 'newest' ? 'desc' : 'asc';

    itemListContainer.innerHTML = '<p class="loading-message">情報を読み込み中です...</p>';

    // ★修正ポイント: .select() の中に 'id' を追加しました
    let query = sb
        .from('posts')
        .select('id, product_name, store_name, date_time') 
        .order('date_time', { ascending: sortOrder === 'asc' });

    if (searchTerm) {
        query = query.ilike('product_name', `%${searchTerm}%`);
    }

    let { data, error } = await query;

    if (clickedButton) {
        clickedButton.classList.remove('disabled');
    }

    if (error) {
        console.error(error);
        itemListContainer.innerHTML = `<p class="loading-message" style="color:#DC3545;">🚨 データ取得エラーが発生しました: ${error.message}</p>`;
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

        // ★追加ポイント: カードをクリックした時に detail.html へ ID付きで飛ばす設定
        card.style.cursor = 'pointer';
        card.onclick = () => {
            window.location.href = `detail.html?id=${item.id}`;
        };

        const date = new Date(item.date_time);
        const formattedDate = date.toLocaleString('ja-JP', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        });

        card.innerHTML = `
            <h3>${item.product_name}</h3>
            <p><strong>店舗名:</strong> ${item.store_name}</p>
            <p><strong>発見日時:</strong> ${formattedDate}</p>
            <p style="color: var(--color-primary); font-size: 0.85em; margin-top: 10px; font-weight: bold;">➔ 詳細・地図を見る</p>
        `;
        itemListContainer.appendChild(card);
    });
}

// 検索ボタンなどの処理を共通化
window.handleSearchClick = function(event) {
    if (event) event.preventDefault();
    fetchAndDisplayItems('searchButton');
}

document.addEventListener('DOMContentLoaded', function() {
    // ページ読み込み時に自動でデータを表示
    fetchAndDisplayItems();

    const searchProductInput = document.getElementById('searchProduct');
    if (searchProductInput) {
        searchProductInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                fetchAndDisplayItems('searchButton');
            }
        });
    }

    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => fetchAndDisplayItems('refreshButton'));
    }

    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', () => fetchAndDisplayItems('searchButton'));
    }
});
