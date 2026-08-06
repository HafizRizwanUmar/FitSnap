document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.page-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update buttons
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update sections
            const targetId = btn.getAttribute('data-target');
            sections.forEach(sec => {
                sec.classList.add('hidden');
                if(sec.id === targetId) sec.classList.remove('hidden');
            });
        });
    });

    // App Object for global functions
    window.app = {
        navigateTo: (sectionId) => {
            const btn = document.querySelector(`.nav-btn[data-target="${sectionId}"]`);
            if(btn) btn.click();
        },
        nextStep: (stepNum) => {
            document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
            document.getElementById(`step${stepNum}`).classList.remove('hidden');
            
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if(index < stepNum) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        },
        finishOnboarding: () => {
            document.getElementById('onboardingWizard').classList.add('hidden');
            localStorage.setItem('fitsnap_onboarded', 'true');
        }
    };

    // Chart Editor Modal Logic
    const editorModal = document.getElementById('chartEditorModal');
    const createBtn = document.getElementById('createNewChartBtn');
    const closeBtns = document.querySelectorAll('.close-modal, .cancel-modal');
    const editBtns = document.querySelectorAll('.edit-btn');

    createBtn.addEventListener('click', () => editorModal.classList.remove('hidden'));
    editBtns.forEach(btn => btn.addEventListener('click', () => editorModal.classList.remove('hidden')));
    closeBtns.forEach(btn => btn.addEventListener('click', () => editorModal.classList.add('hidden')));

    // Table Builder Logic
    const addRowBtn = document.getElementById('addRowBtn');
    const addColBtn = document.getElementById('addColBtn');
    const builderTable = document.getElementById('builderTable');

    addRowBtn.addEventListener('click', () => {
        const tbody = builderTable.querySelector('tbody');
        const row = document.createElement('tr');
        const colCount = builderTable.querySelector('thead tr').children.length;
        for(let i=0; i<colCount; i++) {
            const td = document.createElement('td');
            td.contentEditable = 'true';
            td.innerText = '-';
            row.appendChild(td);
        }
        tbody.appendChild(row);
    });

    addColBtn.addEventListener('click', () => {
        const thead = builderTable.querySelector('thead tr');
        const th = document.createElement('th');
        th.contentEditable = 'true';
        th.innerText = 'New Col';
        thead.appendChild(th);

        const tbodyRows = builderTable.querySelectorAll('tbody tr');
        tbodyRows.forEach(row => {
            const td = document.createElement('td');
            td.contentEditable = 'true';
            td.innerText = '-';
            row.appendChild(td);
        });
    });

    // Widget Preview Live Update
    const btnTextInput = document.getElementById('widgetBtnText');
    const previewBtnText = document.getElementById('previewWidgetBtnText');
    const styleSelect = document.getElementById('widgetBtnStyle');
    const previewBtn = document.getElementById('previewWidgetBtn');
    const colorPicker = document.getElementById('widgetColorPicker');

    btnTextInput.addEventListener('input', (e) => {
        previewBtnText.innerText = e.target.value;
    });

    colorPicker.addEventListener('input', (e) => {
        if(styleSelect.value === 'filled') {
            previewBtn.style.backgroundColor = e.target.value;
            previewBtn.style.color = 'white';
            previewBtn.style.border = 'none';
        } else if (styleSelect.value === 'outline') {
            previewBtn.style.backgroundColor = 'transparent';
            previewBtn.style.color = e.target.value;
            previewBtn.style.border = `2px solid ${e.target.value}`;
        }
    });

    styleSelect.addEventListener('change', (e) => {
        const color = colorPicker.value;
        if(e.target.value === 'filled') {
            previewBtn.style.backgroundColor = color;
            previewBtn.style.color = 'white';
            previewBtn.style.border = 'none';
        } else if (e.target.value === 'outline') {
            previewBtn.style.backgroundColor = 'transparent';
            previewBtn.style.color = color;
            previewBtn.style.border = `2px solid ${color}`;
        } else {
            previewBtn.style.backgroundColor = 'transparent';
            previewBtn.style.color = color;
            previewBtn.style.border = 'none';
            previewBtn.style.textDecoration = 'underline';
        }
    });

    // Initialize Chart.js for Analytics
    const ctx = document.getElementById('analyticsChart');
    if(ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Guide Opens',
                    data: [120, 190, 300, 450],
                    borderColor: '#4F46E5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Onboarding Wizard check
    if(!localStorage.getItem('fitsnap_onboarded')) {
        document.getElementById('onboardingWizard').classList.remove('hidden');
    }

    // --- 3-Day Trial Countdown ---
    (function() {
        const TRIAL_KEY = 'fitsnap_trial_start';
        const TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
        let trialStart = localStorage.getItem(TRIAL_KEY);
        if (!trialStart) {
            trialStart = Date.now();
            localStorage.setItem(TRIAL_KEY, trialStart);
        } else {
            trialStart = parseInt(trialStart, 10);
        }
        const trialEnd = trialStart + TRIAL_DURATION_MS;

        function updateCountdown() {
            const el = document.getElementById('trial-countdown');
            if (!el) return;
            const remaining = trialEnd - Date.now();
            if (remaining <= 0) {
                el.textContent = 'Trial expired';
                el.style.color = '#EF4444';
                return;
            }
            const d = Math.floor(remaining / 86400000);
            const h = Math.floor((remaining % 86400000) / 3600000);
            const m = Math.floor((remaining % 3600000) / 60000);
            const s = Math.floor((remaining % 60000) / 1000);
            el.textContent = `${d}d ${h}h ${m}m ${s}s remaining`;
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
    })();
});
