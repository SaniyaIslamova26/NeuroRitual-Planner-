class NeuroRitualPlanner {
    constructor() {
        this.selectors = this.cacheSelectors();
        this.constants = this.defineConstants();
        this.state = this.loadState();
        this.chartInstances = { line: null, donut: null };
        this.musicSearchTimer = null;
        this.bindEvents();
        this.applyInitialTheme();
        this.populateHabitSelector();
        this.populatePlaylists();
        this.renderAll();
        this.registerServiceWorker();
    }

    cacheSelectors() {
        return {
            form: document.getElementById('habit-form'),
            habitSelector: document.getElementById('habit-selector'),
            deleteHabitBtn: document.getElementById('delete-habit'),
            heroPlanTitle: document.getElementById('hero-plan-title'),
            heroPlanCopy: document.getElementById('hero-plan-copy'),
            heroPlanMood: document.getElementById('hero-plan-mood'),
            heroFacts: document.getElementById('habit-facts'),
            planDetails: document.getElementById('plan-details'),
            remindersList: document.getElementById('reminders-list'),
            personalFacts: document.getElementById('habit-personal-facts'),
            progressGrid: document.getElementById('progress-grid'),
            progressScore: document.getElementById('progress-score'),
            chartCanvas: document.getElementById('progress-chart'),
            ringCanvas: document.getElementById('progress-ring'),
            insightText: document.getElementById('insight-text'),
            leaderboard: document.getElementById('habit-leaderboard'),
            musicSearch: document.getElementById('music-search'),
            summaryPeriod: document.getElementById('summary-period'),
            summaryMetrics: document.getElementById('summary-metrics'),
            themeToggle: document.getElementById('theme-toggle'),
            notificationToggle: document.getElementById('notification-toggle'),
            notificationStatus: document.getElementById('notification-status'),
            installBtn: document.getElementById('install-app-btn'),
            relaxSelect: document.getElementById('relax-playlist'),
            relaxPlayer: document.getElementById('relax-player'),
            focusSelect: document.getElementById('focus-playlist'),
            focusPlayer: document.getElementById('focus-player'),
            metaTheme: document.getElementById('meta-theme-color')
        };
    }

    defineConstants() {
        return {
            storageKey: 'neuro-ritual-planner-data',
            heroMoodStates: [
                'Mood: фокус и спокойствие  C',
                'Mood: энергия созидания  +',
                'Mood: осознанный апгрейд  +',
                'Mood: режим исследователя  %',
            ],
            playlistOptions: {
                relax: [
                    { label: 'Lofi Breathing . calm', src: 'https://cdn.pixabay.com/audio/2023/09/07/audio_2c7a8dc26b6.mp3' },
                    { label: 'Yoga Sunrise . ambient', src: 'https://cdn.pixabay.com/audio/2023/05/01/audio_8d144ac71e.mp3' },
                    { label: 'After Work Unwind . chill', src: 'https://cdn.pixabay.com/audio/2023/02/27/audio_f5b389af6a.mp3' },
                    { label: 'Deep Focus Rain', src: 'https://cdn.pixabay.com/audio/2022/08/04/audio_casdbbfd6.mp3' },
                    { label: 'Midnight Bloom', src: 'https://cdn.pixabay.com/audio/2023/04/20/audio_b9a6e0ala3.mp3' },
                    { label: 'Restorative Yoga Bells', src: 'https://cdn.pixabay.com/audio/2022/03/11/audio_1f2ac5f4f6.mp3' },
                    { label: 'Crystal Breaths', src: 'https://cdn.pixabay.com/audio/2022/03/11/audio_59486dd94.mp3' },
                    { label: 'Soft Ocean Pulse', src: 'https://cdn.pixabay.com/audio/2022/03/11/audio_f8afb7dd2.mp3' },
                    { label: 'Dreaming Lights', src: 'https://cdn.pixabay.com/audio/2022/03/15/audio_4830fdb3a7.mp3' },
                    { label: 'Balanced Aura', src: 'https://cdn.pixabay.com/audio/2022/03/11/audio_470df793d8.mp3' },
                    { label: 'Serenity Ritual', src: 'https://cdn.pixabay.com/audio/2022/10/02/audio_0c9b96dblc.mp3' },
                    { label: 'Lotus Garden', src: 'https://cdn.pixabay.com/audio/2022/03/11/audio_ebf842d94b.mp3' },
                    { label: 'Breath of Dawn', src: 'https://cdn.pixabay.com/audio/2023/01/15/audio_86d9f1bd7a.mp3' },
                    { label: 'Calm Shoreline', src: 'https://cdn.pixabay.com/audio/2023/04/27/audio_50adde0045.mp3' },
                    { label: 'Inner Orbit', src: 'https://cdn.pixabay.com/audio/2023/02/02/audio_2529ffa56c.mp3' },
                    { label: 'Night Bloom Lofi', src: 'https://cdn.pixabay.com/audio/2023/10/01/audio_091f2496ef.mp3' },
                    { label: 'Zen Garden Synth', src: 'https://cdn.pixabay.com/audio/2022/03/11/audio_927d0b2def.mp3' },
                    { label: 'Slow River', src: 'https://cdn.pixabay.com/audio/2023/07/17/audio_88d06c938c.mp3' },
                    { label: 'Blue Horizon', src: 'https://cdn.pixabay.com/audio/2022/03/11/audio_5715ee99cb.mp3' },
                    { label: 'Meditative Air', src: 'https://cdn.pixabay.com/audio/2023/01/04/audio_1901397dbc.mp3' },
                    { label: 'Gentle Piano Mist', src: 'https://cdn.pixabay.com/audio/2022/12/22/audio_6alcdbdsd3.mp3' },
                    { label: 'Himalayan Bowls', src: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c26cbe1931.mp3' },
                    { label: 'Moon Dust Flow', src: 'https://cdn.pixabay.com/audio/2023/03/06/audio_60fb6f12e8.mp3' },
                    { label: 'Reiki Morning', src: 'https://cdn.pixabay.com/audio/2023/05/15/audio_c64fdf75f8.mp3' }
                ],
                focus: [
                    { label: 'Nebula Silence . chill focus', src: 'https://cdn.pixabay.com/audio/2023/08/30/audio_05f25a7887.mp3' },
                    { label: 'Run & Rise . cardio', src: 'https://cdn.pixabay.com/audio/2023/06/16/audio_56f74ed041.mp3' },
                    { label: 'Productive Pulse . deep work', src: 'https://cdn.pixabay.com/audio/2023/09/30/audio_137ec66216.mp3' },
                    { label: 'Gym Motivation . bass', src: 'https://cdn.pixabay.com/audio/2022/03/22/audio_c5bf3ea71e.mp3' },
                    { label: 'Sprint Method', src: 'https://cdn.pixabay.com/audio/2023/01/03/audio_ebc2e60094.mp3' },
                    { label: 'Alpha Coding', src: 'https://cdn.pixabay.com/audio/2022/02/17/audio_4d4a14f0f3.mp3' },
                    { label: 'Neon Runner', src: 'https://cdn.pixabay.com/audio/2023/09/08/audio_4d3fbda4e3.mp3' },
                    { label: 'Focus Reactor', src: 'https://cdn.pixabay.com/audio/2023/03/17/audio_e2d018e7aa.mp3' },
                    { label: 'Cycling Power', src: 'https://cdn.pixabay.com/audio/2022/02/17/audio_1aaf24a160.mp3' },
                    { label: 'Creative Rush', src: 'https://cdn.pixabay.com/audio/2022/01/20/audio_8b9od79d9a.mp3' },
                    { label: 'Hustle Vibes', src: 'https://cdn.pixabay.com/audio/2022/03/19/audio_81da86c3a3.mp3' },
                    { label: 'Abstract Bass Flow', src: 'https://cdn.pixabay.com/audio/2022/05/07/audio_7b69dd54f.mp3' },
                    { label: 'Kinetic Motion', src: 'https://cdn.pixabay.com/audio/2023/01/20/audio_220ff94B8c.mp3' },
                    { label: 'Techno Sprint', src: 'https://cdn.pixabay.com/audio/2023/05/29/audio_18fb1ec212.mp3' },
                    { label: 'Planet Runner', src: 'https://cdn.pixabay.com/audio/2022/05/16/audio_e6cc2b149c.mp3' },
                    { label: 'Drone Momentum', src: 'https://cdn.pixabay.com/audio/2022/02/10/audio_balfdf7e8a.mp3' },
                    { label: 'Steel Grit', src: 'https://cdn.pixabay.com/audio/2021/09/01/audio_2de329f1d8.mp3' },
                    { label: 'NeuroBoost 128bpm', src: 'https://cdn.pixabay.com/audio/2021/09/01/audio_23612ccc5d.mp3' },
                    { label: 'Pulse Flow HIIT', src: 'https://cdn.pixabay.com/audio/2022/11/23/audio_c28g991690.mp3' },
                    { label: 'Prime Focus Lofi', src: 'https://cdn.pixabay.com/audio/2023/08/17/audio_f2b96a760.mp3' },
                    { label: 'Clarity Engine', src: 'https://cdn.pixabay.com/audio/2022/02/17/audio_6d3858f8fa.mp3' },
                    { label: 'Ultralight Sprint', src: 'https://cdn.pixabay.com/audio/2022/06/10/audio_77e3b8249e.mp3' },
                    { label: 'Night Shift Coding', src: 'https://cdn.pixabay.com/audio/2022/03/11/audio_120f8fd44c.mp3' },
                    { label: 'Momentum Drums', src: 'https://cdn.pixabay.com/audio/2022/11/12/audio_61a775888b.mp3' },
                    { label: 'Flowfield Beats', src: 'https://cdn.pixabay.com/audio/2022/11/12/audio_c546edeldf.mp3' }
                ]
            }
        };
    }

    loadState() {
        try {
            const data = JSON.parse(localStorage.getItem(this.constants.storageKey));
            if (data) return data;
        } catch (error) {
            console.error('Ошибка чтения state', error);
        }
        return {
            habits: [],
            activeHabitId: null,
            settings: {
                theme: 'dark',
                notificationsEnabled: true,
                relaxPlaylist: null,
                focusPlaylist: null,
                musicSearch: ''
            }
        };
    }

    saveState() {
        localStorage.setItem(this.constants.storageKey, JSON.stringify(this.state));
    }

    bindEvents() {
        this.selectors.form.addEventListener('submit', (event) => this.handleFormSubmit(event));
        this.selectors.habitSelector.addEventListener('change', (event) => this.handleHabitChange(event));
        this.selectors.deleteHabitBtn.addEventListener('click', () => this.deleteActiveHabit());
        this.selectors.themeToggle.addEventListener('change', (event) => this.handleThemeToggle(event));
        this.selectors.notificationToggle.addEventListener('change', (event) => this.handleNotificationToggle(event));
        this.selectors.relaxSelect.addEventListener('change', (event) => this.handlePlaylistChange('relax', event.target.value));
        this.selectors.focusSelect.addEventListener('change', (event) => this.handlePlaylistChange('focus', event.target.value));
        this.selectors.installBtn.addEventListener('click', () => this.promptInstall());
        this.selectors.musicSearch.addEventListener('input', (event) => this.handleMusicSearch(event));
        this.selectors.summaryPeriod.addEventListener('change', () => this.renderSummary());
        document.addEventListener('visibilitychange', () => this.refreshOnVisibility());
        window.addEventListener('beforeunload', () => this.saveState());
    }

    applyInitialTheme() {
        const theme = this.state.settings.theme;
        document.body.dataset.theme = theme;
        document.documentElement.dataset.theme = theme;
        this.selectors.themeToggle.checked = theme === 'light';
        this.updateMetaTheme(theme);
    }

    updateMetaTheme(theme) {
        const color = theme === 'light' ? '#f3ff5f9' : '#0b0f17';
        this.selectors.metaTheme.setAttribute('content', color);
    }

    populateHabitSelector() {
        const select = this.selectors.habitSelector;
        select.innerHTML = '';
        if (!this.state.habits.length) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Нет активных привычек';
            select.appendChild(option);
            return;
        }
        this.state.habits.forEach((habit) => {
            const option = document.createElement('option');
            option.value = habit.id;
            option.textContent = habit.name;
            if (habit.id === this.state.activeHabitId) option.selected = true;
            select.appendChild(option);
        });
    }

    populatePlaylists() {
        const query = (this.state.settings.musicSearch ?? '').trim().toLowerCase();
        if (this.selectors.musicSearch) {
            this.selectors.musicSearch.value = this.state.settings.musicSearch ?? '';
        }
        ['relax', 'focus'].forEach((type) => {
            const select = type === 'relax' ? this.selectors.relaxSelect : this.selectors.focusSelect;
            const player = type === 'relax' ? this.selectors.relaxPlayer : this.selectors.focusPlayer;
            const options = this.constants.playlistOptions[type];
            const filtered = query ? options.filter((track) => track.label.toLowerCase().includes(query)) : options;
            select.innerHTML = '';
            if (!filtered.length) {
                const emptyOption = document.createElement('option');
                emptyOption.value = '';
                emptyOption.textContent = 'Нет треков по запросу';
                select.appendChild(emptyOption);
                select.disabled = true;
                player.removeAttribute('src');
                player.load();
                return;
            }
            select.disabled = false;
            filtered.forEach((track) => {
                const option = document.createElement('option');
                option.value = track.src;
                option.textContent = track.label;
                select.appendChild(option);
            });
            const storedValue = this.state.settings[`${type}Playlist`];
            const defaultValue = filtered[0].src;
            select.value = filtered.some((track) => track.src === storedValue) ? storedValue : defaultValue;
            this.handlePlaylistChange(type, select.value, false);
        });
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(this.selectors.form);
        const habit = {
            id: crypto.randomUUID(),
            name: formData.get('habitName').trim() || 'Новая привычка',
            duration: this.normalizeNumber(formData.get('habitDuration'), 30, 5, 120),
            frequency: this.normalizeNumber(formData.get('habitFrequency'), 5, 1, 7),
            motivation: formData.get('habitMotivation').trim() || 'Прокачать себя',
            startDate: formData.get('habitStart') || new Date().toISOString().slice(0, 10),
            progress: [],
            history: {}
        };
        this.state.habits.push(habit);
        this.state.activeHabitId = habit.id;
        this.saveState();
        this.populateHabitSelector();
        this.renderAll();
        this.selectors.form.reset();
    }

    normalizeNumber(value, fallback, min, max) {
        const parsed = Number(value);
        if (Number.isNaN(parsed)) return fallback;
        return Math.max(min, Math.min(max, parsed));
    }

    handleHabitChange(event) {
        this.state.activeHabitId = event.target.value || null;
        this.saveState();
        this.renderAll();
    }

    deleteActiveHabit() {
        if (!this.state.activeHabitId) return;
        this.state.habits = this.state.habits.filter((habit) => habit.id !== this.state.activeHabitId);
        this.state.activeHabitId = this.state.habits[0]?.id ?? null;
        this.saveState();
        this.populateHabitSelector();
        this.renderAll();
    }

    get activeHabit() {
        return this.state.habits.find((habit) => habit.id === this.state.activeHabitId) || null;
    }

    renderAll() {
        this.renderLeaderboard();
        this.renderSummary();
        this.renderPersonalFacts();
        if (!this.activeHabit) {
            this.clearHero();
            this.renderEmptyState();
            this.selectors.heroFacts.textContent = 'Добавьте привычку, и мы покажем персональные инсайты.';
            return;
        }
        this.renderHero();
        this.renderHeroFacts();
        this.renderPlan();
        this.renderReminders();
        this.renderProgressGrid();
        this.updateProgressScore();
        this.renderLineChart();
        this.renderDonutChart();
        this.renderInsight();
    }

    clearHero() {
        this.selectors.heroPlanTitle.textContent = 'Задайте привычку – мы создадим стратегию';
        this.selectors.heroPlanCopy.textContent = 'Умный план связывает мотивацию, длительность и частоту практики.';
        this.selectors.heroPlanMood.textContent = 'Mood: готов к запуску ？';
    }

    renderEmptyState() {
        this.selectors.planDetails.innerHTML = '<p class="placeholder">Создайте привычку, чтобы увидеть план.</p>';
        this.selectors.remindersList.innerHTML = '<li class="placeholder">Советы появятся после создания привычки.</li>';
        this.selectors.progressGrid.innerHTML = '<p class="placeholder">Пока нет активных дней.</p>';
        this.selectors.insightText.textContent = 'Постройте привычку, чтобы увидеть интеллект-граф.';
        this.selectors.progressScore.textContent = '0% готово';
        this.selectors.personalFacts.innerHTML = '<p class="placeholder">Добавьте привычку и узнайте, к чему вы становитесь ближе.</p>';
        if (this.chartInstances.line) {
            this.chartInstances.line.destroy();
            this.chartInstances.line = null;
        }
        if (this.chartInstances.donut) {
            this.chartInstances.donut.destroy();
            this.chartInstances.donut = null;
        }
    }

    renderHero() {
        const { name, duration, frequency, motivation } = this.activeHabit;
        this.selectors.heroPlanTitle.textContent = `${name} . ${duration} дней трансформации`;
        this.selectors.heroPlanCopy.textContent = `Частота ${frequency} в неделю. Главный триггер: ${motivation}.`;
        this.selectors.heroPlanMood.textContent = this.randomMood();
    }

    renderHeroFacts() {
        const habit = this.activeHabit;
        if (!habit) return;
        const percent = Math.round((habit.progress.length / habit.duration) * 100) || 0;
        const streak = this.calculateCurrentStreak(habit);
        const motivationFact = `Мотивация «${habit.motivation}» приближает вас к новому уровню через ${habit.duration - habit.progress.length} дней.`;
        const streakFact = streak ? `Вы держите streak ${streak} дней – нейропластичность усиливается.` : 'Начните streak сегодня, первые 2 дня критичны.';
        const globalFact = this.pickGlobalFact(habit.motivation);
        this.selectors.heroFacts.innerHTML = `
            <div class="fact-card">
                <strong>${percent}% готово</strong>
                <p>${motivationFact}</p>
            </div>
            <div class="fact-card">
                <strong>Streak ${streak} д.</strong>
                <p>${streakFact}</p>
            </div>
            <div class="fact-card fact-card-dynamic">
                ${globalFact}
            </div>
        `;
    }

    pickGlobalFact(motivation) {
        const motive = motivation.toLowerCase();
        if (motive.includes('спорт') || motive.includes('фитнес') || motive.includes('кардио')) {
            return '200 млн человек отмечают тренировки каждый год — вы в глобальном движении.';
        }
        if (motive.includes('фокус') || motive.includes('продуктив')) {
            return '80+ млн специалистов ведут трекеры продуктивности ежедневно.';
        }
        if (motive.includes('медита') || motive.includes('mindfulness') || motive.includes('осознан')) {
            return '65 млн людей практикуют осознанность по всему миру — ваша практика в резонансе.';
        }
        return '150 млн людей улучшают здоровье через привычки каждый день — вы в числе них.';
    }

    renderPersonalFacts() {
        const container = this.selectors.personalFacts;
        if (!this.state.habits.length) {
            container.innerHTML = '<p class="placeholder">Добавьте привычку, чтобы увидеть инсайты.</p>';
            return;
        }
        const cards = this.state.habits
            .map((habit) => {
                const percent = habit.duration ? Math.round((habit.progress.length / habit.duration) * 100) : 0;
                const streak = this.calculateCurrentStreak(habit);
                const trend = percent >= 70 ? '↑' : percent >= 35 ? '→' : '↓';
                return `<div class="fact-chip">
                    <strong>${trend} ${habit.name}</strong>
                    <span>${percent}% · streak ${streak} д.</span>
                </div>`;
            })
            .join('');
        container.innerHTML = cards;
    }

    randomMood() {
        return this.constants.heroMoodStates[Math.floor(Math.random() * this.constants.heroMoodStates.length)];
    }

    renderPlan() {
        const { duration, frequency, motivation } = this.activeHabit;
        const phases = [
            {
                title: 'Стартовый ритуал',
                copy: `Фокус на лёгких действиях, закрепи контекст и записывай микропобеды. Мотивация: ${motivation}.`
            },
            {
                title: 'Стабильный поток',
                copy: `Поддерживай ${frequency} сессий в неделю, планируй в календаре, отмечай выполненные дни.`
            },
            {
                title: 'Интеграция',
                copy: `На днях ${duration - 5}-${duration} оцени прогресс, усиль практику и поделись результатом.`
            }
        ];
        this.selectors.planDetails.innerHTML = phases
            .map(
                (phase, index) => `
                <div class="plan-step">
                    <strong>Этап ${index + 1}: ${phase.title}</strong>
                    <p>${phase.copy}</p>
                </div>`
            )
            .join('');
    }

    renderReminders() {
        const { name } = this.activeHabit;
        const reminders = [
            'Закрепи напоминание в смартфоне – одинаковое время снижает сопротивление.',
            `После ${name} фиксируй инсайт одним предложением – осознанность = устойчивость.`,
            'Настрой микро-награду – мозг любит dopamine loops.',
            'Если пропустил день – сделай мягкий ресет и продолжай без чувства вины.'
        ];
        this.selectors.remindersList.innerHTML = reminders.map((tip) => `<li>${tip}</li>`).join('');
    }

    renderProgressGrid() {
        const { duration, progress } = this.activeHabit;
        this.selectors.progressGrid.innerHTML = '';
        for (let day = 1; day <= duration; day += 1) {
            const cell = document.createElement('button');
            const isComplete = progress.includes(day);
            cell.className = 'progress-day';
            cell.dataset.day = day;
            cell.dataset.complete = isComplete;
            cell.innerHTML = `<span>${day}</span>`;
            cell.addEventListener('click', () => this.toggleDay(day));
            this.selectors.progressGrid.appendChild(cell);
        }
    }

    toggleDay(day) {
        if (!this.activeHabit) return;
        const progress = this.activeHabit.progress;
        const index = progress.indexOf(day);
        if (index === -1) progress.push(day);
        else progress.splice(index, 1);
        this.saveState();
        this.renderProgressGrid();
        this.updateProgressScore();
        this.renderLineChart();
        this.renderDonutChart();
        this.renderInsight();
        this.renderLeaderboard();
        this.renderSummary();
        this.renderHeroFacts();
        this.renderPersonalFacts();
    }

    updateProgressScore() {
        const habit = this.activeHabit;
        if (!habit) {
            this.selectors.progressScore.textContent = '0% готово';
            return;
        }
        const percent = Math.round((habit.progress.length / habit.duration) * 100) || 0;
        this.selectors.progressScore.textContent = `${percent}% готово`;
    }

    buildLineChartData() {
        const habit = this.activeHabit;
        if (!habit) return { labels: [], data: [] };
        const labels = Array.from({ length: habit.duration }, (_, i) => `День ${i + 1}`);
        const cumulative = [];
        let completed = 0;
        for (let day = 1; day <= habit.duration; day += 1) {
            if (habit.progress.includes(day)) completed += 1;
            cumulative.push(Math.round((completed / habit.duration) * 100));
        }
        return { labels, data: cumulative };
    }

    renderLineChart() {
        const { labels, data } = this.buildLineChartData();
        if (this.chartInstances.line) this.chartInstances.line.destroy();
        this.chartInstances.line = new Chart(this.selectors.chartCanvas, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Прогресс (%)',
                        data,
                        borderColor: '#8db0ff',
                        backgroundColor: 'rgba(141, 176, 255, 0.2)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    y: { suggestedMin: 0, suggestedMax: 100, ticks: { callback: (value) => `${value}%` } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    renderDonutChart() {
        const habit = this.activeHabit;
        if (this.chartInstances.donut) this.chartInstances.donut.destroy();
        const completed = habit ? habit.progress.length : 0;
        const remaining = habit ? Math.max(0, habit.duration - completed) : 1;
        this.chartInstances.donut = new Chart(this.selectors.ringCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Готово', 'Осталось'],
                datasets: [
                    {
                        data: habit ? [completed, remaining] : [0, 1],
                        backgroundColor: ['#71f2ff', 'rgba(255,255,255,0.1)'],
                        borderWidth: 0,
                        hoverOffset: 4
                    }
                ]
            },
            options: {
                plugins: { legend: { display: false } },
                cutout: '78%',
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    renderInsight() {
        const habit = this.activeHabit;
        if (!habit) {
            this.selectors.insightText.textContent = 'Постройте привычку, чтобы увидеть интеллект-граф.';
            return;
        }
        const percent = Math.round((habit.progress.length / habit.duration) * 100);
        let message = 'Стартуй сегодня – первые 48 часов критичны.';
        if (percent >= 30 && percent < 70) message = 'Середина пути: разнообразь триггеры и усиливай награды.';
        if (percent >= 70 && percent < 100) message = 'Финиш близко! Поделись прогрессом с другом для усиления.';
        if (percent == 100) message = 'Привычка закреплена! Добавь новую способность в стек.';
        this.selectors.insightText.textContent = message;
    }

    renderLeaderboard() {
        const container = this.selectors.leaderboard;
        if (!this.state.habits.length) {
            container.innerHTML = '<p class="placeholder">Добавьте хотя бы одну привычку, чтобы увидеть рейтинг.</p>';
            return;
        }
        const ranking = this.state.habits
            .map((habit) => {
                const percent = habit.duration ? Math.round((habit.progress.length / habit.duration) * 100) : 0;
                const streak = this.calculateCurrentStreak(habit);
                return { habit, percent, streak };
            })
            .sort((a, b) => {
                if (b.percent !== a.percent) return b.percent - a.percent;
                if (b.streak !== a.streak) return b.streak - a.streak;
                return a.habit.name.localeCompare(b.habit.name);
            });
        container.innerHTML = ranking
            .map(
                (entry, index) => `
                <div class="leaderboard-card">
                    <div class="leaderboard-card__rank">${index + 1}</div>
                    <div class="leaderboard-card__meta">
                        <strong>${entry.habit.name}</strong>
                        <span>Streak: ${entry.streak} д.</span>
                    </div>
                    <div class="leaderboard-card__score">${entry.percent}%</div>
                </div>`
            )
            .join('');
    }

    calculateCurrentStreak(habit) {
        if (!habit.progress.length) return 0;
        const progressSet = new Set(habit.progress);
        let streak = 0;
        let cursor = Math.max(...habit.progress);
        while (progressSet.has(cursor)) {
            streak += 1;
            cursor -= 1;
        }
        return streak;
    }

    renderSummary() {
        const container = this.selectors.summaryMetrics;
        const period = Number(this.selectors.summaryPeriod.value) || 7;
        if (!this.state.habits.length) {
            container.innerHTML = '<p class="placeholder">Добавьте привычки и начните отмечать, чтобы увидеть сводку.</p>';
            return;
        }
        const stats = this.calculatePeriodStats(period);
        if (!stats.potential) {
            container.innerHTML = '<p class="placeholder">Недостаточно данных для расчёта. Отмечайте прогресс в течение периода.</p>';
            return;
        }
        const insight = this.buildSummaryInsight(stats.average, stats.topHabitName, period);
        container.innerHTML = `
            <div class="summary-card">
                <span>Завершено за ${period} д.</span>
                <strong>${stats.completed}</strong>
            </div>
            <div class="summary-card">
                <span>Средняя продуктивность</span>
                <strong>${stats.average}%</strong>
            </div>
            <div class="summary-card">
                <span>Лидер периода</span>
                <strong>${stats.topHabitName}</strong>
            </div>
            <div class="summary-card">
                <span>AI-наблюдение</span>
                <strong>${insight}</strong>
            </div>
        `;
    }

    calculatePeriodStats(periodDays) {
        const today = new Date();
        const start = new Date();
        start.setDate(today.getDate() - (periodDays - 1));
        let completed = 0;
        let potential = 0;
        let topHabitName = '-';
        let topHabitScore = -1;
        this.state.habits.forEach((habit) => {
            const habitSlots = Math.min(periodDays, habit.duration);
            potential += habitSlots;
            let habitCompleted = 0;
            Object.values(habit.history || {}).forEach((days) => {
                Object.entries(days).forEach(([dateString, done]) => {
                    if (!done) return;
                    const date = new Date(dateString);
                    if (date >= start && date <= today) {
                        completed += 1;
                        habitCompleted += 1;
                    }
                });
            });
            if (habitCompleted > topHabitScore) {
                topHabitScore = habitCompleted;
                topHabitName = habitCompleted ? habit.name : '-';
            }
        });
        const average = potential ? Math.min(100, Math.round((completed / potential) * 100)) : 0;
        return { completed, potential, average, topHabitName };
    }

    buildSummaryInsight(average, topHabitName, period) {
        if (!average) return `Неделя ${period === 7 ? 'ещё' : 'ещё'} пустая – отметьте занятия.`;
        if (average < 35) return 'Рекомендация: добавьте микро-активаторы, чтобы войти в ритм.';
        if (average < 70) return `Горизонт стабилизации: держим ${average}% и усиливаем ${topHabitName || 'лидера'}.`;
        if (average < 95) return 'Сильный темп! Пора зафиксировать награду и поделиться прогрессом.';
        return 'Вы на пике продуктивности – закрепите успех и добавьте новый ритуал.';
    }

    handleThemeToggle(event) {
        const theme = event.target.checked ? 'light' : 'dark';
        this.state.settings.theme = theme;
        document.body.dataset.theme = theme;
        document.documentElement.dataset.theme = theme;
        this.updateMetaTheme(theme);
        this.saveState();
    }

    handleNotificationToggle(event) {
        const enabled = event.target.checked;
        this.state.settings.notificationsEnabled = enabled;
        this.saveState();
        if (enabled) {
            this.requestNotificationPermission();
        } else {
            this.updateNotificationStatus('Push отключён');
        }
    }

    updateNotificationStatus(text) {
        this.selectors.notificationStatus.textContent = `Статус: ${text}`;
    }

    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            this.updateNotificationStatus('Браузер не поддерживает уведомления');
            return;
        }
        try {
            const result = await Notification.requestPermission();
            if (result === 'granted') {
                this.updateNotificationStatus('включены');
                navigator.serviceWorker?.ready.then((registration) => {
                    registration.showNotification('NeuroRitual Planner', {
                        body: 'Напоминания активированы. Мы с вами на связи!',
                        icon: 'icons/icon-192.png'
                    });
                });
            } else if (result === 'denied') {
                this.selectors.notificationToggle.checked = false;
                this.updateNotificationStatus('запрещены');
            } else {
                this.updateNotificationStatus('ожидание разрешения');
            }
        } catch (error) {
            console.error('Ошибка разрешения уведомлений', error);
            this.updateNotificationStatus('ошибка разрешения');
        }
    }

    handlePlaylistChange(type, src, shouldSave = true) {
        const player = type === 'relax' ? this.selectors.relaxPlayer : this.selectors.focusPlayer;
        if (src) {
            player.src = src;
            player.load();
        }
        if (shouldSave) {
            this.state.settings[`${type}Playlist`] = src;
            this.saveState();
        }
    }

    handleMusicSearch(event) {
        const value = event.target.value;
        clearTimeout(this.musicSearchTimer);
        this.musicSearchTimer = setTimeout(() => {
            this.state.settings.musicSearch = value;
            this.populatePlaylists();
            this.saveState();
        }, 200);
    }

    promptInstall() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.finally(() => {
                this.deferredPrompt = null;
            });
        } else {
            alert('Установка доступна после публикации на HTTPS (например, GitHub Pages).');
        }
    }

    refreshOnVisibility() {
        if (document.visibilityState === 'visible') {
            this.renderAll();
        }
    }

    registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            this.deferredPrompt = event;
            this.selectors.installBtn.style.display = 'inline-flex';
        });
        navigator.serviceWorker
            .register('service-worker.js')
            .then(() => console.info('Service worker registered'))
            .catch((error) => console.error('SW registration failed', error));
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new NeuroRitualPlanner();
});