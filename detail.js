const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const { data, error } = await sb.from('posts').select('*').eq('id', id).single();
    if (error || !data) {
        document.getElementById('loading').innerHTML = "🚨 データの取得に失敗しました。";
        return;
    }

    const cardElement = document.querySelector('.item-card');

    // --- 写真の表示 ---
    if (data.image_url) {
        const img = document.createElement('img');
        img.src = data.image_url;
        img.style.width = "100%";
        img.style.borderRadius = "15px";
        img.style.marginBottom = "20px";
        cardElement.prepend(img);
    }

    // --- 基本情報の反映 ---
    const productH2 = document.getElementById('det-product');
    productH2.innerText = data.product_name;
    document.getElementById('det-store').innerText = data.store_name;
    document.getElementById('det-date').innerText = new Date(data.date_time).toLocaleString('ja-JP');

    // --- 鮮度バッジ ---
    const diffHours = (new Date() - new Date(data.date_time)) / (1000 * 60 * 60);
    const badge = document.createElement('span');
    badge.style = "padding:5px 12px; border-radius:20px; margin-left:10px; font-size:0.6em; color:white; vertical-align:middle;";
    if (diffHours < 3) { badge.innerText = "超新鮮"; badge.style.backgroundColor = "#2D6A4F"; }
    else if (diffHours < 12) { badge.innerText = "やや経過"; badge.style.backgroundColor = "#FFB703"; }
    else { badge.innerText = "古い情報"; badge.style.backgroundColor = "#AE2012"; }
    productH2.appendChild(badge);

    // --- ボタンエリアの作成 ---
    const btnArea = document.createElement('div');
    btnArea.style.marginTop = "20px";
    btnArea.style.display = "flex";
    btnArea.style.gap = "10px";
    btnArea.style.flexWrap = "wrap";
    cardElement.appendChild(btnArea);

    // ありがとうボタン
    const thanksBtn = document.createElement('button');
    thanksBtn.innerHTML = `🙌 役に立った (<span id="t-count">${data.thanks_count || 0}</span>)`;
    thanksBtn.className = "control-button";
    thanksBtn.style.backgroundColor = "#40916C";
    thanksBtn.onclick = async () => {
        const next = (data.thanks_count || 0) + 1;
        await sb.from('posts').update({ thanks_count: next }).eq('id', id);
        document.getElementById('t-count').innerText = next;
        thanksBtn.disabled = true;
        thanksBtn.style.opacity = "0.5";
    };
    btnArea.appendChild(thanksBtn);

    // 売り切れ報告ボタン
    const soldBtn = document.createElement('button');
    soldBtn.innerHTML = `売り切れていた (<span id="s-count">${data.sold_out_count || 0}</span>)`;
    soldBtn.className = "control-button";
    soldBtn.style.backgroundColor = "#AE2012";
    soldBtn.onclick = async () => {
        const next = (data.sold_out_count || 0) + 1;
        await sb.from('posts').update({ sold_out_count: next }).eq('id', id);
        document.getElementById('s-count').innerText = next;
        soldBtn.disabled = true;
        soldBtn.style.opacity = "0.5";
    };
    btnArea.appendChild(soldBtn);

    // --- Googleマップの修正 (テンプレートリテラルを正しく使用) ---
    const query = encodeURIComponent(data.store_name);
    const mapUrl = `https://maps.google.co.jp/maps?q=${query}&output=embed&t=m&z=16`;
    document.getElementById('map-frame').src = mapUrl;

    // 表示切り替え
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
});
