<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WasteWise - Turning Waste Into Worth</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #e2e8f0;
            overflow-x: hidden;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        /* Animated Header */
        .header {
            text-align: center;
            padding: 4rem 2rem;
            position: relative;
            overflow: hidden;
        }

        .logo-container {
            display: inline-block;
            position: relative;
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .logo {
            font-size: 4rem;
            margin-bottom: 1rem;
            filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.5));
        }

        h1 {
            font-size: 3.5rem;
            background: linear-gradient(135deg, #22c55e, #10b981, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            animation: gradientShift 3s ease infinite;
            background-size: 200% 200%;
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .tagline {
            font-size: 1.5rem;
            color: #94a3b8;
            margin-bottom: 2rem;
            opacity: 0;
            animation: fadeInUp 1s ease forwards 0.5s;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Badges */
        .badges {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 3rem;
            opacity: 0;
            animation: fadeInUp 1s ease forwards 0.7s;
        }

        .badge {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid #22c55e;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .badge:hover {
            background: rgba(34, 197, 94, 0.2);
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(34, 197, 94, 0.3);
        }

        /* Feature Cards */
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 4rem 0;
        }

        .feature-card {
            background: rgba(30, 41, 59, 0.5);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 16px;
            padding: 2rem;
            transition: all 0.4s ease;
            opacity: 0;
            animation: slideIn 0.6s ease forwards;
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-card:nth-child(4) { animation-delay: 0.4s; }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .feature-card:hover {
            transform: translateY(-10px);
            border-color: #22c55e;
            box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
        }

        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: inline-block;
            animation: pulse 2s ease infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .feature-card h3 {
            color: #22c55e;
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .feature-card p {
            color: #cbd5e1;
            line-height: 1.6;
        }

        /* Tech Stack */
        .tech-stack {
            margin: 4rem 0;
            text-align: center;
        }

        .tech-stack h2 {
            font-size: 2.5rem;
            color: #22c55e;
            margin-bottom: 2rem;
        }

        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .tech-item {
            background: rgba(30, 41, 59, 0.6);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .tech-item:hover {
            border-color: #3b82f6;
            transform: scale(1.05);
            box-shadow: 0 5px 20px rgba(59, 130, 246, 0.4);
        }

        .tech-item-icon {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }

        .tech-item-name {
            color: #e2e8f0;
            font-weight: 600;
        }

        /* Stats Section */
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin: 4rem 0;
        }

        .stat-card {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
            border: 1px solid #22c55e;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
        }

        .stat-number {
            font-size: 3rem;
            font-weight: bold;
            color: #22c55e;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            color: #94a3b8;
            font-size: 1rem;
        }

        /* CTA Section */
        .cta {
            text-align: center;
            padding: 4rem 2rem;
            margin: 4rem 0;
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
            border-radius: 20px;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .cta h2 {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            color: #22c55e;
        }

        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
        }

        .btn {
            padding: 1rem 2rem;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .btn-primary {
            background: linear-gradient(135deg, #22c55e, #10b981);
            color: white;
            border: none;
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
        }

        .btn-secondary {
            background: transparent;
            color: #22c55e;
            border: 2px solid #22c55e;
        }

        .btn-secondary:hover {
            background: rgba(34, 197, 94, 0.1);
            transform: translateY(-3px);
        }

        /* Particles Background */
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }

        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #22c55e;
            border-radius: 50%;
            opacity: 0.3;
            animation: particleFloat 20s infinite;
        }

        @keyframes particleFloat {
            0%, 100% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 0.3;
            }
            90% {
                opacity: 0.3;
            }
            100% {
                transform: translateY(-100vh) translateX(50px);
                opacity: 0;
            }
        }

        /* Roadmap */
        .roadmap {
            margin: 4rem 0;
        }

        .roadmap h2 {
            font-size: 2.5rem;
            color: #22c55e;
            text-align: center;
            margin-bottom: 3rem;
        }

        .roadmap-item {
            background: rgba(30, 41, 59, 0.5);
            border-left: 4px solid #22c55e;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .roadmap-item:hover {
            transform: translateX(10px);
            background: rgba(30, 41, 59, 0.7);
        }

        .roadmap-item h4 {
            color: #22c55e;
            margin-bottom: 0.5rem;
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 3rem 2rem;
            border-top: 1px solid rgba(34, 197, 94, 0.2);
            margin-top: 4rem;
        }

        footer p {
            color: #94a3b8;
            margin-bottom: 0.5rem;
        }

        .social-links {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1rem;
        }

        .social-links a {
            color: #22c55e;
            font-size: 1.5rem;
            transition: all 0.3s ease;
        }

        .social-links a:hover {
            transform: translateY(-3px);
            filter: drop-shadow(0 5px 10px rgba(34, 197, 94, 0.5));
        }
    </style>
</head>
<body>
    <!-- Animated Particles -->
    <div class="particles" id="particles"></div>

    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="logo-container">
                <div class="logo">♻️</div>
            </div>
            <h1>WasteWise</h1>
            <p class="tagline">Turning yesterday's waste into tomorrow's resources</p>
            
            <div class="badges">
                <span class="badge">🚀 Next.js 15</span>
                <span class="badge">🤖 AI-Powered</span>
                <span class="badge">🔥 Firebase</span>
                <span class="badge">⚡ TypeScript</span>
                <span class="badge">🌱 Sustainable</span>
            </div>
        </header>

        <!-- Stats -->
        <section class="stats">
            <div class="stat-card">
                <div class="stat-number">95%</div>
                <div class="stat-label">Recycling Accuracy</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">5-15%</div>
                <div class="stat-label">Commission Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">AI</div>
                <div class="stat-label">Computer Vision</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">♻️</div>
                <div class="stat-label">Zero Waste Goal</div>
            </div>
        </section>

        <!-- Features -->
        <section class="features">
            <div class="feature-card">
                <div class="feature-icon">📱</div>
                <h3>Smart Device Selling</h3>
                <p>Upload images of broken devices and get instant AI-powered valuation. Our platform connects you with buyers looking for genuine recycled parts.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🤖</div>
                <h3>AI Waste Identification</h3>
                <p>Advanced computer vision identifies waste types, analyzes circuit boards, and provides confidence scores for accurate recycling classification.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🛒</div>
                <h3>Parts Marketplace</h3>
                <p>Browse a curated marketplace of genuine, recycled electronic parts. Each component is tagged with QR codes for complete traceability.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🚚</div>
                <h3>Easy Collection</h3>
                <p>Delivery partners handle all logistics. Devices are collected from sellers and transported to expert recycling agencies seamlessly.</p>
            </div>
        </section>

        <!-- Tech Stack -->
        <section class="tech-stack">
            <h2>⚡ Tech Stack</h2>
            
            <div style="margin-bottom: 3rem;">
                <h3 style="color: #3b82f6; font-size: 1.8rem; margin-bottom: 1.5rem; text-align: left;">Frontend</h3>
                <div class="tech-grid">
                    <div class="tech-item">
                        <div class="tech-item-icon">⚛️</div>
                        <div class="tech-item-name">Next.js 15.3.4</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-item-icon">🎨</div>
                        <div class="tech-item-name">Radix UI</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-item-icon">💨</div>
                        <div class="tech-item-name">Tailwind CSS</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-item-icon">🎯</div>
                        <div class="tech-item-name">Lucide React</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-item-icon">📝</div>
                        <div class="tech-item-name">React Hook Form</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-item-icon">✓</div>
                        <div class="tech-item-name">Zod</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-item-icon">📊</div>
                        <div class="tech-item-name">Recharts</div>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #3b82f6; font-size: 1.8rem; margin-bottom: 1.5rem; text-align: left;">Backend</h3>
                <div class="tech-grid">
                    <div class="tech-item">
                        <div class="tech-item-icon">🤖</div>
                        <div class="tech-item-name">Genkit AI</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-item-icon">🧠</div>
                        <div class="tech-item-name">Google GenAI</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-item-icon">🔥</div>
                        <div class="tech-item-name">Firebase</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-item-icon">🗄️</div>
                        <div class="tech-item-name">Firestore</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-item-icon">🔐</div>
                        <div class="tech-item-name">Firebase Auth</div>
                    </div>
                </div>
            </div>

            <div>
                <h3 style="color: #3b82f6; font-size: 1.8rem; margin-bottom: 1.5rem; text-align: left;">Testing & Tools</h3>
                <div class="tech-grid">
                    <div class="tech-item">
                        <div class="tech-item-icon">☕</div>
                        <div class="tech-item-name">Mocha</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-item-icon">🍵</div>
                        <div class="tech-item-name">Chai</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-item-icon">📘</div>
                        <div class="tech-item-name">TypeScript</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Getting Started -->
        <section style="margin: 4rem 0;">
            <h2 style="font-size: 2.5rem; color: #22c55e; text-align: center; margin-bottom: 3rem;">🚀 Getting Started</h2>
            
            <div style="background: rgba(30, 41, 59, 0.5); border-radius: 16px; padding: 2rem; border: 1px solid rgba(34, 197, 94, 0.2); margin-bottom: 2rem;">
                <h3 style="color: #3b82f6; font-size: 1.5rem; margin-bottom: 1rem;">Prerequisites</h3>
                <ul style="color: #cbd5e1; line-height: 2; list-style-position: inside;">
                    <li>📦 Node.js (v18 or later)</li>
                    <li>📥 npm or yarn</li>
                    <li>🔥 Firebase project setup</li>
                    <li>🤖 Google GenAI API credentials</li>
                </ul>
            </div>

            <div style="background: rgba(30, 41, 59, 0.5); border-radius: 16px; padding: 2rem; border: 1px solid rgba(34, 197, 94, 0.2);">
                <h3 style="color: #3b82f6; font-size: 1.5rem; margin-bottom: 1.5rem;">Installation</h3>
                
                <div style="background: #0f172a; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid rgba(59, 130, 246, 0.3);">
                    <p style="color: #94a3b8; margin-bottom: 0.5rem;">1. Clone the repository:</p>
                    <code style="color: #22c55e; font-family: 'Courier New', monospace;">git clone https://github.com/yourusername/WasteWise.git<br>cd WasteWise</code>
                </div>

                <div style="background: #0f172a; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid rgba(59, 130, 246, 0.3);">
                    <p style="color: #94a3b8; margin-bottom: 0.5rem;">2. Install dependencies:</p>
                    <code style="color: #22c55e; font-family: 'Courier New', monospace;">npm install<br># or<br>yarn install</code>
                </div>

                <div style="background: #0f172a; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid rgba(59, 130, 246, 0.3);">
                    <p style="color: #94a3b8; margin-bottom: 0.5rem;">3. Set up environment variables:</p>
                    <code style="color: #22c55e; font-family: 'Courier New', monospace;">Copy .env.example to .env<br>Add your Firebase and Google GenAI credentials</code>
                </div>

                <div style="background: #0f172a; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid rgba(59, 130, 246, 0.3);">
                    <p style="color: #94a3b8; margin-bottom: 0.5rem;">4. Run the development server:</p>
                    <code style="color: #22c55e; font-family: 'Courier New', monospace;">npm run dev<br># or<br>yarn dev</code>
                </div>

                <div style="background: #0f172a; border-radius: 8px; padding: 1.5rem; border: 1px solid rgba(59, 130, 246, 0.3);">
                    <p style="color: #94a3b8; margin-bottom: 0.5rem;">5. For AI development:</p>
                    <code style="color: #22c55e; font-family: 'Courier New', monospace;">npm run genkit:dev</code>
                </div>
            </div>
        </section>

        <!-- Roadmap -->
        <section class="roadmap">
            <h2>🗺️ Roadmap</h2>
            <div class="roadmap-item">
                <h4>📱 Mobile App Development</h4>
                <p>Native iOS and Android apps for on-the-go waste management</p>
            </div>
            <div class="roadmap-item">
                <h4>🗃️ Expanded Waste Database</h4>
                <p>Support for more device types and waste categories</p>
            </div>
            <div class="roadmap-item">
                <h4>🏢 Local Recycling Centers</h4>
                <p>Integration with municipal recycling facilities</p>
            </div>
            <div class="roadmap-item">
                <h4>🌍 Carbon Footprint Tracking</h4>
                <p>Track your environmental impact and carbon savings</p>
            </div>
            <div class="roadmap-item">
                <h4>👥 Community Features</h4>
                <p>Leaderboards, challenges, and social engagement</p>
            </div>
        </section>

        <!-- CTA -->
        <section class="cta">
            <h2>Ready to Make a Difference?</h2>
            <p style="font-size: 1.2rem; color: #cbd5e1; margin-bottom: 2rem;">Join the sustainable revolution and give technology a second chance</p>
            <div class="cta-buttons">
                <a href="https://waste-wise-iota.vercel.app/" target="_blank" class="btn btn-primary">🚀 Get Started</a>
            </div>
        </section>

        <!-- Footer -->
        <footer>
            <p>© 2025 WasteWise. All rights reserved.</p>
            <p style="color: #22c55e; font-weight: 600; margin-top: 1rem;">Giving technology a second chance</p>
        </footer>
    </div>

    <script>
        // Create animated particles
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            particlesContainer.appendChild(particle);
        }

        // Add scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .tech-item, .roadmap-item').forEach(el => {
            observer.observe(el);
        });
    </script>
</body>
</html>
