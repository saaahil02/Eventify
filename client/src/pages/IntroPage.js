import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/IntroPage.css';

// Feature card component
const FeatureCard = ({ icon, name }) => (
    <div className="feature-card">
        <div className="feature-icon">{icon}</div>
        <p>{name}</p>
    </div>
);

const IntroPage = () => {
    const navigate = useNavigate();

    const features = [
        { name: 'Student Registration', icon: '🎓' },
        { name: 'Event Listing', icon: '📅' },
        { name: 'Custom Forms', icon: '📝' },
        { name: 'Sponsor Connections', icon: '🤝' },
        { name: 'Live Chat', icon: '💬' },
        { name: 'Data Analytics', icon: '📊' },
        { name: 'Mobile Friendly', icon: '📱' },
        { name: 'Easy Enrollment', icon: '✅' },
    ];

    return (
        <div className="homepage">
            {/* Header Section */}
            <header className="homepage-header">
                <div className="header-top">
                    <div className="logo">Eventify</div>
                    <div className="auth-buttons">
                        <button className="btn-secondary" onClick={() => navigate("/login")}>Log In</button>
                        <button className="btn-primary" onClick={() => navigate("/register")}>Sign Up</button>
                    </div>
                </div>
                <p>The ultimate platform to manage and discover events.</p>
            </header>

            {/* Features Section */}
            <section className="features-section">
                <h2>The best of Eventify</h2>
                <p>Explore our key features designed for seamless event management.</p>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} icon={feature.icon} name={feature.name} />
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <h2>About Eventify</h2>
                <p>
                    Eventify is an innovative platform tailored for inter-college events. 
                    Whether you are a student looking to participate or an organizer 
                    planning a large-scale event, Eventify makes it easy and efficient 
                    for everyone.
                </p>
                <p>
                    From custom forms and data analytics to live chat and sponsor 
                    connections, Eventify ensures that every aspect of event 
                    management is smooth and enjoyable.
                </p>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <h2>Contact Us</h2>
                <p>Have questions or need support? We're here to help!</p>
                <p><strong>Email:</strong> support@eventify.com</p>
                <p><strong>Phone:</strong> +1 234 567 890</p>
                <p>
                    <strong>Follow us:</strong>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a>,
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"> Twitter</a>,
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a>
                </p>
            </section>

            {/* Footer */}
            <footer className="homepage-footer">
                <p>Eventify © 2024. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default IntroPage;
