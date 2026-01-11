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

    let query = sb
        .from('posts')
        .select('product_name, store_name, address, date_time')
        .order('date_time', { ascending: sortOrder === 'asc' });

    if (searchTerm) {
        query = query.ilike('product_name', `%${searchTerm}%`);
    }

    const { data, error } = await query;
    
    if (clickedButton) {
        clickedButton.classList.remove('disabled');
    }

    if (error) {
        console.error(error);
        itemListContainer.innerHTML = `<p class="loading-message" style="color:#DC3545;">🚨 データ取得エラーが発生しました。<br>エラーメッセージ: ${error.message}</p>`;
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

window.handleSearchClick = function(event) {
    event.preventDefault();
    const clickedId = event.currentTarget.id;
    fetchAndDisplayItems(clickedId);
}

document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayItems('searchButton');
});
