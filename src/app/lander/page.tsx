"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type Step = 1 | 2 | 3 | 4;

interface Message {
    step: Step;
    from: "emily" | "user";
    text: string;
}

export default function Lander() {
    const [step, setStep] = useState<Step>(1);
    const [countdown, setCountdown] = useState(120);
    const [phone] = useState<string>("+1-800-555-0123");
    const [answers, setAnswers] = useState<{ [k: number]: string }>({});
    const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
    const [showTyping, setShowTyping] = useState(false);

    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const lastMessageRef = useRef<HTMLDivElement>(null); // ref for last message

    const todayDate = useMemo(() => {
        const now = new Date();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const yyyy = now.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }, []);

    const messages: Message[] = [
        { step: 1, from: "emily", text: "Hey 👋" },
        { step: 1, from: "emily", text: "I'm Emily, your assistant to help you find the best auto insurance rate." },
        { step: 1, from: "emily", text: "Would you like to check if you're eligible to save up to 40%? Tap Yes to find out! 😍" },

        { step: 2, from: "user", text: answers[1] || "" },
        { step: 2, from: "emily", text: "Perfect, I just need to ask you 2 questions..." },
        { step: 2, from: "emily", text: 'Are you over the age of 25? Tap "Yes" or "No"' },

        { step: 3, from: "user", text: answers[2] || "" },
        { step: 3, from: "emily", text: "Are you currently insured?" },

        { step: 4, from: "user", text: answers[3] || "" },
        { step: 4, from: "emily", text: "🎉 Congratulations! You're pre-qualified for rates as low as $39/month with full coverage." },
        { step: 4, from: "emily", text: "⏳ Hurry! Your Pre-Qualification Expires in 2 Minutes!" },
        { step: 4, from: "emily", text: "Tap the Button Below to Call Now!" },
    ];

    const messagesMemo = useMemo(() => messages, [messages]);

    // Countdown timer
    useEffect(() => {
        if (step === 4) {
            const timer = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
            return () => clearInterval(timer);
        }
    }, [step]);

    // Show messages one by one with typing animation
    useEffect(() => {
        const stepMessages = messagesMemo.filter((m) => m.step <= step);
        const idx = visibleMessages.length;

        if (idx >= stepMessages.length) return;

        const nextMessage = stepMessages[idx];
        if (!nextMessage) return;

        if (nextMessage.from === "emily") {
            setShowTyping(true);
            const typingDelay = step === 4 ? 300 : 1000;
            const timeout = setTimeout(() => {
                setVisibleMessages((prev) => [...prev, nextMessage]);
                setShowTyping(false);
            }, typingDelay);
            return () => clearTimeout(timeout);
        } else {
            setVisibleMessages((prev) => [...prev, nextMessage]);
        }
    }, [step, visibleMessages, messagesMemo]);

    // function handleUserAnswer(ans: string) {
    //     if (step === 1) {
    //         setAnswers({ ...answers, 1: ans });
    //         setStep(2);
    //     } else if (step === 2) {
    //         setAnswers({ ...answers, 2: ans });
    //         setStep(3);
    //     } else if (step === 3) {
    //         setAnswers({ ...answers, 3: ans });
    //         setStep(4);
    //     }
    // }

    const formatted = useMemo(() => {
        const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
        const ss = String(countdown % 60).padStart(2, "0");
        return `${mm}:${ss}`;
    }, [countdown]);

    const emilyMessagesCurrentStep = messages.filter(
        (m) => m.step === step && m.from === "emily"
    );

    const lastEmilyMessageShown = emilyMessagesCurrentStep.length
        ? visibleMessages.some(
            (m) =>
                m.from === "emily" &&
                m.text === emilyMessagesCurrentStep[emilyMessagesCurrentStep.length - 1].text
        )
        : true;

    const hasInteracted = useRef(false); // track if user answered / moved beyond initial messages

    // Call this whenever the user sends an answer
    function handleUserAnswer(ans: string) {
        if (!hasInteracted.current) hasInteracted.current = true;

        if (step === 1) {
            setAnswers({ ...answers, 1: ans });
            setStep(2);
        } else if (step === 2) {
            setAnswers({ ...answers, 2: ans });
            setStep(3);
        } else if (step === 3) {
            setAnswers({ ...answers, 3: ans });
            setStep(4);
        }
    }

    // Smart autoscroll only after user interaction
    useEffect(() => {

        const container = chatContainerRef.current;
        if (!container) return;

        const isNearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 100;

        if (isNearBottom) {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    }, [visibleMessages, step]);

    return (
        <div className="flex flex-col items-center bg-white">
            <div className="text-center mt-4 text-base md:text-lg px-4">
                <p className="text-red-600 font-bold">
                    Attention: Registration closes on {todayDate} at midnight.
                </p>
                <h1 className="text-xl md:text-3xl font-bold mt-2">
                    See If You Qualify For Low Cost Auto Insurance Before The Deadline.
                </h1>
            </div>
            <div ref={chatContainerRef} className="flex flex-col mt-2 w-full max-w-md space-y-3 min-h-[85vh] px-4">
                <p className="text-center flex justify-center items-center"><Image src="/dot.gif" alt="Emily is online" width={40} height={40} /> Emily is online</p>

                <AnimatePresence>
                    {visibleMessages.map((m, idx) => {
                        const isLast = idx === visibleMessages.length - 1;
                        return (
                            <motion.div
                                key={idx}
                                ref={isLast ? lastMessageRef : null}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className={`flex items-end ${m.from === "emily" ? "justify-start" : "justify-end"}`}
                            >
                                {m.from === "emily" && (
                                    <div className="w-8 h-8 mr-2 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                                        🤖
                                    </div>
                                )}
                                <div
                                    className={`px-4 py-2 rounded-xl max-w-[70%] ${m.from === "emily"
                                        ? "bg-gray-100 text-gray-800"
                                        : "bg-blue-500 text-white"
                                        }`}
                                >
                                    {m.text}
                                </div>
                                {m.from === "user" && (
                                    <div className="w-8 h-8 ml-2 rounded-full bg-blue-400 flex items-center justify-center text-sm text-white">
                                        👤
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Typing indicator */}
                {showTyping && (
                    <div className="flex items-end justify-start space-x-2">
                        <div className="w-8 h-8 mr-2 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                            🤖
                        </div>
                        <div className="flex space-x-1">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></span>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                {lastEmilyMessageShown && (
                    <div className="mb-20" ref={lastMessageRef}>
                        {step === 1 && (
                            <button
                                className="mt-2 bg-blue-600 text-white py-3 rounded-xl w-full"
                                onClick={() => handleUserAnswer("Yes")}
                            >
                                Yes
                            </button>
                        )}
                        {step === 2 && (
                            <div className="flex space-x-3 mt-2">
                                <button
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-xl"
                                    onClick={() => handleUserAnswer("Yes")}
                                >
                                    Yes
                                </button>
                                <button
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl"
                                    onClick={() => handleUserAnswer("No")}
                                >
                                    No
                                </button>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="flex space-x-3 mt-2">
                                <button
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-xl"
                                    onClick={() => handleUserAnswer("Yes")}
                                >
                                    Yes
                                </button>
                                <button
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl"
                                    onClick={() => handleUserAnswer("No")}
                                >
                                    No
                                </button>
                            </div>
                        )}
                        {step === 4 && (
                            <div className="mt-4 space-y-2">
                                <div className="text-center text-lg font-semibold">
                                    Expires in: {formatted}
                                </div>
                                <Link
                                    href={`tel:${phone}`}
                                    className="block w-full bg-green-600 text-white py-3 rounded-xl text-center text-xl"
                                >
                                    Call Now 📞
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <footer className="bg-gray-100 text-gray-800 p-8 w-full">
                <div className="max-w-5xl mx-auto text-sm space-y-4">
                    <p className="font-bold">IMPORTANT ADVERTISER DISCLAIMER:</p>
                    <p className="text-justify">
                        Programs range from 12 to 48 months. Customers who are able to remain in the program and pay off all debt realize approximate savings of 50% before fees, or 30% including program fees, over 24 to 48 months. All claims are based on enrolled debt. Not all debt is eligible for enrollment. Not all customers complete the program for a variety of reasons, including their ability to save sufficient funds. Estimates based on past results, which will vary based on specific circumstances. Programs do not guarantee that your debts will be reduced by a specific amount or percentage or that you will be debt-free within a specific time period. Programs do not assume consumer debt, make monthly payments to creditors, or provide tax, bankruptcy, accounting, or legal advice or credit repair services. Programs are not available in all states and fees may vary by state. Contact a tax professional to discuss the tax consequences of liquidation. Consult with a bankruptcy attorney for more information about bankruptcy. Depending on your state, there may be programs available to recommend a local tax professional and/or bankruptcy attorney. You may be subject to collections or lawsuits by creditors or collectors. Your outstanding debt may increase due to the accumulation of fees and interest. Read and understand all program materials before enrolling, including the potential adverse impact on credit rating.
                    </p>
                    <p className="text-justify">
                        Certain types of debt are not eligible for enrollment. Some creditors are not eligible to enroll because they do not deal with debt relief companies.
                    </p>

                    <div className="flex space-x-4 mt-4">
                        <button
                            className="underline text-blue-600 hover:text-blue-800"
                            onClick={() => setShowPrivacy(true)}
                        >
                            Privacy Policy
                        </button>
                        <button
                            className="underline text-blue-600 hover:text-blue-800"
                            onClick={() => setShowTerms(true)}
                        >
                            Terms and Conditions
                        </button>
                    </div>
                </div>

                {/* Overlay & Privacy Policy Popup */}
                {showPrivacy && (
                    <div className="fixed inset-0 bg-white bg-opacity-95 flex justify-center items-start overflow-auto z-50 p-8">
                        <div className="bg-white max-w-4xl w-full p-8 shadow-lg rounded-md relative">
                            <button
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold text-3xl"
                                onClick={() => setShowPrivacy(false)}
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
                            <div className="space-y-4 text-sm text-justify">
                                <p>
                                    This Privacy Policy describes how we collect, use, and share information about you when you use our landing page. By using our landing page, you agree to the terms of this Privacy Policy.
                                </p>
                                <p className="font-bold">Information We Collect</p>
                                <p>We may collect the following information about you:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>
                                        <span className="font-bold">Personal Information:</span> We may collect personal information that you voluntarily provide to us, such as your name, email address, and phone number.
                                    </li>
                                    <li>
                                        <span className="font-bold">Usage Information:</span> We may collect information about your use of the landing page, such as your IP address, browser type, and pages visited.
                                    </li>
                                    <li>
                                        <span className="font-bold">Cookies:</span> We may use cookies and similar technologies to collect information about your use of the landing page and to personalize your experience. Cookies are small text files that are placed on your device when you visit a website.
                                    </li>
                                </ul>

                                <p className="font-bold">How We Use Your Information</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>To provide and improve our landing page.</li>
                                    <li>To communicate with you.</li>
                                    <li>To comply with legal obligations.</li>
                                </ul>

                                <p className="font-bold">How We Share Your Information</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Service Providers</li>
                                    <li>Business Transfers</li>
                                    <li>Legal Obligations</li>
                                </ul>

                                <p>
                                    <span className="font-bold">Your Choices:</span> You may choose to opt-out of receiving marketing communications from us by following the unsubscribe instructions included in our emails.
                                </p>
                                <p>
                                    <span className="font-bold">Cookies:</span> You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. However, if you disable or refuse cookies, some parts of the landing page may be inaccessible or not function properly.
                                </p>
                                <p>
                                    <span className="font-bold">Data Security:</span> We take reasonable measures to protect your information from unauthorized access, use, and disclosure. However, no transmission of information over the internet is completely secure, and we cannot guarantee the security of your information.
                                </p>
                                <p>
                                    <span className="font-bold">Changes to this Privacy Policy:</span> We may update this Privacy Policy from time to time. The updated Privacy Policy will be posted on our landing page with a new effective date. Your continued use of the landing page following any changes to this Privacy Policy constitutes your acceptance of such changes.
                                </p>
                                <p>
                                    <span className="font-bold">Contact Us:</span> If you have any questions or concerns about this Privacy Policy or our practices, please contact us.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Overlay & Terms Popup */}
                {showTerms && (
                    <div className="fixed inset-0 bg-white bg-opacity-95 flex justify-center items-start overflow-auto z-50 p-8">
                        <div className="bg-white max-w-4xl w-full p-8 shadow-lg rounded-md relative">
                            <button
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold text-lg"
                                onClick={() => setShowTerms(false)}
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
                            <div className="space-y-4 text-sm text-justify">
                                <p>
                                    Welcome to our landing page, which is designed to collect data on users. By accessing or using this landing page, you agree to be bound by the following terms and conditions:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li><span className="font-bold">User Data Collection:</span> We collect user data, including but not limited to name, email address, phone number, and other information voluntarily provided by the user. This information will be used for our internal purposes and may be shared with third-party service providers to facilitate our services.</li>
                                    <li><span className="font-bold">Consent to Data Collection:</span> By using our landing page and submitting your personal information, you consent to the collection, use, and sharing of your information as described in our Privacy Policy.</li>
                                    <li><span className="font-bold">Accuracy of Information:</span> You represent and warrant that all information provided by you is accurate, complete, and up-to-date. You agree to update your information promptly if there are any changes.</li>
                                    <li><span className="font-bold">User Conduct:</span> You agree not to use this landing page for any unlawful purpose or in any way that may harm, disrupt, or interfere with the functioning of the landing page. You further agree not to submit any content that is offensive, defamatory, or otherwise inappropriate.</li>
                                    <li><span className="font-bold">Intellectual Property:</span> All content on this landing page, including but not limited to text, graphics, logos, images, and software, is the property of the landing page owner or its licensors and is protected by intellectual property laws.</li>
                                    <li><span className="font-bold">Disclaimer of Warranties:</span> We provide this landing page on an “as is” and “as available” basis. We make no representations or warranties of any kind, express or implied, regarding the use or the results of this landing page in terms of its correctness, accuracy, reliability, or otherwise.</li>
                                    <li><span className="font-bold">Limitation of Liability:</span> To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with the use or inability to use this landing page.</li>
                                    <li><span className="font-bold">Indemnification:</span> You agree to indemnify and hold harmless the landing page owner, its affiliates, and their respective officers, directors, employees, and agents from any and all claims, damages, expenses, and liabilities arising out of your use of this landing page.</li>
                                    <li><span className="font-bold">Modification:</span> We reserve the right to modify or update these terms and conditions at any time without prior notice. Your continued use of this landing page constitutes your acceptance of any such changes.</li>
                                    <li><span className="font-bold">Governing Law and Jurisdiction:</span> These terms and conditions shall be governed by and construed in accordance with the laws of [insert jurisdiction]. Any disputes arising out of or in connection with these terms and conditions shall be submitted to the exclusive jurisdiction of the courts of The United States of America. If you have any questions or concerns about these terms and conditions, please contact us.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </footer>
        </div>
    );
}
