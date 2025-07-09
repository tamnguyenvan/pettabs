import React from 'react';

interface Quote {
    text: string;
    author: string;
}

const quotes: Quote[] = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        text: "Stay hungry, stay foolish.",
        author: "Steve Jobs"
    },
    {
        text: "Think different.",
        author: "Apple Inc."
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    }
];

const getRandomQuote = (): Quote => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
};

const Inspiration: React.FC = () => {
    const [currentQuote, setCurrentQuote] = React.useState<Quote>(getRandomQuote());
    const [fade, setFade] = React.useState(true);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentQuote(getRandomQuote());
                setFade(true);
            }, 500);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'} text-center`}>
            <blockquote className="text-2xl md:text-3xl font-light italic text-gray-700 dark:text-gray-200 mb-4">
                "{currentQuote.text}"
            </blockquote>
            <footer className="text-lg text-gray-600 dark:text-gray-400">
                — {currentQuote.author}
            </footer>
        </div>
    );
};

export default Inspiration;