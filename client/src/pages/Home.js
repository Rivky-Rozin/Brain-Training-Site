import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// צבעים בהשראת סט האייקונים
const palette = {
    bg: '#FDFDFD', // רקע כללי
    accent1: '#7CC3B6', // טורקיז
    accent2: '#F2C94C', // צהוב
    accent3: '#5E9A92', // כחול־ירקרק כהה
    accent4: '#E3F2F1', // תכלת אפרפר
    accent5: '#EB5757', // אדום עדין
    textMain: '#222',
    textSub: '#5E9A92',
    border: '#CDE1DB',
};

const featureIcons = [
    'https://cdn-icons-png.flaticon.com/512/2913/2913466.png', // lightbulb puzzle
    'https://cdn-icons-png.flaticon.com/512/2913/2913470.png', // brain head
    'https://cdn-icons-png.flaticon.com/512/2913/2913472.png', // chat cloud
];

const pricingIconsLocal = [
    require('../assets/styles/7.png'),
    require('../assets/styles/8.png'),
    require('../assets/styles/9.png'),
];

const testimonialsLocal = [
    {
        quote: 'I feel more focused at work!',
        name: 'Dana, Tel Aviv',
        icon: require('../assets/styles/10.png'),
    },
    {
        quote: 'The memory games are actually fun and challenging.',
        name: 'Tom, Haifa',
        icon: require('../assets/styles/11.png'),
    },
    {
        quote: 'I love tracking my progress and seeing real improvement!',
        name: 'Maya, Jerusalem',
        icon: require('../assets/styles/12.png'),
    },
];

const iconBase = process.env.PUBLIC_URL + '/style/באסטס/';

const heroIcons = [
    { src: iconBase + '4.png', style: { left: 0, top: 0, width: 64, height: 64, background: palette.accent1 } },
    { src: iconBase + '6.png', style: { right: 0, top: 10, width: 64, height: 64, background: palette.accent5 } },
    { src: iconBase + '2.png', style: { left: 30, bottom: 0, width: 56, height: 56, background: palette.accent4 } },
    { src: iconBase + '3.png', style: { right: 30, bottom: 0, width: 56, height: 56, background: palette.accent1 } },
    { src: iconBase + '5.png', style: { left: 120, top: -30, width: 48, height: 48, background: palette.accent2 } },
];

const features = [
    {
        icon: require('../assets/styles/2.png'),
        title: 'Improve Focus',
        desc: 'Enhance your concentration with targeted exercises',
    },
    {
        icon: require('../assets/styles/3.png'),
        title: 'Memory Training',
        desc: 'Boost your memory with challenging brain games',
    },
    {
        icon: require('../assets/styles/4.png'),
        title: 'Problem Solving',
        desc: 'Develop your logic and reasoning skills',
    },
];

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col items-center">
            {/* Hero Section - עיצוב בהשראת התמונה */}
            <div className="home-hero">
                {/* Left: Text & Button */}
                <div className="home-hero-left">
                    <h1 className="home-hero-title" style={{ fontSize: '5.5rem', lineHeight: 1.1 }}>
                        Train Your Brain
                    </h1>
                    <p className="home-hero-desc" style={{ fontSize: '1.5rem', marginBottom: 16 }}>
                        Boost your cognitive skills with fun and engaging exercises designed to sharpen your mind.
                    </p>
                    <Link
                        to="/games"
                        className="home-hero-btn"
                        style={{
                            background: '#F3654A',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            padding: '0.5rem 1.8rem',
                            borderRadius: 999,
                            boxShadow: '0 4px 24px 0 rgba(94,154,146,0.10)',
                            letterSpacing: '-0.5px',
                            marginTop: 15,
                        }}
                    >
                        Get Started
                    </Link>
                </div>
                {/* Right: Brain Image */}
                <div className="home-hero-right">
                    <img src={require('../assets/styles/1.png')} alt="brain" className="home-hero-brain" />
                </div>
            </div>

            {/* Features Section */}
            <section className="w-full flex flex-col items-center py-12 px-4">
                <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
                    {features.map((feature, i) => (
                        <div key={i} className="flex flex-col items-center justify-center rounded-3xl shadow-lg p-10 md:p-14 bg-white" style={{ width: 340, minWidth: 220, maxWidth: 380, maxHeight: 340, overflow: 'hidden', textAlign: 'center', display: 'flex' }}>
                            <img src={feature.icon} alt={feature.title} style={{ width: '90%', height: 'auto', maxWidth: 140, marginBottom: 24, objectFit: 'contain' }} />
                            <h3 className="text-xl font-bold mb-3 w-full" style={{ color: palette.textMain, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                {feature.title}
                            </h3>
                            <p className="text-base flex-1 flex items-center justify-center w-full" style={{ color: palette.textSub, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section className="w-full flex flex-col items-center py-12 px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12" style={{ color: palette.textMain, letterSpacing: '-0.2px' }}>Choose Your Plan</h2>
                <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
                    {['Focus Pro', 'Memory Master', 'TYB Premium'].map((plan, i) => {
                        // צבעי מסגרת, כפתור וכותרת
                        const borderColors = [palette.accent1, palette.accent5, palette.textMain];
                        const titleColors = [palette.accent1, palette.accent5, palette.textMain];
                        const buttonBg = ['#F3654A', '#F3654A', '#F3654A'];
                        const buttonText = ['#fff', '#fff', '#fff'];
                        const buttonLabels = ['Start Focus', 'Start Memory', 'Go Premium'];
                        return (
                            <div key={plan}
                                className="flex flex-col items-center justify-between rounded-3xl shadow-lg p-10 md:p-14 border-4 bg-white"
                                style={{
                                    borderColor: borderColors[i],
                                    minWidth: 270,
                                    maxWidth: 340,
                                    width: 300,
                                    boxSizing: 'border-box',
                                    overflow: 'hidden',
                                    textAlign: 'center',
                                    display: 'flex',
                                    height: 440,
                                    position: 'relative',
                                    background: 'white',
                                    boxShadow: '0 4px 24px 0 rgba(94,154,146,0.08)'
                                }}
                            >
                                <img src={pricingIconsLocal[i]} alt="plan" style={{ width: 80, height: 80, marginBottom: 18, objectFit: 'contain' }} />
                                <div className="text-xl font-bold mb-2 w-full" style={{ color: titleColors[i], wordBreak: 'break-word', overflowWrap: 'break-word', letterSpacing: '-0.5px', lineHeight: 1.1 }}>{plan}</div>
                                <div className="text-2xl font-extrabold mb-4 w-full" style={{ color: palette.textMain, lineHeight: 1.1 }}>{['₪19/mo', '₪29/mo', '₪49/mo'][i]}</div>
                                <ul className="mb-6 space-y-2 w-full" style={{ padding: 0, margin: 0, listStyle: 'none', color: palette.textMain, fontWeight: 400, lineHeight: 1.2 }}>
                                    <li className="text-base">All features included</li>
                                    <li className="text-base">Personal progress</li>
                                    <li className="text-base">Community access</li>
                                </ul>
                                <button
                                    className="px-8 py-3 rounded-full font-bold text-lg border-0 transition-all duration-200 w-full mt-2"
                                    style={{
                                        color: buttonText[i],
                                        background: buttonBg[i],
                                        boxShadow: 'none',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {buttonLabels[i]}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="w-full flex flex-col items-center py-16 px-4" style={{ background: palette.accent4 }}>
                <h2 className="text-2xl font-bold text-center mb-12" style={{ color: palette.accent3 }}>What Our Users Say</h2>
                <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
                    {testimonialsLocal.map((t, i) => (
                        <div key={i} className="flex flex-col items-center justify-center shadow-lg" style={{ background: '#fff', width: 260, height: 260, minWidth: 200, maxWidth: 300, maxHeight: 300, borderRadius: '50%', overflow: 'hidden', textAlign: 'center', display: 'flex', boxShadow: '0 4px 24px 0 rgba(94,154,146,0.10)' }}>
                            <img src={t.icon} alt="testimonial" style={{ width: 100, height: 100, margin: '20px 0 -15px 0', objectFit: 'contain' }} />
                            <div className="font-bold mb-2 text-lg text-center w-full px-4" style={{ color: palette.accent3, wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: 1.3 }}>
                                "{t.quote}"
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 text-center w-full mb-2" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>- {t.name}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final Call to Action */}
            <section className="w-full flex flex-col items-center py-16">
                <Link
                    to="/games"
                    className="px-14 py-5 rounded-full text-2xl font-bold shadow-lg hover:scale-105 transition-all duration-200"
                    style={{
                        background: '#F3654A',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 999,
                        boxShadow: '0 4px 24px 0 rgba(94,154,146,0.10)',
                        letterSpacing: '-0.5px',
                        minWidth: 320,
                        textAlign: 'center',
                    }}
                >
                    Get Started Now
                </Link>
            </section>
        </div>
    );
};

export default Home;
