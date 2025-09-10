"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/dist/client/link";

export default function Lander() {
    const [step, setStep] = useState(1); // 1=carrier, 2=homeowner, 3=loading, 4=success
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [phone, setPhone] = useState("1-800-000-0000");
    const [loaderStage, setLoaderStage] = useState<number>(-1); // -1 none, 0..2 for loader messages
    const [appNumber, setAppNumber] = useState("");
    const timersRef = useRef<number[]>([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const p = params.get("phone");
        if (p) setPhone(p);

        return () => {
            // cleanup any timers
            timersRef.current.forEach((id) => clearTimeout(id));
        };
    }, []);

    const carriers = ["Allstate", "State Farm", "GEICO", "Progressive", "Other", "Not insured"];

    function handleAnswer(key: string, value: string) {
        setAnswers((prev) => ({ ...prev, [key]: value }));

        if (step === 2) {
            // start loader sequence
            setStep(3);
            setLoaderStage(0);

            // show "Validating your answers..." then "Analyzing options..." then "Confirming eligibility..."
            const t1 = window.setTimeout(() => setLoaderStage(1), 850);
            const t2 = window.setTimeout(() => setLoaderStage(2), 1700);
            const t3 = window.setTimeout(() => {
                // finalize and show success
                const num = `SOL-${Math.floor(1000 + Math.random() * 9000)}`;
                setAppNumber(num);
                setLoaderStage(-1);
                setStep(4);
            }, 2550);

            timersRef.current.push(t1, t2, t3);
        } else {
            setStep((s) => s + 1);
        }
    }

    const loaderMessages = [
        "Validating your answers...",
        "Analyzing options...",
        "Confirming eligibility...",
    ];

    // countdown (5 min = 300 sec)
    const [timeLeft, setTimeLeft] = useState(300);

    useEffect(() => {
        if (step === 4 && timeLeft > 0) {
            const timer = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step, timeLeft]);

    // format countdown mm:ss
    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };


    return (
        <main className="min-h-screen flex flex-col bg-white">
            {/* Top Yellow Bar */}
            <div className="bg-[#ffd814] text-center text-sm py-2 font-medium">
                <span className="text-green-700">★★★★★</span>
                <span className="ml-2">Helped 17,250,579 Americans</span>
            </div>

            {/* HERO + QUIZ (visible on step 1 & 2) */}
            {(step === 1 || step === 2) && (
                <section className="text-center max-w-3xl mx-auto px-4 py-4">
                    <h1 className="text-3xl md:text-[40px] font-bold">
                        Save on Your Full Coverage <span className="text-red-600">Auto Insurance</span> – Get Your Best Rate!
                    </h1>
                    <hr className="mt-4" />

                    <p className="mt-4 text-gray-700 text-base md:text-lg">
                        This is your chance to qualify! Take advantage of this <span className="font-bold">New Safe Driver Savings Program</span> while it’s available. <span className="text-blue-600 font-bold">Act now!</span>
                    </p>

                    <p className="mt-4 font-bold">
                        Take this quiz for free – It will only take 2 minutes.
                        <br />
                        <span className="text-red-600">Last spots available.</span>
                    </p>

                    <div className="flex justify-center mt-6">
                        <div className="bg-gray-50 border rounded-lg shadow-md p-6 w-full max-w-xl text-center">
                            {step === 1 && (
                                <>
                                    <h2 className="text-lg md:text-xl font-bold mb-4">What is your current insurance carrier?</h2>
                                    <div className="grid grid-cols-2 gap-3">
                                        {carriers.map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => handleAnswer("carrier", c)}
                                                className="border-2 border-green-500 rounded-md py-3 hover:bg-green-50 transition font-medium"
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <h2 className="text-lg md:text-xl font-bold mb-4">Are you a homeowner?</h2>
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={() => handleAnswer("homeowner", "Yes")}
                                            className="border-2 border-green-500 rounded-md px-8 py-3 hover:bg-green-50 transition font-medium"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() => handleAnswer("homeowner", "No")}
                                            className="border-2 border-green-500 rounded-md px-8 py-3 hover:bg-green-50 transition font-medium"
                                        >
                                            No
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* LOADER CARD (centered) - hero hidden but testimonials+footer remain visible beneath) */}
            {step === 3 && (
                <section className="flex justify-center px-4 py-12">
                    <div className="bg-gray-50 border rounded-lg shadow-md p-6 w-full max-w-xl text-center">
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                            <div className="flex items-center justify-center gap-3">
                                <span className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                                <div className="text-left">
                                    <div className="font-semibold text-gray-700">
                                        {loaderStage >= 0 ? loaderMessages[loaderStage] : loaderMessages[loaderMessages.length - 1]}
                                    </div>
                                    <div className="text-sm text-gray-500">Please wait while we finish your eligibility check.</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* SUCCESS CARD */}
            {step === 4 && (
                <section className="flex justify-center px-4 py-12">
                    <div className="bg-white border rounded-lg shadow-md p-6 w-full max-w-lg text-center">
                        <h2 className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2"><FaCheckCircle /> Congratulations!</h2>
                        <p className="mt-4 text-gray-700 text-base md:text-lg font-semibold">You qualify for up to <span className="text-red-600 font-bold">40% OFF</span> your auto insurance now.</p>
                        <p className="mt-2 text-gray-700 text-base md:text-lg">Call now to get your quote!</p>

                        <Link href={`tel:${phone}`} className="mt-6 block w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition text-lg font-bold">Call now</Link>

                        <p className="mt-4 font-bold text-lg">
                            Your place is reserved for {formatTime(timeLeft)}
                        </p>

                        <p className="mt-3 text-[12px] text-gray-500">Limited availability. Application deadline is coming soon. Your application number is: SOL-8828
                        </p>

                    </div>
                </section>
            )}

            {/* TESTIMONIALS (always visible below loader/success) */}
            <section className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                {[
                    {
                        img: "/testimonial1.png",
                        text: `I used to pay $217/month for car insurance. Now I only pay $67 with full coverage! I thought switching would be complicated, but the agent was clear, patient, and honest. <b>I recommend calling right away!</b>`,
                        name: "Sarah A. Smythe – Dallas, TX",
                    },
                    {
                        img: "/testimonial2.png",
                        text: `I was overpaying for years. They helped me save over $150 a month without changing my coverage. Everything was quick, easy, and no pressure. <b>I called, and it was the best thing I ever did!</b>`,
                        name: "Peter J. Lewis – Miami, FL",
                    },
                    {
                        img: "/testimonial3.png",
                        text: `I waited too long. When I finally called, they explained everything and helped me cut my premium nearly in half. <b>If you're thinking about it, do it now.</b>`,
                        name: "Flossie R. Brown – Phoenix, AZ",
                    },
                ].map((t, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <img
                            src={t.img}
                            alt={t.name}
                            className="w-20 h-20 rounded-full object-cover"
                        />
                        <div>
                            <p
                                className="italic text-gray-700"
                                dangerouslySetInnerHTML={{ __html: t.text }}
                            />
                            <div className="text-yellow-500 mt-2">★★★★★</div>
                            <p className="mt-1 font-bold text-gray-900">{t.name}</p>
                        </div>
                    </div>
                ))}
            </section>


            {/* Footer (always visible) */}
            <footer className="w-full bg-[#343a40] text-white text-center px-4 py-8 text-sm mt-auto">
                <div className="max-w-xl mx-auto space-y-4">
                    <nav className="space-x-4 mb-4 text-base">
                        <Link href="https://luxeeloomm.com/" className="underline hover:text-white">Start</Link>
                        <Link href="https://luxeeloomm.com/aplica/privacy-policy.html" className="underline hover:text-white">Privacy Policy</Link>
                        <Link href="https://luxeeloomm.com/aplica/terms-of-services.html" className="underline hover:text-white">Terms of Services</Link>
                        <Link href="https://luxeeloomm.com/aplica/contact-us.html" className="underline hover:text-white">Contact us</Link>
                    </nav>
                    <p className="mb-4 text-[14px]">This website is for informational purposes only and does not constitute legal, tax, or financial advice. The information provided does not guarantee specific results, and results may vary based on individual circumstances. We are not a law firm or government entity. We recommend consulting with a qualified professional before making financial decisions. By using this site, you agree that any action taken is at your own risk.</p>
                    <p className="font-semibold">© {new Date().getFullYear()} All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
