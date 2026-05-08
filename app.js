let currentTheme = 'minimal';
let links = [];
let linkId = 0;

const themes = {
    minimal: {
        bg: '#ffffff', card: '#f8f9fa', text: '#333333', link_bg: '#ffffff',
        link_border: '#e0e0e0', link_text: '#333333', link_hover: '#f0f0f0',
        font: "'Inter', sans-serif", radius: '8px'
    },
    gradient: {
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', card: 'rgba(255,255,255,0.15)',
        text: '#ffffff', link_bg: 'rgba(255,255,255,0.2)', link_border: 'rgba(255,255,255,0.3)',
        link_text: '#ffffff', link_hover: 'rgba(255,255,255,0.3)',
        font: "'Inter', sans-serif", radius: '12px'
    },
    dark: {
        bg: '#0f0f0f', card: '#1a1a1a', text: '#e0e0e0', link_bg: '#222222',
        link_border: '#333333', link_text: '#e0e0e0', link_hover: '#2a2a2a',
        font: "'Inter', sans-serif", radius: '8px'
    },
    neon: {
        bg: '#0a0a0a', card: '#111111', text: '#00ff88', link_bg: '#0a0a0a',
        link_border: '#00ff88', link_text: '#00ff88', link_hover: '#001a0e',
        font: "'Inter', sans-serif", radius: '4px'
    },
    pastel: {
        bg: '#fef6e4', card: '#fff3e0', text: '#5c4033', link_bg: '#ffffff',
        link_border: '#f0d9b5', link_text: '#5c4033', link_hover: '#fff8ef',
        font: "'Inter', sans-serif", radius: '20px'
    }
};

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

function setTheme(name) {
    currentTheme = name;
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-theme="${name}"]`).classList.add('active');
    updatePreview();
}

function addLink() {
    linkId++;
    links.push({ id: linkId, title: '', url: '' });
    renderLinks();
    updatePreview();
}

function removeLink(id) {
    links = links.filter(l => l.id !== id);
    renderLinks();
    updatePreview();
}

function updateLink(id, field, value) {
    const link = links.find(l => l.id === id);
    if (link) link[field] = value;
    updatePreview();
}

function renderLinks() {
    const container = document.getElementById('links-container');
    container.innerHTML = links.map(l => `
        <div class="link-item">
            <input type="text" placeholder="Link Title" value="${l.title}" oninput="updateLink(${l.id},'title',this.value)">
            <input type="text" placeholder="https://..." value="${l.url}" oninput="updateLink(${l.id},'url',this.value)">
            <button class="link-remove" onclick="removeLink(${l.id})">&times;</button>
        </div>
    `).join('');
}

function generateHTML() {
    const name = document.getElementById('profile-name').value || 'Your Name';
    const bio = document.getElementById('profile-bio').value || '';
    const image = document.getElementById('profile-image').value || '';
    const t = themes[currentTheme];

    const linksHTML = links.filter(l => l.title || l.url).map(l => `
        <a href="${l.url || '#'}" target="_blank" rel="noopener" class="bio-link">${l.title || 'Untitled'}</a>
    `).join('\n        ');

    const avatarHTML = image ? `<img src="${image}" alt="${name}" class="avatar">` : `<div class="avatar-placeholder">${name.charAt(0).toUpperCase()}</div>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: ${t.font};
            background: ${t.bg};
            color: ${t.text};
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding: 40px 20px;
        }
        .container { max-width: 420px; width: 100%; text-align: center; }
        .avatar { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; }
        .avatar-placeholder {
            width: 96px; height: 96px; border-radius: 50%; background: ${t.link_bg}; border: 2px solid ${t.link_border};
            display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700;
            margin-bottom: 16px; color: ${t.text};
        }
        h1 { font-size: 1.5rem; margin-bottom: 8px; }
        .bio { font-size: 0.9rem; opacity: 0.8; margin-bottom: 24px; line-height: 1.5; }
        .bio-link {
            display: block; padding: 14px 20px; margin-bottom: 12px; background: ${t.link_bg};
            border: 1px solid ${t.link_border}; border-radius: ${t.radius}; color: ${t.link_text};
            text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: all 0.2s;
        }
        .bio-link:hover { background: ${t.link_hover}; transform: translateY(-1px); }
        .footer { margin-top: 30px; font-size: 0.75rem; opacity: 0.5; }
    </style>
</head>
<body>
    <div class="container">
        ${avatarHTML}
        <h1>${name}</h1>
        ${bio ? `<p class="bio">${bio}</p>` : ''}
        ${linksHTML}
        <p class="footer">Made with Link-in-Bio Generator</p>
    </div>
</body>
</html>`;
}

function updatePreview() {
    const html = generateHTML();
    document.getElementById('preview-frame').srcdoc = html;
}

function downloadHTML() {
    const html = generateHTML();
    const name = document.getElementById('profile-name').value || 'bio-link';
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name.toLowerCase().replace(/\s+/g, '-') + '.html';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded!');
}

function copyHTML() {
    const html = generateHTML();
    navigator.clipboard.writeText(html).then(() => showToast('HTML copied!'));
}

// Initialize with sample data
addLink();
addLink();
addLink();
links[0].title = 'My Website';
links[0].url = 'https://example.com';
links[1].title = 'Follow me on Twitter';
links[1].url = 'https://twitter.com';
links[2].title = 'Subscribe on YouTube';
links[2].url = 'https://youtube.com';
renderLinks();
updatePreview();
