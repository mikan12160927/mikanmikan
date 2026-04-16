// ... 前半（URLとKEYの定義）はそのまま ...

async function fetchAndDisplayItems(clickedButtonId) {
    // ... 中略 ...
    let query = sb
        .from('posts')
        // ★修正: id を取得対象に追加
        .select('id, product_name, store_name, date_time') 
        .order('date_time', { ascending: sortOrder === 'asc' });

    // ... 中略（検索処理とエラーハンドリング） ...

    itemListContainer.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        // ★追加: クリックしたら詳細ページへ（IDをURLに付ける）
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
            <p style="color: var(--color-primary); font-size: 0.8em; margin-top: 10px;">➔ タップして場所を確認</p>
        `;
        itemListContainer.appendChild(card);
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // ページが開かれたらすぐにデータを取得する
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
