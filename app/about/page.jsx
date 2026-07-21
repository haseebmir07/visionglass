'use client'

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import {
  Target,
  Eye,
  Users,
  ShieldCheck,
  Settings2,
  Star,
  Clock,
  Handshake,
} from "lucide-react";

const faqItems = [
  {
    question: "What services does Vision Glass & Interiors provide?",
    answer:
      "Vision Glass & Interiors specializes in shower glass partitions, shower enclosures, LED mirrors, bathroom mirrors with lights, office glass partitions, glass canopies, laminated glass, glass railings, and customized glass solutions for residential and commercial spaces.",
  },
  {
    question: "Do you provide customized glass solutions?",
    answer:
      "Yes. We offer fully customized glass products based on your design preferences, dimensions, and project requirements for homes, offices, hotels, and commercial buildings.",
  },
  {
    question: "Which areas do you serve?",
    answer:
      "We serve customers across Bangalore, including JP Nagar, Electronic City, Whitefield, Sarjapur Road, Koramangala, HSR Layout, Bannerghatta Road, Jayanagar, Indiranagar, Yelahanka, and surrounding areas.",
  },
  {
    question: "What type of glass do you use for shower partitions and enclosures?",
    answer:
      "We use premium-quality toughened safety glass that offers excellent durability, strength, and safety while providing a modern and elegant appearance.",
  },
  {
    question: "Are LED mirrors suitable for bathrooms?",
    answer:
      "Yes. Our LED mirrors are specially designed for bathroom use and feature energy-efficient lighting, moisture-resistant construction, and elegant designs that enhance both functionality and aesthetics.",
  },
  {
    question: "Do you install office glass partitions?",
    answer:
      "Absolutely. We design and install customized office glass partitions that create modern, open, and professional workspaces while maximizing natural light.",
  },
  {
    question: "What are the benefits of laminated glass?",
    answer:
      "Laminated glass offers enhanced safety, improved sound insulation, UV protection, and increased security. It is ideal for railings, canopies, facades, and commercial buildings.",
  },
  {
    question: "Why should I choose Vision Glass & Interiors?",
    answer:
      "We are known for premium-quality materials, customized designs, experienced professionals, precision installation, competitive pricing, timely project completion, and exceptional customer service.",
  },
  {
    question: "Do you offer site visits and consultations?",
    answer:
      "Yes. We provide site inspections and consultations to understand your requirements and recommend the most suitable glass solutions for your project.",
  },
  {
    question: "How can I request a quotation?",
    answer:
      "You can contact Vision Glass & Interiors through our website, phone, WhatsApp, or email to schedule a consultation and receive a customized quotation based on your project requirements.",
  },
];

const iconItems = [
  { icon: Users, label: "Experienced Professionals" },
  { icon: ShieldCheck, label: "Premium Quality Materials" },
  { icon: Settings2, label: "Customized Solutions" },
  { icon: Star, label: "Superior Workmanship" },
  { icon: Clock, label: "Timely Project Execution" },
  { icon: Handshake, label: "Customer Satisfaction" },
];

const AboutPage = () => {
  const [activeFaq, setActiveFaq] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq((current) => (current === index ? -1 : index));
  };

  const fadeInClass = (id) =>
    `transition-all duration-700 ease-out ${
      visibleSections[id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`;

  return (
    <>
      <Navbar />

      <main className="overflow-hidden">
        <section
          id="about"
          ref={(el) => (sectionRefs.current[0] = el)}
          className="relative overflow-hidden bg-[#1B2A3B] text-white"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.04) 75%, transparent 75%, transparent)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="px-6 md:px-16 lg:px-32 py-24">
            <div className={fadeInClass("about")}>
              <p className="text-sm uppercase tracking-[0.35em] text-[#F5F5F5]/70">
                <Link href="/" className="hover:text-[#B8963E]">
                  Home
                </Link>{" "}
                <span className="mx-2">&gt;</span>
                About Us
              </p>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
                About Vision Glass & Interiors
              </h1>
              <div className="mt-4 h-1 w-24 rounded-full bg-[#B8963E]" />
              <p className="mt-6 text-lg md:text-xl font-semibold text-[#B8963E]">
                CRAFTING SPACES. DELIVERING PERFECTION.
              </p>
            </div>
          </div>
        </section>

  <section
  id="about-info"
  ref={(el) => (sectionRefs.current[1] = el)}
  className={`relative overflow-hidden bg-white py-24 px-6 md:px-16 lg:px-32 ${fadeInClass(
    "about-info"
  )}`}
>
  {/* Background Decoration */}
  <div className="absolute top-24 right-0 h-72 w-72 rounded-full bg-[#B8963E]/10 blur-3xl" />

 <div className="mx-auto grid max-w-[1700px] items-center gap-10 lg:grid-cols-[0.75fr_1.6fr]">

    {/* LEFT CONTENT */}
    <div className="relative z-10">

      <p className="text-sm uppercase tracking-[0.35em] text-[#B8963E] font-medium">
        About Vision Glass & Interiors
      </p>

      <h2 className="mt-5 text-4xl lg:text-5xl font-bold leading-tight text-[#1B2A3B]">
        Premium Glass Manufacturing &
        <br />
        Interior Solutions
      </h2>

      <div className="mt-6 h-1 w-24 rounded-full bg-[#B8963E]" />

      <p className="mt-8 text-gray-600 leading-8 text-lg">
        Vision Glass & Interiors is a leading provider of premium glass
        manufacturing and modern interior solutions in Bangalore. We
        specialize in designing, manufacturing and installing high-quality
        glass products that combine exceptional craftsmanship with innovative
        design.
      </p>

      <p className="mt-6 text-gray-600 leading-8">
        Our customized solutions include shower glass partitions, office glass
        partitions, laminated glass, glass railings, canopies, LED mirrors,
        bathroom mirrors and architectural glass for residential and commercial
        projects.
      </p>

      <p className="mt-6 text-gray-600 leading-8">
        From concept to installation, our experienced team delivers projects
        with precision, premium materials and unmatched customer satisfaction.
      </p>

      {/* Features */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div className="rounded-2xl border border-gray-200 bg-[#faf9f6] p-5 shadow-sm">
          <h4 className="font-semibold text-[#1B2A3B]">
            Premium Quality
          </h4>
          <p className="mt-2 text-sm text-gray-600">
            Toughened safety glass with world-class finishing.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#faf9f6] p-5 shadow-sm">
          <h4 className="font-semibold text-[#1B2A3B]">
            Customized Solutions
          </h4>
          <p className="mt-2 text-sm text-gray-600">
            Tailor-made designs for homes, offices and commercial spaces.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#faf9f6] p-5 shadow-sm">
          <h4 className="font-semibold text-[#1B2A3B]">
            Expert Installation
          </h4>
          <p className="mt-2 text-sm text-gray-600">
            Precision workmanship by experienced professionals.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#faf9f6] p-5 shadow-sm">
          <h4 className="font-semibold text-[#1B2A3B]">
            Timely Delivery
          </h4>
          <p className="mt-2 text-sm text-gray-600">
            Projects completed on schedule without compromising quality.
          </p>
        </div>

      </div>

    </div>

    {/* RIGHT IMAGE */}
    <div className="relative flex justify-end">

   <div className="relative w-full max-w-[1100px] aspect-[3/2] overflow-visible bg-transparent group">
  <Image
    src="/images/about-vision-glass.png"
    alt="Vision Glass & Interiors"
    fill
    priority
    sizes="(max-width:768px) 100vw, 60vw"
    className="object-contain object-center transition duration-700 group-hover:scale-105"
  />
</div>

      {/* Floating Experience Card */}
      <div className="absolute -bottom-10 left-10 rounded-3xl bg-white px-8 py-6 shadow-2xl">

        <h3 className="text-5xl font-bold text-[#B8963E]">
          15+
        </h3>

        <p className="mt-2 text-sm font-medium text-gray-700">
          Years of Experience
        </p>

      </div>

      {/* Floating Projects Card */}
      <div className="absolute top-12 -right-10 rounded-3xl bg-[#1B2A3B] px-7 py-5 text-white shadow-xl">

        <h3 className="text-4xl font-bold text-[#B8963E]">
          6895+
        </h3>

        <p className="mt-1 text-sm">
          Successful Projects
        </p>

      </div>

    </div>

  </div>
</section>

        <section
          id="mission-vision"
          ref={(el) => (sectionRefs.current[2] = el)}
          className={`bg-[#1B2A3B] py-20 px-6 md:px-16 lg:px-32 ${fadeInClass("mission-vision")}`}
        >
          <div className="mx-auto max-w-[1200px] grid gap-8 lg:grid-cols-2">
            <div className="rounded-[32px] border-l-4 border-[#B8963E] bg-[#243447] p-8 shadow-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#B8963E]/10 text-[#B8963E]">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[#B8963E]">Our Mission</h3>
              <p className="mt-4 text-gray-200 leading-relaxed">
                Our mission is to transform residential and commercial spaces through innovative glass solutions that combine quality, safety, functionality, and modern design. We are committed to delivering premium products, exceptional craftsmanship, and personalized customer service while building long-term relationships based on trust, reliability, and excellence.
              </p>
            </div>

            <div className="rounded-[32px] border-l-4 border-[#B8963E] bg-[#243447] p-8 shadow-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#B8963E]/10 text-[#B8963E]">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[#B8963E]">Our Vision</h3>
              <p className="mt-4 text-gray-200 leading-relaxed">
                Our vision is to become one of Bangalore&apos;s most trusted and preferred glass manufacturing and interior solution providers by continuously innovating, maintaining the highest standards of quality, and creating elegant spaces that inspire modern living. We strive to set new benchmarks in craftsmanship, customer satisfaction, and sustainable glass solutions for homes and businesses.
              </p>
            </div>
          </div>
        </section>

        <section
          id="why-us"
          ref={(el) => (sectionRefs.current[3] = el)}
          className={`bg-[#F5F5F5] py-20 px-6 md:px-16 lg:px-32 ${fadeInClass("why-us")}`}
        >
          <div className="mx-auto max-w-[1200px] text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-[#B8963E]">
              Why Choose Vision Glass & Interiors?
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-[#1B2A3B]">
              Why Choose Vision Glass & Interiors?
            </h2>
            <p className="mt-4 text-lg font-semibold text-[#B8963E]">
              Quality You Can See. Service You Can Trust.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {iconItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B8963E]/15 text-[#B8963E]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <p className="text-center text-sm font-semibold text-[#1B2A3B]">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="faq"
          ref={(el) => (sectionRefs.current[4] = el)}
          className={`bg-white py-20 px-6 md:px-16 lg:px-32 ${fadeInClass("faq")}`}
        >
          <div className="mx-auto max-w-[900px]">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-[#B8963E]">
                Frequently Asked Questions
              </p>
              <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-[#1B2A3B]">
                Frequently Asked Questions
              </h2>
              <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#B8963E]" />
            </div>

            <div className="mt-12 space-y-4">
              {faqItems.map((item, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={item.question} className="overflow-hidden rounded-3xl border border-[#E2E8F0]">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-center justify-between gap-4 bg-[#1B2A3B] px-6 py-5 text-left text-white transition hover:bg-[#243447]"
                    >
                      <span className="font-medium">{item.question}</span>
                      <span className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-5 w-5 text-[#B8963E]"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden bg-[#F5F5F5] text-[#1a1a1a] transition-all duration-500 ${isOpen ? "max-h-80 py-6 px-6" : "max-h-0 px-6"}`}
                    >
                      <p className="text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#1B2A3B] py-16 px-6 md:px-16 lg:px-32">
          <div className="mx-auto grid max-w-[1200px] gap-8 rounded-[32px] bg-[#243447] p-8 lg:grid-cols-[1.5fr_1fr] items-center shadow-[0_30px_90px_rgba(0,0,0,0.2)]">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#B8963E]">
                Ready to Transform Your Space?
              </p>
              <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-white">
                Get in touch with our experts today.
              </h2>
            </div>
            <div className="flex items-center justify-start lg:justify-end">
              <Link
                href="#"
                className="inline-flex rounded-full bg-[#B8963E] px-8 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-[#1B2A3B] transition hover:bg-[#d4b35a]"
              >
                Request a Free Quote
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage;
