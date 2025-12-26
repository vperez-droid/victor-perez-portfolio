document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Fade in elements on scroll
    const animatedElements = document.querySelectorAll('.card, .about-text, .stat-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Dynamic header background
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 15, 28, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(10, 15, 28, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // ============================================
    // ROI ASSISTANT LOGIC
    // ============================================

    const roiBtn = document.getElementById('roiAssistantBtn');
    const roiModal = document.getElementById('roiModal');
    const roiCloseBtn = document.getElementById('roiCloseBtn');
    const roiChatInput = document.getElementById('roiChatInput');
    const roiSendBtn = document.getElementById('roiSendBtn');
    const roiChatMessages = document.getElementById('roiChatMessages');
    const typingIndicator = document.getElementById('typingIndicator');

    // Conversation state
    let conversationState = {
        step: 0,
        data: {
            process: '',
            hoursPerWeek: 0,
            hourlyRate: 0,
            employees: 1
        }
    };

    // Chart instance
    let roiChart = null;

    // Open modal
    roiBtn.addEventListener('click', () => {
        roiModal.classList.add('active');
        roiChatInput.focus();
        initializeChart();
    });

    // Close modal
    roiCloseBtn.addEventListener('click', closeModal);
    roiModal.addEventListener('click', (e) => {
        if (e.target === roiModal || e.target.classList.contains('roi-modal-overlay')) {
            closeModal();
        }
    });

    function closeModal() {
        roiModal.classList.remove('active');
    }

    // Send message
    roiSendBtn.addEventListener('click', sendMessage);
    roiChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = roiChatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        roiChatInput.value = '';

        // Process message
        setTimeout(() => {
            processUserInput(message);
        }, 500);
    }

    function addMessage(text, type = 'bot') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `roi-message ${type}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        if (typeof text === 'string') {
            contentDiv.innerHTML = `<p>${text}</p>`;
        } else {
            contentDiv.appendChild(text);
        }

        messageDiv.appendChild(contentDiv);
        roiChatMessages.appendChild(messageDiv);

        // Scroll to bottom
        roiChatMessages.scrollTop = roiChatMessages.scrollHeight;
    }

    function showTyping() {
        typingIndicator.style.display = 'inline-flex';
        roiChatMessages.scrollTop = roiChatMessages.scrollHeight;
    }

    function hideTyping() {
        typingIndicator.style.display = 'none';
    }

    function processUserInput(input) {
        showTyping();

        setTimeout(() => {
            hideTyping();

            switch (conversationState.step) {
                case 0:
                    // First question answered - process name
                    conversationState.data.process = input;
                    conversationState.step = 1;
                    addMessage(`Perfecto, veo que el proceso de <strong>"${input}"</strong> es un punto crítico. 📝`);
                    setTimeout(() => {
                        addMessage('¿Aproximadamente cuántas <strong>horas a la semana</strong> dedicas a este proceso? (Ej: 10)');
                    }, 800);
                    break;

                case 1:
                    // Hours per week
                    const hours = parseFloat(input);
                    if (isNaN(hours) || hours <= 0) {
                        addMessage('Por favor, introduce un número válido de horas. Por ejemplo: 10');
                        return;
                    }
                    conversationState.data.hoursPerWeek = hours;
                    conversationState.step = 2;
                    updateMetrics();
                    addMessage(`${hours} horas semanales... eso son <strong>${(hours * 52).toFixed(0)} horas al año</strong>. 😮`);
                    setTimeout(() => {
                        addMessage('¿Cuál es tu <strong>coste por hora</strong> aproximado? (Ej: 30 para €30/hora)');
                    }, 1000);
                    break;

                case 2:
                    // Hourly rate
                    const rate = parseFloat(input);
                    if (isNaN(rate) || rate <= 0) {
                        addMessage('Por favor, introduce un número válido. Por ejemplo: 30');
                        return;
                    }
                    conversationState.data.hourlyRate = rate;
                    conversationState.step = 3;
                    updateMetrics();
                    updateChart();
                    addMessage(`Entendido. Con €${rate}/hora, estamos hablando de números importantes. 💰`);
                    setTimeout(() => {
                        addMessage('Última pregunta: ¿Cuántas <strong>personas</strong> están involucradas en este proceso? (Ej: 1, 3, 5...)');
                    }, 1000);
                    break;

                case 3:
                    // Number of employees
                    const employees = parseInt(input);
                    if (isNaN(employees) || employees <= 0) {
                        addMessage('Por favor, introduce un número válido de personas. Por ejemplo: 3');
                        return;
                    }
                    conversationState.data.employees = employees;
                    conversationState.step = 4;
                    updateMetrics();
                    updateChart();
                    showTimeline();
                    setTimeout(() => {
                        showFinalAnalysis();
                    }, 1500);
                    break;

                default:
                    // Conversation ended - handle general queries
                    handleGeneralQuery(input);
            }
        }, 1500);
    }

    function updateMetrics() {
        const { hoursPerWeek, hourlyRate, employees } = conversationState.data;

        const annualHours = hoursPerWeek * 52 * employees;
        const annualCost = annualHours * hourlyRate;
        const savings = annualCost * 0.85; // 85% automation efficiency
        const roi = 450; // Estimated ROI percentage

        // Animate numbers
        animateValue('metricTimeWasted', 0, annualHours, 1000, ' horas');
        animateValue('metricCurrentCost', 0, annualCost, 1000, '€', true);
        animateValue('metricSavings', 0, savings, 1000, '€', true);
        animateValue('metricROI', 0, roi, 1000, '%');
    }

    function animateValue(id, start, end, duration, suffix = '', isEuro = false) {
        const element = document.getElementById(id);
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;

            if (isEuro) {
                element.textContent = suffix + current.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
                element.textContent = current.toFixed(0) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function initializeChart() {
        const ctx = document.getElementById('roiChart');
        if (!ctx) return;

        if (roiChart) {
            roiChart.destroy();
        }

        roiChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Situación Actual', 'Con Automatización'],
                datasets: [{
                    label: 'Coste Anual (€)',
                    data: [0, 0],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.6)',
                        'rgba(16, 185, 129, 0.6)'
                    ],
                    borderColor: [
                        'rgba(239, 68, 68, 1)',
                        'rgba(16, 185, 129, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        titleColor: '#e6e8eb',
                        bodyColor: '#94a3b8',
                        borderColor: 'rgba(56, 189, 248, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return '€' + context.parsed.y.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#94a3b8',
                            callback: function (value) {
                                return '€' + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#e6e8eb',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }

    function updateChart() {
        if (!roiChart) return;

        const { hoursPerWeek, hourlyRate, employees } = conversationState.data;
        const annualCost = hoursPerWeek * 52 * hourlyRate * employees;
        const automatedCost = annualCost * 0.15; // 15% remaining cost

        // Animate chart update
        roiChart.data.datasets[0].data = [annualCost, automatedCost];
        roiChart.update('active');
    }

    function showTimeline() {
        const timeline = document.getElementById('roiTimeline');
        timeline.style.display = 'block';
    }

    function showFinalAnalysis() {
        const { hoursPerWeek, hourlyRate, employees } = conversationState.data;
        const annualCost = hoursPerWeek * 52 * hourlyRate * employees;
        const savings = annualCost * 0.85;

        const analysisHTML = document.createElement('div');
        analysisHTML.innerHTML = `
            <p>📊 <strong>Análisis completado</strong></p>
            <p>Basándome en tus respuestas:</p>
            <ul style="margin: 12px 0; padding-left: 20px;">
                <li>Estás invirtiendo <strong>€${annualCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/año</strong> en este proceso</li>
                <li>Con automatización podrías ahorrar <strong>€${savings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/año</strong></li>
                <li>El ROI estimado es del <strong>450%</strong> en 12 meses</li>
                <li>Tiempo de implementación: <strong>4-6 semanas</strong></li>
            </ul>
            <p>💡 <strong>¿Te gustaría que te ayude a implementar esta solución?</strong></p>
        `;

        addMessage(analysisHTML);

        setTimeout(() => {
            showCTA();
        }, 1000);
    }

    function showCTA() {
        const ctaSection = document.getElementById('roiCTA');
        ctaSection.style.display = 'block';

        // Add event listeners to CTA buttons
        document.getElementById('ctaSchedule').addEventListener('click', () => {
            addMessage('¡Perfecto! 📅 Aquí puedes agendar una auditoría gratuita de 30 minutos:', 'bot');
            setTimeout(() => {
                const ctaHTML = document.createElement('div');
                ctaHTML.innerHTML = `
                    <p><strong>📧 Email:</strong> <a href="mailto:contacto@victorperezlamas.com" style="color: #38bdf8;">contacto@victorperezlamas.com</a></p>
                    <p style="margin-top: 8px; font-size: 0.9rem; opacity: 0.8;">Te contactaré en menos de 24 horas para coordinar la reunión.</p>
                `;
                addMessage(ctaHTML);

                // Send to N8N webhook (placeholder)
                sendToN8N('schedule_audit');
            }, 500);
        });

        document.getElementById('ctaProposal').addEventListener('click', () => {
            addMessage('¡Excelente! 📧 Te enviaré una propuesta personalizada.', 'bot');
            setTimeout(() => {
                const emailHTML = document.createElement('div');
                emailHTML.innerHTML = `
                    <p>Por favor, déjame tu email:</p>
                    <input type="email" id="userEmail" placeholder="tu@email.com" style="
                        width: 100%;
                        padding: 12px;
                        background: rgba(255,255,255,0.05);
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 8px;
                        color: white;
                        margin-top: 8px;
                    ">
                    <button id="submitEmail" style="
                        margin-top: 12px;
                        padding: 10px 20px;
                        background: linear-gradient(135deg, #38bdf8, #818cf8);
                        border: none;
                        border-radius: 8px;
                        color: white;
                        cursor: pointer;
                        font-weight: 600;
                    ">Enviar</button>
                `;
                addMessage(emailHTML);

                setTimeout(() => {
                    document.getElementById('submitEmail').addEventListener('click', () => {
                        const email = document.getElementById('userEmail').value;
                        if (email && email.includes('@')) {
                            addMessage(`✅ ¡Perfecto! Te enviaré la propuesta a <strong>${email}</strong> en las próximas horas.`, 'bot');
                            sendToN8N('send_proposal', { email });
                        } else {
                            addMessage('⚠️ Por favor, introduce un email válido.', 'bot');
                        }
                    });
                }, 100);
            }, 500);
        });
    }

    function handleGeneralQuery(input) {
        // Simple responses for post-analysis questions
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('precio') || lowerInput.includes('coste') || lowerInput.includes('cuanto')) {
            addMessage('El coste depende de la complejidad del proyecto, pero típicamente el ROI se recupera en 3-6 meses. ¿Te gustaría una cotización personalizada?');
        } else if (lowerInput.includes('tiempo') || lowerInput.includes('cuanto tarda')) {
            addMessage('La implementación típica toma entre 4-6 semanas, dependiendo de la complejidad. ¿Quieres que revisemos tu caso específico?');
        } else if (lowerInput.includes('si') || lowerInput.includes('sí') || lowerInput.includes('vale') || lowerInput.includes('ok')) {
            addMessage('¡Genial! Usa los botones de arriba para agendar una auditoría o recibir una propuesta. 🚀');
        } else {
            addMessage('Interesante pregunta. Para darte una respuesta precisa, te recomiendo agendar una auditoría gratuita donde podemos analizar tu caso en detalle. 😊');
        }
    }

    function sendToN8N(action, data = {}) {
        // Placeholder for N8N webhook integration
        const webhookData = {
            action: action,
            timestamp: new Date().toISOString(),
            conversationData: conversationState.data,
            ...data
        };

        console.log('📤 Sending to N8N:', webhookData);

        // TODO: Replace with your actual N8N webhook URL
        // fetch('YOUR_N8N_WEBHOOK_URL', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(webhookData)
        // })
        // .then(response => response.json())
        // .then(data => console.log('✅ N8N Response:', data))
        // .catch(error => console.error('❌ N8N Error:', error));
    }
});
