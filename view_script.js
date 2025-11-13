// 【重要】ここに Supabase の情報を設定してください！
// index.html で使用したものと全く同じ URL と Key を使用します。
const SUPABASE_URL = https://xoefqmgwjpauuebjhfgp.supabase.co; 
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U; 

// Supabaseクライアントの初期化
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const itemListContainer = document.getElementById('itemListContainer');
const searchProductInput = document.getElementById('searchProduct');
const sortDateSelect = document.getElementById('sortDate');
const searchButton = document.getElementById('searchButton');

// ----------------------------------------------------
// データを取得して表示するメイン関数
// ----------------------------------------------------
async function fetchAndDisplayItems() {
    // 検索語とソート順を取得
    const searchTerm = searchProductInput.value.trim();
    const sortOrder = sortDateSelect.value === 'newest' ? 'desc' : 'asc';

    // 読み込み中メッセージを表示
    itemListContainer.innerHTML = '<p class="loading-message">情報を読み込み中です...</p>';

    // Supabaseからのデータ取得クエリを構築
    let query = supabase
        .from('posts') // テーブル名
        .select('product_name, store_name, address, date_time') // 取得したいカラム
        .order('date_time', { ascending: sortOrder === 'asc' }); // 日時でソート

    // 検索語がある場合、フィルタを追加
    if (searchTerm) {
        // 商品名が検索語を含むものにフィルタリング (大文字小文字を区別しない)
        query = query.ilike('product_name', `%${searchTerm}%`);
    }

    // クエリを実行
    const { data, error } = await query;
    
    if (error) {
        console.error('データ取得エラー:', error);
        itemListContainer.innerHTML = `<p class="loading-message" style="color:red;">❌ データ取得中にエラーが発生しました: ${error.message}</p>`;
        return;
    }

    if (data.length === 0) {
        itemListContainer.innerHTML = '<p class="loading-message">該当する情報は見つかりませんでした。</p>';
        return;
    }

    // 取得したデータをHTMLとして表示
    itemListContainer.innerHTML = ''; // コンテナをクリア
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';

        // 日時フォーマットの調整
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
            <p><strong>🏪 店舗名:</strong> ${item.store_name}</p>
            <p><strong>📍 住所:</strong> ${item.address}</p>
            <p><strong>🗓️ 発見日時:</strong> ${formattedDate}</p>
        `;
        itemListContainer.appendChild(card);
    });
}

// ----------------------------------------------------
// イベントリスナーの設定
// ----------------------------------------------------

// 検索ボタンがクリックされたらデータを再取得
searchButton.addEventListener('click', fetchAndDisplayItems);

// ページロード時に一度データを取得・表示
document.addEventListener('DOMContentLoaded', fetchAndDisplayItems);
