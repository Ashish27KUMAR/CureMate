// src/pages/AboutUsPage.jsx
"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion"; // Correct

import { useOutsideClick } from "../hooks/use-outside-click"; // Make sure this hook exists or adjust accordingly
import { FaUsers, FaLinkedin, FaInstagram } from "react-icons/fa";
import AshishImg from "../assets/AshishK.jpeg";
import HimaniImg from "../assets/Himani.jpg";
import KashishImg from "../assets/Kashish.jpg";

export default function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 leading-tight mb-4">
          About Us
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
          Our mission is to blend advanced technology with healthcare to empower
          people in making informed decisions about their health.
        </p>
      </div>

      {/* Mission Statement */}
      <section className="bg-blue-50 rounded-xl p-8 mb-12 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Our Mission
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
          We aim to transform healthcare through an intelligent assistant that
          helps users identify possible health issues based on their symptoms.
          By combining machine learning with a simple, user-friendly interface,
          we deliver actionable insights and guidance for better health
          management. Whether you want to understand symptoms, explore
          treatments, or learn more about conditions, we’re here to support you.
        </p>
      </section>

      {/* Our Story */}
      <section className="bg-white rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Our Story
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
          Our journey started with a vision: using technology to make healthcare
          more accessible and understandable. From day one, our focus has been
          to empower users with reliable knowledge and tools that complement
          professional medical advice. We continue to bridge the gap between
          healthcare providers and individuals to improve overall well-being.
        </p>
      </section>

      {/* Our Vision */}
      <section className="bg-blue-50 rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Our Vision
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
          We see a future where healthcare is personalized, predictive, and
          proactive. This platform is just the first step toward building a
          smarter healthcare ecosystem. With ongoing updates and innovative
          features, our goal is to create a comprehensive digital health
          assistant that supports everything from symptom checking to long-term
          health management.
        </p>
      </section>

      {/* Meet the Team Section */}
      <section className="bg-white rounded-xl p-8 mb-12 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-8 text-center">
          Meet the Team <FaUsers className="inline-block ml-2 text-2xl" />
        </h2>
        <ExpandableCardDemo />
      </section>

      {/* Get in Touch */}
      <section className="text-center mt-12 bg-blue-50 rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-4">
          Get in Touch
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Have questions or need assistance? We’d love to hear from you. Reach
          out anytime — we’re here to help!
        </p>
        <Link
          to="/support"
          className="inline-block px-6 py-3 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-xl transition-colors text-base sm:text-lg"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}

// ExpandableCardDemo component
function ExpandableCardDemo() {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  {/* Replace button with LinkedIn and Instagram icons */}
                  <div className="flex gap-4">
                    <a
                      href={active.linkedinLink || active.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${active.title} LinkedIn`}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                    >
                      <FaLinkedin size={24} />
                    </a>
                    {active.instagramLink && (
                      <a
                        href={active.instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${active.title} Instagram`}
                        className="text-pink-600 hover:text-pink-800 transition-colors duration-300"
                      >
                        <FaInstagram size={24} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-blue-600 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-blue-600 hover:text-white text-black mt-4 md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-red-600"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Team Lead",
    title: "Ashish Kumar",
    src: AshishImg,
    ctaText: "Connect",
    // ctaLink: "https://www.linkedin.com/in/ashish-kumar-8059b5302/",
    linkedinLink: "https://www.linkedin.com/in/ashish-kumar-8059b5302/",
    instagramLink:
      "https://www.instagram.com/ashish_chaurasiya27?igsh=cWF2c2hpNm1jMW5m",
    content: () => {
      return (
        <p>
          I'm Ashish Kumar, a passionate graphic designer, UI/UX designer, and
          developer. I blend creativity and technology to craft engaging and
          impactful digital experiences.
        </p>
      );
    },
  },
  {
    description: "Creative Ideator",
    title: "Himani",
    src: HimaniImg,
    ctaText: "Connect",
    // ctaLink: "https://ui.aceternity.com/templates",
    linkedinLink:
      "https://www.linkedin.com/in/himani-chaudhary-747a77304?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    instagramLink:
      "https://www.instagram.com/himanichaudhary_14?igsh=MWltNnU3bzlmOHRwdQ==",
    content: () => {
      return (
        <p>
          I'm Himani, a dedicated and creative individual with a passion for
          design and technology. I enjoy crafting user-centered experiences and
          exploring innovative solutions that make a real impact.
        </p>
      );
    },
  },
  {
    description: "Creative Advisor",
    title: "Kashish Ahlawat",
    src: KashishImg,
    ctaText: "Connect",
    // ctaLink: "https://ui.aceternity.com/templates",
    linkedinLink:
      "https://www.linkedin.com/in/kashish-ahlawat-0b26bb244?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    instagramLink:
      "https://www.instagram.com/kashish_ahlawatt?igsh=eDk2dHI5Z2V3emc0",
    content: () => {
      return (
        <p>
          I'm Kashish, a passionate and driven individual with a strong interest
          in technology and creativity. I'm always eager to learn and contribute
          to meaningful projects that solve real-world problems.
        </p>
      );
    },
  },
];
{
  /* Privacy Policy Page Footer */
}
