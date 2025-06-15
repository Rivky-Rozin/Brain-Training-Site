import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-800 mb-6">
                        Welcome to BrainBoost
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Your personal brain trainer. Improve your memory, focus, and quick thinking 
                        through fun, short exercises. Track your progress and watch yourself improve!
                    </p>
                    <Link 
                        to="/games"
                        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                        Start Training
                    </Link>
                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-blue-600 text-4xl mb-4">🧠</div>
                        <h3 className="text-xl font-semibold mb-2">Memory Training</h3>
                        <p className="text-gray-600">
                            Challenge your memory with engaging exercises designed to improve recall and retention.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-blue-600 text-4xl mb-4">⚡</div>
                        <h3 className="text-xl font-semibold mb-2">Quick Thinking</h3>
                        <p className="text-gray-600">
                            Enhance your reaction time and decision-making skills with timed challenges.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-blue-600 text-4xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                        <p className="text-gray-600">
                            Monitor your improvement with detailed statistics and visual progress charts.
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Ready to Boost Your Brain?
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Join thousands of users who are already improving their cognitive abilities.
                    </p>
                    <Link 
                        to="/games"
                        className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                        Get Started Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
