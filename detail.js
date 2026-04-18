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

    // --- 画像と商品名を横並びにするレイアウト ---
    const headerWrapper = document.createElement('div');
    headerWrapper.style.display = "flex";
    headerWrapper.style.justifyContent = "space-between";
    headerWrapper.style.alignItems = "center";
    headerWrapper.style.marginBottom = "20px";
    cardElement.prepend(headerWrapper);

    // 商品名部分をヘッダー内へ
    const productH2 = document.getElementById('det-product');
    headerWrapper.appendChild(productH2);

    // 画像のサイズを小さくしてヘッダー内へ
    if (data.image_url) {
        const img = document.createElement('img');
        img.src = data.image_url;
        img.style.width = "80px";
        img.style.height = "80px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "10px";
        img.style.marginLeft = "15px";
        img.style.flexShrink = "0"; // 画像が縮まないように固定
        headerWrapper.appendChild(img);
    }

    // --- 基本情報の反映 ---
    document.getElementById('det-store').innerText = data.store_name;
    document.getElementById('det-date').innerText = new Date(data.date_time).toLocaleString('ja-JP');

    // --- 鮮度バッジ（自然な言葉選びに修正） ---
    const diffHours = (new Date() - new Date(data.date_time)) / (1000 * 60 * 60);
    const badge = document.createElement('span');
    badge.style = "padding:4px 10px; border-radius:15px; margin-left:10px; font-size:0.7em; color:white;";
    
    if (diffHours < 3) { 
        badge.innerText = "更新直後"; 
        badge.style.backgroundColor = "#2D6A4F"; 
    } else if (diffHours < 12) { 
        badge.innerText = "数時間前"; 
        badge.style.backgroundColor = "#FFB703"; 
    } else { 
        badge.innerText = "要確認"; 
        badge.style.backgroundColor = "#AE2012"; 
    }
    productH2.appendChild(badge);

    // --- ボタンエリア ---
    const btnArea = document.createElement('div');
    btnArea.style.marginTop = "20px";
    btnArea.style.display = "flex";
    btnArea.style.gap = "10px";
    cardElement.appendChild(btnArea);

    const thanksBtn = document.createElement('button');
    thanksBtn.innerHTML = `🙌 役に立った (<span id="t-count">${data.thanks_count || 0}</span>)`;
    thanksBtn.className = "control-button";
    thanksBtn.style.backgroundColor = "#40916C";
    thanksBtn.onclick = async () => {
        const next = (data.thanks_count || 0) + 1;
        await sb.from('posts').update({ thanks_count: next }).eq('id', id);
        document.getElementById('t-count').innerText = next;
        thanksBtn.disabled = true;
    };
    btnArea.appendChild(thanksBtn);

    const soldBtn = document.createElement('button');
    soldBtn.innerHTML = `売り切れていた (<span id="s-count">${data.sold_out_count || 0}</span>)`;
    soldBtn.className = "control-button";
    soldBtn.style.backgroundColor = "#AE2012";
    soldBtn.onclick = async () => {
        const next = (data.sold_out_count || 0) + 1;
        await sb.from('posts').update({ sold_out_count: next }).eq('id', id);
        document.getElementById('s-count').innerText = next;
        soldBtn.disabled = true;
    };
    btnArea.appendChild(soldBtn);

    // --- Googleマップ ---
    const query = encodeURIComponent(data.store_name);
    const mapUrl = `https://maps.google.co.jp/maps?q=${query}&output=embed&t=m&z=16`;
    document.getElementById('map-frame').src = mapUrl;

    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
});
