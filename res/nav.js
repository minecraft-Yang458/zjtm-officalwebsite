// 导航栏JS：仅处理汉堡菜单折叠（移动端），点击链接后关闭菜单
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // 动画汉堡图标
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(-5px, 6px)' : 'rotate(0)';
            spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(-5px, -6px)' : 'rotate(0)';
        });

        // 点击导航链接后关闭移动菜单
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                // 重置汉堡图标
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'rotate(0)';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'rotate(0)';
            });
        });
    }
});