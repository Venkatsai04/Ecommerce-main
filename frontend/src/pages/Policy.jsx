import React from "react";
import Title from "../components/Title";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 bg-white min-h-screen">
      <div className="text-center mb-12">
        <Title text1="PRIVACY" text2="POLICY" />
        <p className="mt-4 text-gray-600 text-sm sm:text-base">
          Your privacy is important to Sahara. This policy explains how we collect, use, and protect your personal information.
        </p>
      </div>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p className="text-sm sm:text-base">
            We may collect information such as your name, email address, phone number, shipping & billing details, and payment information when you shop with us or interact with our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
          <p className="text-sm sm:text-base">
            Your information is used to process orders, provide customer support, send updates about our products, and improve your shopping experience. We do not sell or share your personal data with third-party marketers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Cookies & Tracking</h2>
          <p className="text-sm sm:text-base">
            Our website uses cookies to enhance your experience, remember preferences, and provide personalized content. You can choose to disable cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
          <p className="text-sm sm:text-base">
            We take appropriate measures to protect your information from unauthorized access, alteration, disclosure, or destruction. All sensitive information is transmitted via secure protocols.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
          <p className="text-sm sm:text-base">
            You have the right to access, update, or delete your personal information. Contact us at <span className="font-semibold">contact@sahara.com</span> for any requests regarding your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Changes to This Policy</h2>
          <p className="text-sm sm:text-base">
            Sahara reserves the right to update this Privacy Policy at any time. We encourage you to review it periodically for any changes.
          </p>
        </section>

        <p className="text-sm sm:text-base mt-8">
          Last updated: October 13, 2025
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
