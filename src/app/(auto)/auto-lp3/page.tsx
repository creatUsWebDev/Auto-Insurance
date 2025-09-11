"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Lander3() {
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
    // const [savings, setSavings] = useState<number>(0);

    useEffect(() => {
        if (step === 4) {
            const timer = setTimeout(() => setStep(5), 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // useEffect(() => {
    //     if (step === 5) {
    //         setSavings(Math.floor(Math.random() * 500) + 500);
    //     }
    // }, [step]);

    const progressDots = [1, 2, 3];

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 text-center shadow">
                <h1 className="text-2xl font-extrabold tracking-wide">Auto Insurance Quote</h1>
                <p className="text-sm font-medium">Auto Insurance For Less</p>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 text-center">
                {/* Headline + Subtext (show only step 1–3) */}
                <AnimatePresence>
                    {step <= 3 && (
                        <motion.div
                            key="headline"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-xl mb-8"
                        >
                            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 leading-snug">
                                Stop Overpaying for Car Insurance
                            </h2>
                            <p className="mt-3 text-lg text-gray-700 font-semibold">
                                Compare quotes from top providers and save up to $967.
                            </p>
                            <p className="mt-1 text-gray-600 text-base">Fast, simple & hassle-free!</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Dots (show only step 1–3) */}
                {step <= 3 && (
                    <div className="flex justify-center mb-8 space-x-4">
                        {progressDots.map((dot) => (
                            <span
                                key={dot}
                                className={`h-4 w-4 rounded-full transition-all duration-300 ${step === dot ? "bg-blue-600 scale-110" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Form + Steps */}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-md"
                        >
                            <h3 className="text-xl font-bold mb-6 text-blue-900">
                                Are you currently insured?
                            </h3>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition"
                                >
                                    YES
                                </button>
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition"
                                >
                                    NO
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-md"
                        >
                            <h3 className="text-xl font-bold mb-6 text-blue-900">
                                How Many Cars Do You Have?
                            </h3>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setStep(3)}
                                    className="w-full py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition"
                                >
                                    ONE
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="w-full py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition"
                                >
                                    2 OR MORE
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-md"
                        >
                            <h3 className="text-xl font-bold mb-6 text-blue-900">
                                Do you Own or Rent your home?
                            </h3>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setStep(4)}
                                    className="w-full py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition"
                                >
                                    OWN
                                </button>
                                <button
                                    onClick={() => setStep(4)}
                                    className="w-full py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition"
                                >
                                    RENT
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center"
                        >
                            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-6"></div>
                            <p className="text-blue-900 font-bold text-lg">
                                Comparing Insurance Quotes...
                            </p>
                            <p className="text-gray-600 text-sm mt-2">
                                Finding the best rates from top providers
                            </p>
                        </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div
                            key="congrats"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-md bg-white border rounded-2xl shadow-lg p-8 text-center"
                        >
                            <span className="text-5xl mb-4 block">🎉</span>
                            <h3 className="text-2xl font-extrabold text-blue-900 mb-3">
                                Congratulations!
                            </h3>
                            <p className="text-gray-700 mb-6 text-base font-medium">
                                We found you amazing rates from top insurance providers!
                            </p>
                            <button className="w-full py-4 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-lg shadow transition mb-4">
                                You could save up to $967!
                            </button>
                            <Link href="#" className="block w-full py-4 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-bold text-lg shadow transition hover:from-[#06644a] hover:to-[#06644a]">
                                📞 Call Now
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="p-6 text-xs text-gray-600 text-center border-t bg-gray-50">
                <p className="max-w-3xl mx-auto">
                    <strong>Disclaimer:</strong> This is an advertisement, not a news article, blog, or consumer protection update. The
                    website provides information on various products and services to help users make informed decisions. Details, such as
                    prices and offers, come from our partners and are subject to change without notice. While we strive for accuracy, the
                    information here is not legal or professional advice. Listings do not imply endorsement. Insurance terms are governed
                    by the policy, and all approvals, premiums, and fees are determined by the underwriting insurer. This content does not
                    alter policy terms.
                </p>
                <p className="mt-4">Copyright © 2025 Trusted Auto Savings | All rights reserved</p>
            </footer>
        </div>
    );
}
