let tossCount = 0;
let results = [];

const tossBtn = document.getElementById('toss-btn');
const resetBtn = document.getElementById('reset-btn');
const coins = document.querySelectorAll('.coin');
const hexagramDisplay = document.getElementById('hexagram');
const resultArea = document.getElementById('result');

tossBtn.addEventListener('click', () => {
    if (tossCount >= 6) return;

    tossBtn.disabled = true;
    tossBtn.innerText = "正在起卦...";

    // 1. 启动动画
    coins.forEach((coin) => {
        coin.classList.remove('tossing', 'is-yang', 'is-yin'); // 清除之前的状态
        void coin.offsetWidth;

        // 设置随机动画参数 (和之前一样)
        coin.style.setProperty('--rotX', Math.random().toFixed(2));
        coin.style.setProperty('--rotY', Math.random().toFixed(2));
        coin.style.setProperty('--rotZ', Math.random().toFixed(2));
        coin.style.setProperty('--duration', (1.2 + Math.random() * 0.5).toFixed(2) + 's');
        coin.style.setProperty('--delay', (Math.random() * 0.2).toFixed(2) + 's');

        coin.classList.add('tossing');
    });

    // 2. 计算结果
    const currentToss = Array.from({ length: 3 }, () => Math.random() < 0.5 ? 2 : 3);
    const sum = currentToss.reduce((a, b) => a + b, 0);

    // 3. 动画结束后显示真实的铜钱面
    setTimeout(() => {
        coins.forEach((coin, index) => {
            // 【重点修改】这里不再改文字，而是添加类名来切换图片
            if (currentToss[index] === 3) {
                coin.classList.add('is-yang'); // 显示正面图片
            } else {
                coin.classList.add('is-yin');  // 显示背面图片
            }
        });

        results.push(sum);
        drawYao(sum);
        tossCount++;
        tossBtn.disabled = false;

        if (tossCount === 6) {
            tossBtn.innerText = "卦象已成";
            tossBtn.disabled = true;
            tossBtn.classList.add('hidden');    // 隐藏起卦按钮
            resetBtn.classList.remove('hidden'); // 显示重测按钮
            showResult();
        } else {
            tossBtn.innerText = `再掷一爻 (${tossCount}/6)`;
        }
    }, 1800);
});

// 绘制发光爻线 (样式在 CSS 里升级了)
function drawYao(sum) {
    const line = document.createElement('div');
    // 这里逻辑不变，但 CSS 类名对应的样式已经变了
    if (sum === 7 || sum === 9) {
        line.className = 'line'; 
    } else {
        line.className = 'line yin-line';
    }
    // 老阳老阴加个特殊标记 (可选，这里简单处理，CSS里有光晕区别)
    if (sum === 9 || sum === 6) {
        line.style.filter = "brightness(1.3)";
    }
    hexagramDisplay.appendChild(line);
}

// ... showResult 和 triggerAIAdvice 函数保持不变，直接用之前的即可 ...
// 为了完整性，这里再贴一下 showResult 的关键部分
function showResult() {
    let binaryStr = results.map(sum => (sum === 7 || sum === 9 ? "1" : "0")).join("");
    // 确保 database.js 已加载
    if (typeof hexagrams === 'undefined') {
        console.error("数据库未加载！");
        return;
    }
    const gua = hexagrams[binaryStr];
    resultArea.classList.remove('hidden');
    
    if (gua) {
        document.getElementById('gua-name').innerText = gua.name;
        document.getElementById('gua-description').innerHTML = `
            <p><strong>【卦辞】</strong> ${gua.judgment}</p>
            <p><strong>【象曰】</strong> ${gua.image}</p>
            <p><strong>【释义】</strong> ${gua.meaning}</p>
        `;
        // 触发 AI (如果你有那个函数的话)
        // triggerAIAdvice(gua); 
    }

}
// 1. 监听重置按钮点击
resetBtn.addEventListener('click', () => {
    resetDivination();
});

// 2. 重置功能的具体实现
function resetDivination() {
    // 重置逻辑数据
    tossCount = 0;
    results = [];

    // 清空界面展示
    hexagramDisplay.innerHTML = ""; 
    resultArea.classList.add('hidden'); 
    document.getElementById('question').value = ""; // 清空用户输入

    // 切换按钮显示
    tossBtn.classList.remove('hidden');
    tossBtn.disabled = false;
    tossBtn.innerText = "启 卦";
    resetBtn.classList.add('hidden');

    // 清除硬币状态
    coins.forEach(coin => {
        coin.classList.remove('is-yang', 'is-yin', 'tossing');
        coin.innerText = "";
        // 恢复到初始图片
        coin.style.backgroundImage = "url('assets/coin_yang.png')"; 
    });

    // 平滑滚动回顶部（增强体验）
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
