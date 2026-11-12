/* ============================================================
   筑界同盟 · 导航脚本
   功能：主题切换 / 汉堡菜单 / 滚动收缩 / 当前区块高亮
   ============================================================ */
(function () {
    'use strict';

    const root      = document.documentElement;
    const navbar    = document.getElementById('navbar');
    const navMenu   = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    const themeBtn  = document.getElementById('themeToggle');

    /* ---------------- 1. 主题切换 ---------------- */
    function applyTheme(theme) {
        const isDark = theme === 'dark';
        if (isDark) {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        if (themeBtn) {
            themeBtn.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
        }
    }

    applyTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        });
    }

    /* ---------------- 2. 汉堡菜单 ---------------- */
    function setMenu(open) {
        if (!navMenu || !hamburger) return;
        navMenu.classList.toggle('active', open);
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    }

    function closeMenu() { setMenu(false); }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            setMenu(!navMenu.classList.contains('active'));
        });

        // 点击菜单中的链接后收起
        navMenu.addEventListener('click', function (e) {
            if (e.target.closest('a')) closeMenu();
        });

        // Esc 关闭
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });

        // 点击导航外部关闭
        document.addEventListener('click', function (e) {
            if (navMenu.classList.contains('active') && !e.target.closest('.navbar')) {
                closeMenu();
            }
        });

        // 回到桌面尺寸时重置
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) closeMenu();
        });
    }

    /* ---------------- 3. 滚动收缩 ---------------- */
    function onScroll() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------------- 4. 导航高亮 ---------------- */
    const links = Array.prototype.slice.call(
        document.querySelectorAll('.nav-menu a')
    );

    const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

    // 非锚点链接：按文件名匹配（如 about.html）
    links.forEach(function (a) {
        const href = a.getAttribute('href') || '';
        if (href.indexOf('#') !== -1) return;
        const file = href.split('/').pop().toLowerCase();
        if (file === currentPage) a.classList.add('active');
    });

    // 锚点链接：滚动监听（仅当前页面存在的区块参与）
    const hashLinks = links.filter(function (a) {
        return (a.getAttribute('href') || '').indexOf('#') !== -1;
    });

    const sections = hashLinks
        .map(function (a) {
            const id = a.getAttribute('href').split('#')[1];
            return id ? document.getElementById(id) : null;
        })
        .filter(Boolean);

    if (sections.length) {
        const spy = function () {
            const offset = (navbar ? navbar.offsetHeight : 64) + 48;
            const line = window.scrollY + offset;

            let current = sections[0];
            sections.forEach(function (s) {
                if (s.offsetTop <= line) current = s;
            });

            // 滚动到底部时高亮最后一项
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
                current = sections[sections.length - 1];
            }

            links.forEach(function (a) {
                const href = a.getAttribute('href') || '';
                if (href.indexOf('#') === -1) return;
                const id = href.split('#')[1];
                a.classList.toggle('active', id === current.id);
            });
        };

        window.addEventListener('scroll', spy, { passive: true });
        window.addEventListener('resize', spy);
        spy();
    }
})();