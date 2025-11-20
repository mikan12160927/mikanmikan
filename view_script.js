const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmh-E4s-U'; 

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOMContentLoadedの中で全てを実行し、要素が確実に存在するようにします
document.addEventListener('DOMContentLoaded', function() {
    
    // 必要なHTML要素をDOMContentLoaded内で取得
    const itemListContainer = document.getElementById('itemListContainer');
    const searchProductInput = document.getElementById('searchProduct');
    const sortDateSelect = document.getElementById('sortDate');
    const searchButton = document.getElementById('searchButton');

    // fetchAndDisplayItems関数をDOMContentLoaded内に定義
    async function fetchAndDisplayItems() {
        const searchTerm = searchProductInput.value.trim();
        const sortOrder = sortDateSelect.value === 'newest' ? 'desc' : 'asc';

        // 読み込みメッセージの表示
        itemListContainer.innerHTML = '<p class="loading-message">情報を読み込み中です...</p>';

        let query = supabase
            .from('posts')
            .select('product_name, store_name, address, date_time')
            .order('date_time', { ascending: sortOrder === 'asc' });

        if (searchTerm) {
            query = query.ilike('product_name', `%${searchTerm}%`);
        }

        const { data, error } = await query;
        
        if (error) {
            console.error('データ取得エラー:', error);
            // エラーの詳細を表示
            itemListContainer.innerHTML = `<p class="loading-message" style="color:#DC3545;">🚨 データ取得エラーが発生しました。<br>【原因】: Supabaseの**SELECT RLSポリシー**が設定されていません。<br>エラーメッセージ: ${error.message}</p>`;
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

    // ★ ボタンにイベントリスナーを設定 ★
    if (searchButton) {
        searchButton.addEventListener('click', function(event) {
            event.preventDefault(); // フォームのデフォルト動作を防止（もしあれば）
            fetchAndDisplayItems();
        });
    } else {
         console.error("致命的なエラー: 検索ボタンのID 'searchButton' が見つかりません。");
    }

    // ページロード時に一度実行
    fetchAndDisplayItems();
});
