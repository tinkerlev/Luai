import React from "react";
import { Icon } from '@iconify/react';
import { ThemeToggle } from "../theme/theme-toggle";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { 
    duration: 1.5, 
    repeat: Infinity,
    ease: "easeInOut" 
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
  
      
      {/* Hero Section with Animation */}
      <header className="hero py-16 md:py-24 mb-12">
        <motion.div 
          className="hero-content text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="max-w-3xl">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-[oklch(var(--p))] to-[oklch(var(--s))] bg-clip-text text-transparent"
              variants={fadeIn}
            >
              Just a few lines of code – that's all it takes to become a victim of a cyberattack.
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl mb-8"
              variants={fadeIn}
            >
              Luai stops it before it happens.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="btn btn-primary btn-lg shadow-lg">
                Get Early Access
              </button>
            </motion.div>
            <motion.p 
              className="text-sm mt-3 text-base-content/70"
              variants={fadeIn}
            >
              Free signup – early access is limited.
            </motion.p>
          </div>
        </motion.div>
      </header>

      {/* About Section */}
      <motion.section 
        className="max-w-3xl mx-auto px-4 text-center mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <div className="card bg-base-200 shadow-xl border border-base-300">
          <div className="card-body p-8">
            <motion.h2 
              className="card-title text-2xl md:text-3xl font-bold justify-center mb-6"
              variants={fadeIn}
            >
              What is Luai?
            </motion.h2>
            <motion.p 
              className="text-base md:text-lg leading-relaxed"
              variants={fadeIn}
            >
              Built something new? Used AI or a No-Code tool? <br />
              Or maybe you're a hands-on developer who writes clean code with thoughtful comments.
              <br className="hidden md:block" />
              Before you share it with the world – let <strong className="text-[oklch(var(--p))]">Luai</strong> help make sure it's safe.
            </motion.p>
            <motion.p 
              className="mt-6 text-base md:text-lg"
              variants={fadeIn}
            >
              <strong className="text-[oklch(var(--p))]">Luai</strong> is a smart security tool powered by AI. 
              It checks your code, understands what you're trying to do, and spots things that could go wrong – even in your comments.
              It's like having a second pair of eyes that actually know what to look for.
            </motion.p>
            <motion.div 
              className="alert alert-info mt-8 shadow-md"
              variants={fadeIn}
            >
              <Icon icon="mdi:information" className="h-6 w-6 flex-shrink-0" />
              <span>Behind the scenes, Luai uses smart code scanning and AI to catch security issues, weird patterns, and even mistakes hidden in plain sight.</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        className="max-w-4xl mx-auto px-4 mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center mb-10"
          variants={fadeIn}
        >
          Who is Luai for?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: "mdi:code", text: "Builders using AI or No-Code platforms" },
            { icon: "ix:ai", text: "Developers who want peace of mind" },
            { icon: "mdi:shield-check", text: "Teams aiming for ISO, NIST, and OWASP compliance" },
            { icon: "mdi:security", text: "Anyone who wants to catch security flaws early" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="card bg-base-200 hover:bg-base-300 transition-colors duration-300 shadow-lg"
              variants={fadeIn}
              whileHover={{ y: -5 }}
            >
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Icon icon={item.icon} className="text-[oklch(var(--p))] text-2xl" />
                  </div>
                  <span className="text-lg font-medium">{item.text}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Key Features Section */}
      <motion.section 
        className="max-w-4xl mx-auto px-4 mb-24 py-12 bg-base-200 rounded-box shadow-inner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center mb-10"
          variants={fadeIn}
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          {[
            { icon: "mdi:translate", text: "Supports multiple languages (Python, JavaScript, HTML, and more)" },
            { icon: "mdi:robot", text: "Uses AI to spot security risks automatically" },
            { icon: "mdi:comment-text", text: "Understands developer comments and context" },
            { icon: "mdi:lightbulb", text: "Gives clear suggestions on how to fix issues" },
            { icon: "mdi:file-export", text: "Lets you export reports in PDF, JSON, or HTML" },
            { icon: "mdi:check-circle", text: "Helps you stay aligned with ISO, NIST, and OWASP standards" }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              className="flex items-start gap-3"
              variants={fadeIn}
            >
              <div className="bg-primary/20 p-2 rounded-full mt-1">
                <Icon icon={item.icon} className="text-[oklch(var(--p))] text-xl" />
              </div>
              <span className="text-base md:text-lg">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Example Section */}
      <motion.section 
        className="max-w-3xl mx-auto px-4 mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <div className="card bg-gradient-to-br from-base-300 to-base-200 shadow-xl">
          <div className="card-body p-8">
            <motion.h2 
              className="card-title text-2xl font-bold justify-center mb-6"
              variants={fadeIn}
            >
              How does it work?
            </motion.h2>
            <div className="mockup-code shadow-lg bg-neutral text-neutral-content">
              <pre data-prefix="#"><code className="text-warning">✘ This is dangerous:</code></pre>
              <pre><code>eval(user_input)</code></pre>
              <pre data-prefix="#"><code className="text-success">✔ Luai Warning: Code injection risk</code></pre>
            </div>
            <motion.div 
              className="alert alert-warning shadow-md mt-6"
              variants={fadeIn}
            >
              <Icon icon="mdi:alert" className="h-6 w-6" />
              <span>This code could let someone run harmful commands.</span>
            </motion.div>
            <motion.div 
              className="alert alert-success shadow-md mt-4"
              variants={fadeIn}
            >
              <Icon icon="mdi:check-circle" className="h-6 w-6" />
              <span>Luai spots it, explains why it's risky, and shows you how to fix it.</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section 
        className="text-center mb-24 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl max-w-2xl mx-auto border border-base-300">
          <div className="card-body p-8">
            <motion.h2 
              className="card-title text-2xl md:text-3xl font-bold justify-center mb-6"
              variants={fadeIn}
            >
              Luai is launching soon
            </motion.h2>
            <motion.p 
              className="mb-6 text-lg"
              variants={fadeIn}
            >
              Spots for early access are limited. Grab yours now.
            </motion.p>
            <motion.div 
              className="card-actions justify-center"
              variants={fadeIn}
              animate={pulseAnimation}
            >
              <Link to="/register" className="btn btn-primary btn-lg gap-2 shadow-lg">
                <Icon icon="mdi:rocket-launch" className="text-xl" />
                Quick Signup
              </Link>
            </motion.div>
            <motion.p 
              className="text-sm mt-3 text-base-content/70"
              variants={fadeIn}
            >
              No credit card needed. Just sign up and stay in the loop.
            </motion.p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
