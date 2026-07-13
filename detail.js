const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * 投稿日時から経過日数を計算し、バッジ用の文字とデザイン（スタイル）を返す関数
 */
function getTimestampBadge(dateTimeString) {
    if (!dateTimeString) return null;

    const now = new Date();
    const postDate = new Date(dateTimeString);

    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const postDateOnly = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
    
    const diffTime = nowDateOnly.getTime() - postDateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return { text: '今日中', style: 'color: #2D6A4F; background: #E8F5E9; border: 1px solid #C8E6C9; font-weight: bold;' };
    }
    if (diffDays === 1) {
        return { text: '昨日', style: 'color: #1565C0; background: #E3F2FD; border: 1px solid #BBDEFB;' };
    }
    if (diffDays <= 3 && diffDays > 0) {
        return { text: `${diffDays}日前`, style: 'color: #E65100; background: #FFF3E0; border: 1px solid #FFE0B2;' };
    }
    if (diffDays < 7 && diffDays > 0) {
        return { text: `${diffDays}日前`, style: 'color: #744210; background: #FEFCBF; border: 1px solid #FAF089;' };
    }
    if (diffDays < 30 && diffDays >= 7) {
        return { text: '1週間前以上', style: 'color: #C53030; background: #FFF5F5; border: 1px solid #FEB2B2; font-weight: bold;' };
    }
    return { text: '1か月以上前', style: 'color: #757575; background: #F5F5F5; border: 1px solid #E0E0E0; font-style: italic;' };
}

document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const { data, error } = await sb.from('posts').select('*').eq('id', id).single();
    if (error || !data) {
        document.getElementById('loading').innerHTML = "データの取得に失敗しました。";
        return;
    }

    const cardElement = document.querySelector('.item-card');
    const productH2 = document.getElementById('det-product');

    productH2.innerText = data.product_name;

    // --- 1. 白いカードの中身を左右2カラムのレイアウトにする ---
    cardElement.style.display = "flex";
    cardElement.style.flexWrap = "wrap";
    cardElement.style.justifyContent = "space-between";
    cardElement.style.alignItems = "stretch";
    cardElement.style.padding = "25px";

    const infoWrapper = document.createElement('div');
    infoWrapper.style.flex = "1 1 300px";
    infoWrapper.style.display = "flex";
    infoWrapper.style.flexDirection = "column";

    infoWrapper.appendChild(productH2);
    
    const pTags = cardElement.querySelectorAll('p');
    pTags.forEach(p => infoWrapper.appendChild(p));
    
    cardElement.appendChild(infoWrapper);

    // --- 2. 経過日時バッジの設定 ---
    const badgeData = getTimestampBadge(data.date_time);
    if (badgeData) {
        const badge = document.createElement('span');
        badge.innerText = badgeData.text;
        badge.style = `padding: 4px 10px; border-radius: 6px; margin-left: 12px; font-size: 0.6em; vertical-align: middle; ${badgeData.style}`;
        productH2.appendChild(badge);
    }

    // --- 3. 画像表示 ＆ ポップアップ（モーダル）機能 ---
    if (data.image_url) {
        const imgWrapper = document.createElement('div');
        imgWrapper.style.flex = "1 1 250px";
        imgWrapper.style.maxWidth = "350px";
        imgWrapper.style.display = "flex";
        imgWrapper.style.alignItems = "center";
        imgWrapper.style.justifyContent = "center";
        imgWrapper.style.marginTop = "10px";
        imgWrapper.style.marginBottom = "10px";

        const img = document.createElement('img');
        img.src = data.image_url;
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.maxHeight = "250px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "12px";
        img.style.cursor = "pointer"; // クリックできることを示すカーソル
        img.title = "クリックで拡大表示";
        
        // 【追加】クリックしたときのポップアップ（モーダル）処理
        img.onclick = () => {
            // 背景の黒いクッション
            const modal = document.createElement('div');
            modal.style.position = "fixed";
            modal.style.top = "0";
            modal.style.left = "0";
            modal.style.width = "100vw";
            modal.style.height = "100vh";
            modal.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
            modal.style.display = "flex";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
            modal.style.zIndex = "9999";
            modal.style.cursor = "zoom-out";
            modal.style.transition = "opacity 0.2s ease";

            // ポップアップする中央の大画像
            const bigImg = document.createElement('img');
            bigImg.src = data.image_url;
            bigImg.style.maxWidth = "90%";
            bigImg.style.maxHeight = "90%";
            bigImg.style.borderRadius = "15px";
            bigImg.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
            bigImg.style.cursor = "zoom-out";

            modal.appendChild(bigImg);
            document.body.appendChild(modal);

            // どこをクリックしてもポップアップが閉じる
            modal.onclick = () => {
                modal.style.opacity = "0";
                setTimeout(() => modal.remove(), 200);
            };
        };

        imgWrapper.appendChild(img);
        cardElement.appendChild(imgWrapper);
    }

    document.getElementById('det-store').innerText = data.store_name;
    document.getElementById('det-date').innerText = new Date(data.date_time).toLocaleString('ja-JP');

    // --- 4. ボタンエリア ---
    const btnArea = document.createElement('div');
    btnArea.style.marginTop = "auto";
    btnArea.style.paddingTop = "20px";
    btnArea.style.display = "flex";
    btnArea.style.gap = "10px";
    infoWrapper.appendChild(btnArea);

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

    // --- 5. Googleマップの読み込み ---
    const query = encodeURIComponent(data.store_name);
    const mapUrl = `https://maps.google.co.jp/maps?q=${query}&output=embed&t=m&z=16`;
    document.getElementById('map-frame').src = mapUrl;

    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
});
