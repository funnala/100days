class MemoryBook {
    constructor() {
        this.pages = [];
        this.currentPage = 0;
        this.isAnimating = false;
        this.totalPages = 0;
        
        this.init();
    }

    init() {
        this.pages = Array.from(document.querySelectorAll('.page'));
        this.totalPages = this.pages.length;
        
        if (this.pages.length > 0) {
            this.pages[0].classList.add('active');
        }
        
        this.setupEventListeners();
        this.createFallingLeaves();
        this.createFloatingDecorations();
        this.createSparkles();
        this.initClickFireworks();
        this.initMusicControl();
        
        console.log('💚 百天纪念网页已加载完成');
        console.log(`共 ${this.totalPages} 页`);
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        this.pages.forEach((page, index) => {
            page.addEventListener('click', (e) => {
                if (!this.isAnimating && index === this.currentPage) {
                    this.nextPage();
                }
            });
        });
        
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let isScrolling = false;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isScrolling = false;
        }, false);
        
        document.addEventListener('touchmove', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            const diffY = Math.abs(touchStartY - touchEndY);
            if (diffY > 10) {
                isScrolling = true;
            }
        }, false);
        
        document.addEventListener('touchend', (e) => {
            if (isScrolling) {
                return;
            }
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, false);
    }

    handleKeyboard(e) {
        if (this.isAnimating) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
                e.preventDefault();
                this.nextPage();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.prevPage();
                break;
        }
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextPage();
            } else {
                this.prevPage();
            }
        }
    }

    goToPage(pageNum) {
        if (this.isAnimating || pageNum === this.currentPage) return;
        if (pageNum < 0 || pageNum >= this.totalPages) return;
        
        this.isAnimating = true;
        
        const currentPageEl = this.pages[this.currentPage];
        const nextPageEl = this.pages[pageNum];
        
        this.resetPageAnimations(nextPageEl);
        
        currentPageEl.classList.remove('active');
        currentPageEl.classList.add('flipping');
        
        setTimeout(() => {
            currentPageEl.classList.remove('flipping');
            currentPageEl.classList.add('flipped');
            
            nextPageEl.classList.add('active');
            
            this.triggerPageAnimations(nextPageEl);
            this.triggerBackgroundParticles(pageNum);
            
            this.currentPage = pageNum;
            this.isAnimating = false;
        }, 800);
    }
    
    resetPageAnimations(pageEl) {
        const animatedElements = pageEl.querySelectorAll('*');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; 
            el.style.animation = null;
        });
    }
    
    triggerBackgroundParticles(pageIndex) {
        const container = document.getElementById('sparkles');
        if (!container) return;
        
        const extraParticles = 10;
        for (let i = 0; i < extraParticles; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'sparkle-particle';
                particle.style.left = (Math.random() * 100) + '%';
                particle.style.top = (Math.random() * 100) + '%';
                particle.style.animationDuration = (1 + Math.random() * 2) + 's';
                particle.style.width = (4 + Math.random() * 12) + 'px';
                particle.style.height = particle.style.width;
                
                const colors = ['#FFD700', '#98D8AA', '#FFB6C1', '#87CEEB'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.background = `radial-gradient(circle, ${randomColor} 0%, transparent 70%)`;
                
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 3000);
            }, i * 100);
        }
    }

    triggerPageAnimations(pageEl) {
        const animatedElements = pageEl.querySelectorAll('.memory-photo, .stat-card, .future-item, .love-confession, .memory-text');
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.goToPage(this.currentPage + 1);
        }
    }

    prevPage() {
        if (this.currentPage > 0) {
            this.goToPage(this.currentPage - 1);
        }
    }

    createFallingLeaves() {
        const leavesContainer = document.getElementById('fallingLeaves');
        if (!leavesContainer) return;
        
        const leafEmojis = ['🍃', '🍀', '🌿', '🌱', '💕', '💖', '💗', '💝', '🌸', '💐'];
        const numberOfLeaves = 20;
        
        for (let i = 0; i < numberOfLeaves; i++) {
            setTimeout(() => {
                this.createLeaf(leavesContainer, leafEmojis);
            }, i * 600);
        }
        
        setInterval(() => {
            if (document.querySelectorAll('.leaf').length < 15) {
                this.createLeaf(leavesContainer, leafEmojis);
            }
        }, 1500);
    }

    createLeaf(container, emojis) {
        const leaf = document.createElement('div');
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        leaf.textContent = emoji;
        
        const isHeart = ['💕', '💖', '💗', '💝'].includes(emoji);
        leaf.className = isHeart ? 'leaf heart' : 'leaf';
        
        const startPosition = Math.random() * window.innerWidth;
        leaf.style.left = startPosition + 'px';
        
        const duration = isHeart ? 10 + Math.random() * 3 : 8 + Math.random() * 4;
        const size = isHeart ? 18 + Math.random() * 12 : 20 + Math.random() * 15;
        
        leaf.style.fontSize = size + 'px';
        leaf.style.animationDuration = duration + 's';
        leaf.style.animationDelay = (Math.random() * 2) + 's';
        
        container.appendChild(leaf);
        
        setTimeout(() => {
            if (leaf.parentNode) {
                leaf.parentNode.removeChild(leaf);
            }
        }, duration * 1000);
    }

    createFloatingDecorations() {
        const container = document.getElementById('floatingDecorations');
        if (!container) return;
        
        this.floatingDecorations = [];
        const decorations = [
            { emoji: '💕', class: 'heart-particle', count: 8 },
            { emoji: '🌸', class: 'flower-particle', count: 6 },
            { emoji: '⭐', class: 'star-particle', count: 6 },
            { emoji: '🌈', class: 'rainbow-particle', count: 2, isElement: true },
            { emoji: '🫧', class: 'bubble-particle', count: 4, isElement: true }
        ];
        
        decorations.forEach(item => {
            for (let i = 0; i < item.count; i++) {
                setTimeout(() => {
                    if (item.isElement) {
                        const el = document.createElement('div');
                        el.className = `floating-item ${item.class}`;
                        el.style.position = 'fixed';
                        
                        const position = this.getEdgePosition();
                        el.style.left = position.x + 'px';
                        el.style.top = position.y + 'px';
                        
                        el.style.animationDelay = Math.random() * 5 + 's';
                        if (item.class === 'rainbow-particle') {
                            el.style.width = (40 + Math.random() * 40) + 'px';
                            el.style.height = (20 + Math.random() * 20) + 'px';
                        } else {
                            el.style.width = (30 + Math.random() * 30) + 'px';
                            el.style.height = (30 + Math.random() * 30) + 'px';
                        }
                        container.appendChild(el);
                        this.floatingDecorations.push(el);
                    } else {
                        const emoji = document.createElement('div');
                        emoji.className = `floating-item ${item.class}`;
                        emoji.textContent = item.emoji;
                        emoji.style.position = 'fixed';
                        
                        const position = this.getEdgePosition();
                        emoji.style.left = position.x + 'px';
                        emoji.style.top = position.y + 'px';
                        
                        emoji.style.fontSize = (16 + Math.random() * 12) + 'px';
                        emoji.style.animationDelay = Math.random() * 5 + 's';
                        container.appendChild(emoji);
                        this.floatingDecorations.push(emoji);
                    }
                    
                    this.animateFloatingItem(this.floatingDecorations[this.floatingDecorations.length - 1]);
                }, i * 300);
            }
        });
    }

    getEdgePosition() {
        const edge = Math.floor(Math.random() * 4);
        const bookRect = document.querySelector('.book')?.getBoundingClientRect();
        const margin = 100;
        
        switch(edge) {
            case 0:
                return { x: Math.random() * window.innerWidth, y: -50 };
            case 1:
                return { x: window.innerWidth + 50, y: Math.random() * window.innerHeight };
            case 2:
                return { x: Math.random() * window.innerWidth, y: window.innerHeight + 50 };
            case 3:
                return { x: -50, y: Math.random() * window.innerHeight };
        }
    }

    animateFloatingItem(element) {
        const animate = () => {
            if (!element.parentNode) return;
            
            const currentX = parseFloat(element.style.left);
            const currentY = parseFloat(element.style.top);
            const duration = 15000 + Math.random() * 10000;
            
            const targetX = Math.random() * window.innerWidth;
            const targetY = Math.random() * window.innerHeight;
            
            const startTime = Date.now();
            const startX = currentX;
            const startY = currentY;
            
            const move = () => {
                if (!element.parentNode) return;
                
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                const newX = startX + (targetX - startX) * easeProgress;
                const newY = startY + (targetY - startY) * easeProgress;
                
                element.style.left = newX + 'px';
                element.style.top = newY + 'px';
                
                if (progress < 1) {
                    requestAnimationFrame(move);
                } else {
                    setTimeout(() => animate(), 2000);
                }
            };
            
            requestAnimationFrame(move);
        };
        
        setTimeout(() => animate(), Math.random() * 5000);
    }

    createSparkles() {
        const container = document.getElementById('sparkles');
        if (!container) return;
        
        this.sparkles = [];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle-particle';
                sparkle.style.position = 'fixed';
                
                const position = this.getEdgePosition();
                sparkle.style.left = position.x + 'px';
                sparkle.style.top = position.y + 'px';
                
                sparkle.style.animationDelay = Math.random() * 3 + 's';
                sparkle.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
                sparkle.style.width = (3 + Math.random() * 8) + 'px';
                sparkle.style.height = sparkle.style.width;
                container.appendChild(sparkle);
                this.sparkles.push(sparkle);
            }, i * 200);
        }
    }

    initMemoryGame() {
        const board = document.getElementById('memoryBoard');
        const restartBtn = document.getElementById('restartBtn');
        const gameTrigger = document.getElementById('gameTrigger');
        const gameModal = document.getElementById('gameModal');
        const closeBtn = document.getElementById('closeGame');
        
        if (!board || !restartBtn) return;
        
        if (gameTrigger && gameModal) {
            gameTrigger.addEventListener('click', () => {
                gameModal.classList.add('active');
                this.resetGame();
            });
        }
        
        if (closeBtn && gameModal) {
            closeBtn.addEventListener('click', () => {
                gameModal.classList.remove('active');
            });
            
            gameModal.addEventListener('click', (e) => {
                if (e.target === gameModal) {
                    gameModal.classList.remove('active');
                }
            });
        }
        
        this.gameState = {
            flippedCards: [],
            matchedPairs: 0,
            moves: 0,
            startTime: null,
            timer: null,
            isLocked: false
        };
        
        restartBtn.addEventListener('click', () => this.resetGame());
        
        board.querySelectorAll('.memory-card').forEach(card => {
            card.addEventListener('click', () => this.flipCard(card));
        });
        
        this.resetGame();
    }

    flipCard(card) {
        if (this.gameState.isLocked) return;
        if (card.classList.contains('flipped')) return;
        if (card.classList.contains('matched')) return;
        
        if (!this.gameState.startTime) {
            this.gameState.startTime = Date.now();
            this.startTimer();
        }
        
        card.classList.add('flipped');
        this.gameState.flippedCards.push(card);
        
        if (this.gameState.flippedCards.length === 2) {
            this.gameState.moves++;
            this.updateStats();
            this.checkMatch();
        }
    }

    checkMatch() {
        this.gameState.isLocked = true;
        const [card1, card2] = this.gameState.flippedCards;
        
        if (card1.dataset.type === card2.dataset.type) {
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.gameState.matchedPairs++;
                this.gameState.flippedCards = [];
                this.gameState.isLocked = false;
                
                if (this.gameState.matchedPairs === 6) {
                    this.gameWin();
                }
            }, 500);
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.gameState.flippedCards = [];
                this.gameState.isLocked = false;
            }, 1000);
        }
    }

    updateStats() {
        const movesEl = document.getElementById('gameMoves');
        if (movesEl) {
            movesEl.textContent = this.gameState.moves;
        }
    }

    startTimer() {
        const timeEl = document.getElementById('gameTime');
        if (!timeEl) return;
        
        this.gameState.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.gameState.startTime) / 1000);
            timeEl.textContent = elapsed;
        }, 1000);
    }

    stopTimer() {
        if (this.gameState.timer) {
            clearInterval(this.gameState.timer);
            this.gameState.timer = null;
        }
    }

    gameWin() {
        this.stopTimer();
        
        setTimeout(() => {
            const overlay = document.getElementById('celebrationOverlay');
            const fireworksContainer = document.getElementById('fireworksContainer');
            const messageContainer = document.querySelector('.final-message-container');
            const closeBtn = document.getElementById('closeCelebration');
            
            if (overlay) {
                overlay.classList.add('active');
            }
            
            // 显示文字
            setTimeout(() => {
                if (messageContainer) {
                    messageContainer.classList.add('visible');
                }
            }, 500);
            
            // 发射烟花
            this.startFireworksShow(fireworksContainer);
            
            // 启用点击烟花
            this.enableClickFireworks();
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    overlay.classList.remove('active');
                    setTimeout(() => {
                        this.closeGame();
                    }, 500);
                });
            }
        }, 500);
    }
    
    startFireworksShow(container) {
        if (!container) return;
        
        // 15秒烟花表演
        const duration = 15000;
        const interval = 300;
        let elapsed = 0;
        
        const fireworkInterval = setInterval(() => {
            elapsed += interval;
            if (elapsed >= duration) {
                clearInterval(fireworkInterval);
                return;
            }
            
            // 随机位置发射烟花
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight * 0.6);
            
            this.createFirework(container, x, y);
        }, interval);
        
        // 立即发射几个
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * (window.innerHeight * 0.6);
                this.createFirework(container, x, y);
            }, i * 200);
        }
    }
    
    createFirework(container, x, y) {
        if (!container) return;
        
        const colors = [
            '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', 
            '#9b59b6', '#ff69b4', '#00ff7f', '#ff6347',
            '#ffcc00', '#ff3366', '#00ccff', '#99ff66'
        ];
        const emojis = ['✨', '🌟', '💫', '🎉', '🎊', '💕', '💖', '⭐', '💝', '💗'];
        
        const mainColor = colors[Math.floor(Math.random() * colors.length)];
        
        // 创建上升粒子（模拟烟花发射）
        const trailCount = 15;
        for (let i = 0; i < trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'firework-particle';
            trail.style.backgroundColor = mainColor;
            trail.style.width = '6px';
            trail.style.height = '6px';
            trail.style.left = x + 'px';
            trail.style.top = y + 'px';
            container.appendChild(trail);
            
            const duration = 300 + Math.random() * 200;
            const startTime = Date.now();
            const offsetY = -30 - Math.random() * 50;
            
            const animateTrail = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                if (progress < 1) {
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    trail.style.top = (y + offsetY * easeOut) + 'px';
                    trail.style.opacity = 1 - progress;
                    trail.style.transform = `scale(${1 - progress * 0.5})`;
                    requestAnimationFrame(animateTrail);
                } else {
                    trail.remove();
                }
            };
            requestAnimationFrame(animateTrail);
        }
        
        // 主爆炸粒子
        const particleCount = 80;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 4 + Math.random() * 8;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 ${15 + Math.random() * 15}px ${color}, 0 0 ${30 + Math.random() * 20}px ${color}40`;
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 60 + Math.random() * 150;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance + 20;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            container.appendChild(particle);
            
            const duration = 1200 + Math.random() * 600;
            const startTime = Date.now();
            const gravity = 0.3;
            const velocity = 2;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                if (progress < 1) {
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const currentX = x + tx * easeOut;
                    const arcY = Math.sin(progress * Math.PI) * 30;
                    const currentY = y + ty * easeOut + arcY + (progress * progress * 100 * gravity);
                    const scale = 1 - progress * 0.7;
                    const opacity = 1 - progress;
                    
                    particle.style.left = currentX + 'px';
                    particle.style.top = currentY + 'px';
                    particle.style.transform = `scale(${scale})`;
                    particle.style.opacity = opacity;
                    
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
        
        // 内层密集粒子
        const innerCount = 30;
        for (let i = 0; i < innerCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            
            const color = mainColor;
            const size = 3 + Math.random() * 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
            
            const angle = (Math.PI * 2 * i) / innerCount;
            const distance = 20 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            container.appendChild(particle);
            
            const duration = 800 + Math.random() * 400;
            const startTime = Date.now();
            
            const animateInner = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                if (progress < 1) {
                    const easeOut = 1 - Math.pow(1 - progress, 4);
                    const currentX = x + tx * easeOut;
                    const currentY = y + ty * easeOut;
                    const scale = 1.5 - progress * 0.5;
                    const opacity = 1 - progress;
                    
                    particle.style.left = currentX + 'px';
                    particle.style.top = currentY + 'px';
                    particle.style.transform = `scale(${scale})`;
                    particle.style.opacity = opacity;
                    
                    requestAnimationFrame(animateInner);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animateInner);
        }
        
        // emoji粒子
        const emojiCount = 12;
        for (let i = 0; i < emojiCount; i++) {
            const emoji = document.createElement('span');
            emoji.className = 'firework-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = x + 'px';
            emoji.style.top = y + 'px';
            emoji.style.fontSize = (20 + Math.random() * 16) + 'px';
            container.appendChild(emoji);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 120;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            emoji.style.setProperty('--tx', tx + 'px');
            emoji.style.setProperty('--ty', ty + 'px');
            
            setTimeout(() => {
                emoji.remove();
            }, 1800);
        }
    }
    
    initClickFireworks() {
        // 初始化但不启用，等待游戏完成后再启用
        this.fireworksEnabled = false;
        this.clickContainer = document.getElementById('clickFireworks');
    }
    
    enableClickFireworks() {
        if (!this.clickContainer) return;
        this.fireworksEnabled = true;
        
        const handleClick = (e) => {
            if (!this.fireworksEnabled) return;
            
            if (e.target.tagName === 'BUTTON' || 
                e.target.closest('button') ||
                e.target.closest('.card')) {
                return;
            }
            
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const offsetX = (Math.random() - 0.5) * 80;
                    const offsetY = (Math.random() - 0.5) * 80;
                    this.createFirework(this.clickContainer, e.clientX + offsetX, e.clientY + offsetY);
                }, i * 80);
            }
        };
        
        document.addEventListener('click', handleClick);
    }

    createFlyingParticles(container, targetElement) {
        if (!container) return;
        
        container.innerHTML = '';
        
        const rosePositions = [
            { angle: 0, radius: 0 },
            { angle: 45, radius: 50 },
            { angle: 90, radius: 50 },
            { angle: 135, radius: 50 },
            { angle: 180, radius: 50 },
            { angle: 225, radius: 50 },
            { angle: 270, radius: 50 },
            { angle: 315, radius: 50 },
            { angle: 22, radius: 100 },
            { angle: 67, radius: 100 },
            { angle: 112, radius: 100 },
            { angle: 157, radius: 100 },
            { angle: 202, radius: 100 },
            { angle: 247, radius: 100 },
            { angle: 292, radius: 100 },
            { angle: 337, radius: 100 },
            { angle: 15, radius: 150 },
            { angle: 45, radius: 150 },
            { angle: 75, radius: 150 },
            { angle: 105, radius: 150 },
            { angle: 135, radius: 150 },
            { angle: 165, radius: 150 },
            { angle: 195, radius: 150 },
            { angle: 225, radius: 150 },
            { angle: 255, radius: 150 },
            { angle: 285, radius: 150 },
            { angle: 315, radius: 150 },
            { angle: 345, radius: 150 },
            { angle: 10, radius: 200 },
            { angle: 30, radius: 200 },
            { angle: 50, radius: 200 },
            { angle: 70, radius: 200 },
            { angle: 90, radius: 200 },
            { angle: 110, radius: 200 },
            { angle: 130, radius: 200 },
            { angle: 150, radius: 200 },
            { angle: 170, radius: 200 },
            { angle: 190, radius: 200 },
            { angle: 210, radius: 200 },
            { angle: 230, radius: 200 },
            { angle: 250, radius: 200 },
            { angle: 270, radius: 200 },
            { angle: 290, radius: 200 },
            { angle: 310, radius: 200 },
            { angle: 330, radius: 200 },
            { angle: 350, radius: 200 },
            { angle: 5, radius: 250 },
            { angle: 25, radius: 250 },
            { angle: 45, radius: 250 },
            { angle: 65, radius: 250 },
            { angle: 85, radius: 250 },
            { angle: 105, radius: 250 },
            { angle: 125, radius: 250 },
            { angle: 145, radius: 250 },
            { angle: 165, radius: 250 },
            { angle: 185, radius: 250 },
            { angle: 205, radius: 250 },
            { angle: 225, radius: 250 },
            { angle: 245, radius: 250 },
            { angle: 265, radius: 250 },
            { angle: 285, radius: 250 },
            { angle: 305, radius: 250 },
            { angle: 325, radius: 250 },
            { angle: 345, radius: 250 },
            { angle: 0, radius: 300 },
            { angle: 20, radius: 300 },
            { angle: 40, radius: 300 },
            { angle: 60, radius: 300 },
            { angle: 80, radius: 300 },
            { angle: 100, radius: 300 },
            { angle: 120, radius: 300 },
            { angle: 140, radius: 300 },
            { angle: 160, radius: 300 },
            { angle: 180, radius: 300 },
            { angle: 200, radius: 300 },
            { angle: 220, radius: 300 },
            { angle: 240, radius: 300 },
            { angle: 260, radius: 300 },
            { angle: 280, radius: 300 },
            { angle: 300, radius: 300 },
            { angle: 320, radius: 300 },
            { angle: 340, radius: 300 }
        ];
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < 80; i++) {
            const particle = document.createElement('span');
            const isRose = Math.random() < 0.85;
            
            const emojis = isRose ? ['🌹', '🌹', '🌹', '🌹', '🌹', '💐'] : ['💕', '💖', '💗', '✨'];
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.className = 'flying-particle';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.max(window.innerWidth, window.innerHeight) * 0.8;
            const startX = centerX + Math.cos(angle) * distance;
            const startY = centerY + Math.sin(angle) * distance;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            
            const targetPos = rosePositions[i % rosePositions.length];
            const targetX = (targetPos.radius * Math.cos(targetPos.angle * Math.PI / 180));
            const targetY = (targetPos.radius * Math.sin(targetPos.angle * Math.PI / 180));
            
            particle.style.setProperty('--tx', targetX + 'px');
            particle.style.setProperty('--ty', targetY + 'px');
            
            particle.style.animationDelay = (i * 0.03) + 's';
            particle.style.fontSize = (Math.random() * 10 + 20) + 'px';
            
            container.appendChild(particle);
        }
        
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }

    closeGame() {
        const gameModal = document.getElementById('gameModal');
        if (gameModal) {
            gameModal.classList.remove('active');
        }
        this.resetGame();
    }

    resetGame() {
        this.stopTimer();
        
        const board = document.getElementById('memoryBoard');
        const message = document.getElementById('gameMessage');
        const movesEl = document.getElementById('gameMoves');
        const timeEl = document.getElementById('gameTime');
        
        if (message) message.style.display = 'none';
        if (movesEl) movesEl.textContent = '0';
        if (timeEl) timeEl.textContent = '0';
        
        this.gameState = {
            flippedCards: [],
            matchedPairs: 0,
            moves: 0,
            startTime: null,
            timer: null,
            isLocked: false
        };
        
        if (board) {
            const cards = Array.from(board.querySelectorAll('.memory-card'));
            this.shuffleArray(cards);
            
            cards.forEach((card, index) => {
                card.classList.remove('flipped', 'matched');
                card.style.order = index;
            });
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    initMusicControl() {
        const musicBtn = document.getElementById('musicBtn');
        const backgroundMusic = document.getElementById('backgroundMusic');
        
        if (!musicBtn || !backgroundMusic) return;
        
        let isPlaying = false;
        
        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                backgroundMusic.pause();
                musicBtn.classList.remove('playing');
                isPlaying = false;
            } else {
                backgroundMusic.play().then(() => {
                    musicBtn.classList.add('playing');
                    isPlaying = true;
                }).catch(err => {
                    console.log('音乐播放失败:', err);
                });
            }
        });
        
        backgroundMusic.addEventListener('ended', () => {
            musicBtn.classList.remove('playing');
            isPlaying = false;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.memoryBook = new MemoryBook();
    setTimeout(() => {
        window.memoryBook.initMemoryGame();
    }, 1000);
});

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
