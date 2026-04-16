const SUPABASE_URL = 'https://xoefqmgwjpauuebjhfgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZWZxbWd3anBhdXVlYmpoZmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTA5MDIsImV4cCI6MjA3ODU4NjkwMn0.G1ZFLY4HgHe1FD7k-qeUh6KHlKT5CSsmxshq7jMts-U';
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('loading').innerHTML = "❌ データが見つかりません。";
        return;
    }

    const { data, error } = await sb
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        document.getElementById('loading').innerHTML = "🚨 データの取得に失敗しました。";
        return;
    }

    // 画面に反映
    const productH2 = document.getElementById('det-product');
    productH2.innerText = data.product_name;
    document.getElementById('det-store').innerText = data.store_name;
    
    const date = new Date(data.date_time);
    document.getElementById('det-date').innerText = date.toLocaleString('ja-JP');

    // --- 機能1: 鮮度による色分け (信号機システム) ---
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);
    
    const statusBadge = document.createElement('span');
    statusBadge.style.padding = "5px 12px";
    statusBadge.style.borderRadius = "20px";
    statusBadge.style.marginLeft = "10px";
    statusBadge.style.fontSize = "0.6em";
    statusBadge.style.color = "white";
    statusBadge.style.verticalAlign = "middle";

    if (diffHours < 3) {
        statusBadge.innerText = "超新鮮";
        statusBadge.style.backgroundColor = "#2D6A4F"; // 青(緑)
    } else if (diffHours < 12) {
        statusBadge.innerText = "やや経過";
        statusBadge.style.backgroundColor = "#FFB703"; // 黄
    } else {
        statusBadge.innerText = "古い情報";
        statusBadge.style.backgroundColor = "#AE2012"; // 赤
    }
    productH2.appendChild(statusBadge);

    // --- 機能2: 売り切れ報告ボタン ---
    const cardElement = document.querySelector('.item-card');
    const soldOutSection = document.createElement('div');
    soldOutSection.style.marginTop = "25px";
    soldOutSection.style.paddingTop = "15px";
    soldOutSection.style.borderTop = "1px solid #eee";
    soldOutSection.innerHTML = `
        <p style="font-size: 0.9em; color: #666; margin-bottom: 10px;">
            この情報は正しかったですか？
        </p>
        <button id="soldOutBtn" class="control-button" style="background-color: #AE2012; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer;">売り切れていた</button>
        <p id="soldCountDisplay" style="font-size: 0.8em; margin-top: 8px; color: #888;">現在の報告数: ${data.sold_out_count || 0}件</p>
    `;
    cardElement.appendChild(soldOutSection);

    document.getElementById('soldOutBtn').onclick = async () => {
        const newCount = (data.sold_out_count || 0) + 1;
        const { error: updateError } = await sb
            .from('posts')
            .update({ sold_out_count: newCount })
            .eq('id', id);
        
        if (!updateError) {
            alert('報告ありがとうございます。');
            document.getElementById('soldCountDisplay').innerText = `現在の報告数: ${newCount}件`;
            document.getElementById('soldOutBtn').disabled = true;
            document.getElementById('soldOutBtn').innerText = "報告済み";
            document.getElementById('soldOutBtn').style.backgroundColor = "#ccc";
        }
    };

    // --- Googleマップの表示 ---
    const query = encodeURIComponent(data.store_name);
    const mapUrl = `http://googleusercontent.com/maps.google.com/3{query}`;
    document.getElementById('map-frame').src = mapUrl;

    // 表示を切り替え
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
});
