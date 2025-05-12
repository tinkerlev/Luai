import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-12">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Just a few lines of code – that's all it takes to become a victim of a cyberattack.
        </h1>
        <p className="text-lg">
          Luai stops it before it happens.
        </p>
        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-700">
          Get Early Access
        </button>
        <p className="text-sm mt-2">Free signup – early access is limited.</p>
      </header>

      {/* About Section */}
      <section className="max-w-3xl mx-auto text-center mb-20">
        <h2 className="text-2xl font-semibold mb-4">What is Luai?</h2>
        <p className="text-base leading-relaxed">
          Built something new? Used AI or a No-Code tool? <br />
          Or maybe you're a hands-on developer who writes clean code with thoughtful comments.
          <br />
          Before you share it with the world – let <strong>Luai</strong> help make sure it's safe.
        </p>
        <p className="mt-4">
          <strong>Luai</strong> is a smart security tool powered by AI. 
          It checks your code, understands what you're trying to do, and spots things that could go wrong – even in your comments.
          It’s like having a second pair of eyes that actually know what to look for.
        </p>
        <p className="mt-6 text-sm text-gray-600">
          Behind the scenes, Luai uses smart code scanning and AI to catch security issues, weird patterns, and even mistakes hidden in plain sight.
        </p>
      </section>

      {/* Benefits Section */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="text-2xl font-semibold text-center mb-8">Who is Luai for?</h2>
        <ul className="grid gap-4 md:grid-cols-2 text-lg list-disc list-inside">
          <li>Builders using AI or No-Code platforms</li>
          <li>Developers who want peace of mind</li>
          <li>Teams aiming for ISO, NIST, and OWASP compliance</li>
          <li>Anyone who wants to catch security flaws early</li>
        </ul>
      </section>

      {/* Key Features Section */}
      <section className="max-w-4xl mx-auto mb-20 text-center">
        <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
        <ul className="grid gap-4 md:grid-cols-2 text-left list-disc list-inside text-lg">
          <li>Supports multiple languages (Python, JavaScript, HTML, and more)</li>
          <li>Uses AI to spot security risks automatically</li>
          <li>Understands developer comments and context</li>
          <li>Gives clear suggestions on how to fix issues</li>
          <li>Lets you export reports in PDF, JSON, or HTML</li>
          <li>Helps you stay aligned with ISO, NIST, and OWASP standards</li>
        </ul>
      </section>

      {/* Example Section */}
      <section className="bg-gray-100 py-10 px-4 rounded-2xl max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">How does it work?</h2>
        <pre className="bg-black text-green-400 text-left p-4 rounded shadow overflow-auto">
{`# ✘ This is dangerous:
eval(user_input)
# ✔ Luai Warning: Code injection risk`}
        </pre>
        <p className="mt-4">
          ⚠️ This code could let someone run harmful commands. <br />
          ✅ Luai spots it, explains why it’s risky, and shows you how to fix it.
        </p>
      </section>

      {/* Final CTA + Contact */}
      <footer className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">Luai is launching soon</h2>
        <p className="mb-4">Spots for early access are limited. Grab yours now.</p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl shadow hover:bg-blue-700">
          Quick Signup
        </button>
        <p className="text-sm mt-2">No credit card needed. Just sign up and stay in the loop.</p>

        <div className="mt-10 text-sm text-gray-500">
          <p>Have questions? Email us at <a href="mailto:security@Luai.io" className="text-blue-600 underline">security@Luai.io</a></p>
          <p className="mt-2">
            Follow us:
            <a href="https://linkedin.com/company/Luai" target="_blank" rel="noreferrer" className="ml-2 text-blue-600 underline">LinkedIn</a>
            <a href="https://twitter.com/Luai_app" target="_blank" rel="noreferrer" className="ml-4 text-blue-600 underline">Twitter</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
