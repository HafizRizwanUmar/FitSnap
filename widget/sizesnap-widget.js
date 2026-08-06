/**
 * FitSnap Widget - Storefront Script
 * Injected into Shopify theme.
 */

(function() {
    // Default Configuration
    const config = window.FitSnapConfig || {
        buttonText: 'Size Guide',
        accentColor: '#4F46E5',
        buttonStyle: 'filled',
        chartData: {
            title: "Premium Size Chart",
            headers: ["Size", "Chest (cm)", "Waist (cm)"],
            rows: [
                ["S", "90", "76"],
                ["M", "96", "82"],
                ["L", "102", "88"],
                ["XL", "108", "94"]
            ],
            notes: "Fits true to size."
        }
    };

    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .FitSnap-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: inherit;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            border-radius: 8px;
            padding: 10px 16px;
            transition: all 0.2s ease;
            margin: 10px 0;
        }
        .FitSnap-btn.filled {
            background-color: ${config.accentColor};
            color: #fff;
            border: none;
        }
        .FitSnap-btn.filled:hover {
            opacity: 0.9;
        }
        .FitSnap-modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(4px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .FitSnap-modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }
        .FitSnap-modal {
            background: #fff;
            width: 90%;
            max-width: 500px;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            transform: translateY(20px);
            transition: transform 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .FitSnap-modal-overlay.active .FitSnap-modal {
            transform: translateY(0);
        }
        .FitSnap-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 12px;
        }
        .FitSnap-header h2 {
            margin: 0;
            font-size: 20px;
            color: #333;
        }
        .FitSnap-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #888;
        }
        .FitSnap-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }
        .FitSnap-table th, .FitSnap-table td {
            padding: 10px;
            text-align: center;
            border: 1px solid #eee;
            font-size: 14px;
        }
        .FitSnap-table th {
            background: #f9f9f9;
            font-weight: 600;
            color: #333;
        }
        .FitSnap-notes {
            font-size: 13px;
            color: #666;
            background: #f5f5f5;
            padding: 12px;
            border-radius: 8px;
        }
    `;
    document.head.appendChild(style);

    // Create Button
    const btn = document.createElement('button');
    btn.className = `FitSnap-btn ${config.buttonStyle}`;
    btn.innerHTML = `📏 <span>${config.buttonText}</span>`;
    
    // Find injection point (e.g., above add to cart form)
    // For demo purposes, we will append it to a typical form selector or body if not found
    const form = document.querySelector('form[action*="/cart/add"]');
    if (form) {
        form.parentNode.insertBefore(btn, form);
    } else {
        // Fallback for development/testing
        document.body.appendChild(btn);
    }

    // Create Modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'FitSnap-modal-overlay';
    
    let tableHTML = `<table class="FitSnap-table"><thead><tr>`;
    config.chartData.headers.forEach(h => tableHTML += `<th>${h}</th>`);
    tableHTML += `</tr></thead><tbody>`;
    config.chartData.rows.forEach(row => {
        tableHTML += `<tr>`;
        row.forEach(cell => tableHTML += `<td>${cell}</td>`);
        tableHTML += `</tr>`;
    });
    tableHTML += `</tbody></table>`;

    modalOverlay.innerHTML = `
        <div class="FitSnap-modal">
            <div class="FitSnap-header">
                <h2>${config.chartData.title}</h2>
                <button class="FitSnap-close">&times;</button>
            </div>
            <div class="FitSnap-body">
                ${tableHTML}
                ${config.chartData.notes ? `<div class="FitSnap-notes">ℹ️ ${config.chartData.notes}</div>` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    // Event Listeners
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.classList.add('active');
    });

    const closeBtn = modalOverlay.querySelector('.FitSnap-close');
    closeBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
        if(e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
})();
