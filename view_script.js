const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * 投稿日時から経過日数を計算し、バッジ用の文字とデザイン（スタイル）を返す関数
 */
function getTimestampBadge(dateTimeString) {
    if (!dateTimeString) return null;

    const now = new Date();
    
    // Tや+以降の文字列をカットして「YYYY-MM-DD HH:mm:ss」の純粋なローカル時間としてパースする
    const cleanString = dateTimeString.split('T')[0]; // "2026-07-14" を取得
    const [year, month, day] = cleanString.split('-').map(Number);
    const postDateOnly = new Date(year, month - 1, day);

    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = nowDateOnly.getTime() - postDateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 1. 今日中（鮮やかな緑）
    if (diffDays === 0) {
        return { text: '今日中', style: 'color: #2D6A4F; background: #E8F5E9; border: 1px solid #C8E6C9; font-weight: bold;' };
    }
    // 2. 昨日（きれいな青）
    if (diffDays === 1) {
        return { text: '昨日', style: 'color: #1565C0; background: #E3F2FD; border: 1px solid #BBDEFB;' };
    }
    // 3. 3日前以内：2日前〜3日前（注意のオレンジ）
    if (diffDays <= 3 && diffDays > 0) {
        return { text: `${diffDays}日前`, style: 'color: #E65100; background: #FFF3E0; border: 1px solid #FFE0B2;' };
    }
    // 4. 1週間未満：4日前〜6日前（マイルドな黄色・カーキ）
    if (diffDays < 7 && diffDays > 0) {
        return { text: `${diffDays}日前`, style: 'color: #744210; background: #FEFCBF; border: 1px solid #FAF089;' };
    }
    // 5. 1か月未満：7日前〜29日前（古い情報である警告の赤）
    if (diffDays < 30 && diffDays >= 7) {
        return { text: '1週間前以上', style: 'color: #C53030; background: #FFF5F5; border: 1px solid #FEB2B2; font-weight: bold;' };
    }
    // 6. 1か月以上前（完全に古い情報のグレー）
    return { text: '1か月以上前', style: 'color: #757575; background: #F5F5F5; border: 1px solid #E0E0E0; font-style: italic;' };
}

// 9時間の自動変換（時差）を無視して、データベースの数値をそのままきれいに表示する関数
function formatLocalTime(dateTimeString) {
    if (!dateTimeString) return '';
    // 例: "2026-07-14T16:30:00+00:00" -> ["2026-07-14", "16:30:00"]
    const parts = dateTimeString.split('T');
    const datePart = parts[0].replace(/-/g, '/'); // "2026/07/14"
    const timePart = parts[1] ? parts[1].substring(0, 5) : ''; // "16:30"
    return `${datePart} ${timePart}`;
}

async function fetchAndDisplayItems(clickedButtonId) {
    const itemListContainer = document.getElementById('itemListContainer');
    const searchProductInput = document.getElementById('searchProduct');
    const sortDateSelect = document.getElementById('sortDate');
    const clickedButton = document.getElementById(clickedButtonId);

    if (clickedButton) clickedButton.classList.add('disabled');

    const searchTerm = searchProductInput.value.trim();
    const sortOrder = sortDateSelect.value === 'newest' ? 'desc' : 'asc';
    itemListContainer.innerHTML = '<p class="loading-message">情報を読み込み中です...</p>';

    let query = sb.from('posts').select('*').order('date_time', { ascending: sortOrder === 'asc' });
    if (searchTerm) query = query.ilike('product_name', `%${searchTerm}%`);

    let { data, error } = await query;
    if (clickedButton) clickedButton.classList.remove('disabled');

    if (error) {
        itemListContainer.innerHTML = `<p class="loading-message">取得失敗</p>`;
        return;
    }

    itemListContainer.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.onclick = () => { window.location.href = `detail.html?id=${item.id}`; };

        let warningHtml = item.sold_out_count >= 3 ? `<p style="color: #AE2012; font-weight: bold; font-size: 0.8em; margin-top: 5px;">⚠️ 売り切れ報告あり</p>` : '';

        const badgeData = getTimestampBadge(item.date_time);
        let badgeHtml = '';
        if (badgeData) {
            badgeHtml = `<span style="font-size: 0.75em; padding: 2px 8px; border-radius: 6px; ${badgeData.style}">${badgeData.text}</span>`;
        }

        const displayTime = formatLocalTime(item.date_time);

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3>${item.product_name}</h3>
                ${badgeHtml}
            </div>
            <p style="margin-top: 5px;"><strong>店舗名:</strong> ${item.store_name}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <span style="font-size: 0.8em; color: #666;">📅 ${displayTime}</span>
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
