"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  CheckCircle,
  Shield,
  Code,
  BarChart2,
  Award,
  Brain,
  FileText,
  MessageSquare,
  Facebook,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "../../../public/assets/Logo/hire-swift-white.svg";
import AssessmentImage from "../../../public/assets/images/assessment-module.svg";
import AssessmentReport from "../../../public/assets/images/assessment-report.svg";
import { useRouter } from "next/navigation";
import VideoPopup from "../VideoPopup/VideoPopup";

const HomePage = () => {
  const [stats, setStats] = useState({
    assessments: 0,
    companies: 0,
    candidates: 0,
  });
  const [showVideo, setShowVideo] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setStats((prev) => {
        if (
          prev.assessments >= 50000 &&
          prev.companies >= 3000 &&
          prev.candidates >= 100000
        ) {
          clearInterval(interval);
          return prev;
        }
        return {
          assessments: Math.min(prev.assessments + 1000, 50000),
          companies: Math.min(prev.companies + 60, 3000),
          candidates: Math.min(prev.candidates + 2000, 100000),
        };
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "AI Assessment Engine",
      description:
        "Evaluate candidates with theoretical and coding challenges, and speech-based questions through our integrated IDE and AI evaluation.",
      icon: <Code size={24} className="text-purple-500" />,
    },
    {
      title: "AI Evaluation Engine",
      description:
        "Instantly analyze candidate responses using advanced LLMs like Gemini, Claude, and GPT with detailed feedback.",
      icon: <Brain size={24} className="text-purple-500" />,
    },
    {
      title: "Anti-Cheating Module",
      description:
        "Ensure assessment integrity with face verification, tab switching detection, and activity monitoring.",
      icon: <Shield size={24} className="text-purple-500" />,
    },
    {
      title: "Gamification & Ranking",
      description:
        "Motivate candidates with tokens, performance-based leaderboards, and achievement badges.",
      icon: <Award size={24} className="text-purple-500" />,
    },
    {
      title: "Role-Based Dashboards",
      description:
        "Tailored interfaces for candidates, recruiters, and admins with specific features for each role.",
      icon: <BarChart2 size={24} className="text-purple-500" />,
    },
    {
      title: "Smart Reports & Analytics",
      description:
        "Generate comprehensive PDF reports with performance charts, feedback tables, and actionable insights.",
      icon: <FileText size={24} className="text-purple-500" />,
    },
  ];

  const steps = [
    {
      title: "Create Assessment",
      description:
        "Set up custom assessments with multiple question types including theoretical, coding challenges, and speech-based questions.",
    },
    {
      title: "AI-Powered Evaluation",
      description:
        "Our AI automatically evaluates candidate responses, providing instant feedback and detailed analysis.",
    },
    {
      title: "Receive Smart Reports",
      description:
        "Get comprehensive reports with performance metrics, charts, and actionable insights for hiring decisions.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-8 py-5 bg-black shadow-lg">
        <div>
          <Image src={LogoImage} alt="Logo" width={150} height={100} />
        </div>
        <nav className="hidden md:flex space-x-8 text-gray-100">
          <Link
            href="/"
            className="text-white font-medium hover:text-purple-400 transition-all duration-300"
          >
            Assessments
          </Link>
          <Link
            href="/"
            className="text-white font-medium hover:text-purple-400 transition-all duration-300"
          >
            Features
          </Link>
          <Link
            href="/"
            className="text-white font-medium hover:text-purple-400 transition-all duration-300"
          >
            Pricing
          </Link>
          <Link
            href="/"
            className="text-white font-medium hover:text-purple-400 transition-all duration-300"
          >
            Enterprise
          </Link>
        </nav>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              router.push("/login");
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-transparent border border-purple-500 rounded-lg hover:bg-purple-900 transition-all duration-300"
          >
            Log In
          </button>
          <button
            onClick={() => {
              router.push("/signup");
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-300"
          >
            Sign Up
          </button>
        </div>
      </header>

      <section className="bg-gradient-to-br from-black via-black to-purple-900 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center bg-purple-900 bg-opacity-40 text-sm text-purple-200 px-4 py-2 rounded-full border border-purple-700 mb-6">
              <span className="mr-2">✨</span>
              <span>AI-Powered Hiring Platform</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Redefine Your{" "}
              <span className="text-purple-400">Hiring Process</span> with
              AI-Powered Assessments
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl">
              HireSwift automates end-to-end hiring with AI assessments,
              anti-cheating technology, and comprehensive analytics to find the
              perfect candidates faster.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="bg-purple-600 text-white text-lg px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 hover:bg-purple-700 w-full sm:w-auto">
                <Link
                  href="/signup"
                  className="flex items-center justify-center"
                >
                  Get Started <ChevronRight size={20} />
                </Link>
              </button>
              <button
                onClick={() => setShowVideo(true)}
                className="bg-transparent border border-purple-500 text-white text-lg px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-purple-900 w-full sm:w-auto"
              >
                <p>Watch Demo</p>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-20">
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-16"
            }`}
          >
            <div className="bg-black bg-opacity-70 border border-purple-900 rounded-xl shadow-2xl p-4 md:p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-purple-300 text-sm">
                  HireSwift Assessment Platform
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white font-medium">
                      Coding Challenge
                    </div>
                    <div className="text-purple-400 text-sm">
                      25:00 remaining
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded p-3 font-mono text-sm text-green-400 overflow-auto h-40">
                    <pre>
                      {`function findMissingNumber(arr) {
                        // Sort the array
                          arr.sort((a, b) => a - b);
  
                         // Check if first element is not 1
                           if (arr[0] !== 1) return 1;
  
                        // Find missing number
                         for (let i = 0; i < arr.length; i++) {
                          if (arr[i + 1] - arr[i] > 1) {
                              return arr[i] + 1;
                           }
                          }
  
                         // If no missing number found
                          return arr[arr.length - 1] + 1;
                        }`}
                    </pre>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-white font-medium mb-3">
                    AI Evaluation
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-green-400">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Correct solution</span>
                    </div>
                    <div className="flex items-center text-green-400">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Optimal time complexity</span>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <MessageSquare size={16} className="mr-2" />
                      <span className="text-sm">
                        Could improve variable naming
                      </span>
                    </div>
                    <div className="mt-4 text-xs text-gray-400">
                      AI-powered real-time feedback
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {stats.assessments.toLocaleString()}+
              </div>
              <p className="text-gray-600">Assessments Completed</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {stats.companies.toLocaleString()}+
              </div>
              <p className="text-gray-600">Companies Using HireSwift</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {stats.candidates.toLocaleString()}+
              </div>
              <p className="text-gray-600">Candidates Evaluated</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Core Features of{" "}
              <span className="text-purple-600">HireSwift</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform transforms your hiring process with
              AI-powered assessments, anti-cheating technology, and insightful
              analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-purple-200"
              >
                <div className="bg-purple-50 rounded-full p-3 inline-flex mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-purple-900 to-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How HireSwift Works
            </h2>
            <p className="text-lg text-purple-200 max-w-3xl mx-auto">
              Our streamlined process helps you identify and select the best
              candidates efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-purple-700 transform -translate-x-1/2" />
                )}
                <div className="bg-purple-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl z-50 font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-purple-200">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Advanced Anti-Cheating Technology
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                HireSwift&apos;s comprehensive anti-cheating system ensures
                assessment integrity through:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle
                    size={20}
                    className="text-purple-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-700">
                    Face verification using AI facial recognition
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={20}
                    className="text-purple-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-700">
                    Tab switching and screen activity monitoring
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={20}
                    className="text-purple-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-700">
                    Speech verification for communication assessment
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={20}
                    className="text-purple-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-700">
                    Smart warnings with auto-submission after violations
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-900 rounded-lg p-3 shadow-lg">
              <div className="rounded-lg overflow-hidden border border-purple-700">
                <Image
                  src={AssessmentImage}
                  alt="Anti-Cheating Module"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-white rounded-lg p-3 shadow-lg border border-gray-200">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src={AssessmentReport}
                  alt="Smart Reports"
                  className="w-full"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Comprehensive Smart Reports
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Make informed hiring decisions with our detailed assessment
                reports:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle
                    size={20}
                    className="text-purple-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-700">
                    Performance charts and score distribution
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={20}
                    className="text-purple-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-700">
                    Detailed feedback tables with strengths and weaknesses
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={20}
                    className="text-purple-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-700">
                    AI-generated insights and recommendations
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    size={20}
                    className="text-purple-600 mr-3 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-700">
                    Exportable PDF reports with professional formatting
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 px-6 bg-gradient-to-br from-black via-purple-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center mb-10 ">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform Your Hiring Process Today
          </h2>
          <p className="text-xl mb-8 text-purple-200">
            Join thousands of companies using HireSwift to find the best talent
            efficiently and accurately
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-purple-600 text-white text-lg px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 hover:bg-purple-700 w-full sm:w-auto">
              <Link href="/signup">Get Started</Link>
            </button>
            <button className="bg-transparent border border-purple-400 text-white text-lg px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-purple-900 w-full sm:w-auto">
              <Link href="/">Contact Sales</Link>
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image src={LogoImage} alt="Logo" width={150} height={100} />
              <p className="text-gray-400 mb-4">
                Redefining hiring with AI-powered assessments and anti-cheating
                technology.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/hireswift.ai/"
                  target="_blank"
                  className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                >
                  <Facebook size={23} />
                </a>
                <a
                  href="https://www.instagram.com/hireswift.ai/"
                  target="_blank"
                  className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/assessments"
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                  >
                    Assessments
                  </a>
                </li>
                <li>
                  <a
                    href="/anti-cheating"
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                  >
                    Anti-Cheating
                  </a>
                </li>
                <li>
                  <a
                    href="/reports"
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                  >
                    Smart Reports
                  </a>
                </li>
                <li>
                  <a
                    href="/ai-evaluation"
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                  >
                    AI Evaluation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/help"
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/security"
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} HireSwift. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {showVideo && <VideoPopup onClose={() => setShowVideo(false)} />}
    </div>
  );
};

export default HomePage;
