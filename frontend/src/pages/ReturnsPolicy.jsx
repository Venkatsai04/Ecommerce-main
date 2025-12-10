import React from "react";

const ReturnsPolicy = () => {
  return (
    <div className="bg-white text-gray-800 px-6 md:px-16 lg:px-40 py-16 leading-relaxed">

      {/* HEADER */}
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">
        Returns & Exchange Policy
      </h1>

      {/* SECTION 1 — WHAT IS THRIFT */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">What is Thrift?</h2>
        <p className="text-gray-700 text-sm md:text-base">
          Thrift fashion focuses on giving pre-loved, vintage, and unique clothing
          a second life. Instead of mass-produced items, thrift wear consists of
          carefully curated pieces that are rare, sustainable, and carry their own story.
          Every item is handpicked, inspected, cleaned, and restored (when required)
          before being listed on our store.
        </p>

        <p className="mt-4 text-gray-700 text-sm md:text-base">
          By choosing thrift, you support slow fashion, reduce textile waste,
          and contribute to a more mindful and environmentally conscious lifestyle.
          It’s not just clothing — it’s a movement.
        </p>
      </section>

      {/* SECTION 2 — OUR APPROACH */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Our Thrift & Vintage Quality Check</h2>
        <p className="text-gray-700 text-sm md:text-base">
          Every piece you see on our store undergoes a strict quality check:
        </p>

        <ul className="list-disc ml-6 mt-3 text-gray-700 text-sm md:text-base space-y-2">
          <li>Verified authenticity & proper inspection of fabric condition</li>
          <li>Deep cleaning and sanitization before packaging</li>
          <li>Grading system: Mint | Excellent | Good | Gently Used</li>
          <li>Transparent product images showing actual conditions</li>
        </ul>

        <p className="mt-4 text-gray-700">
          Since thrift items are one-of-one pieces and often unique in age and style,
          minor imperfections are normal — but we make sure every detail is disclosed upfront.
        </p>
      </section>

      {/* SECTION 3 — RETURNS POLICY FOR THRIFT */}
      <section className="mb-12 bg-gray-100 p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-3">Return Policy for Thrift & Vintage Wear</h2>

        <p className="text-gray-700 text-sm md:text-base mb-4">
          Due to the nature of thrift and vintage clothing — items being unique and
          often one-of-a-kind — we follow a **limited return policy**.
        </p>

        <h3 className="font-semibold mt-4 mb-2">✔ Returns Accepted Only When:</h3>
        <ul className="list-disc ml-6 text-gray-700 text-sm md:text-base space-y-2">
          <li>The item delivered is incorrect (different from what you ordered)</li>
          <li>You received a damaged item **not mentioned or shown** in product images</li>
          <li>Major defects that were not disclosed in the item description</li>
        </ul>

        <h3 className="font-semibold mt-6 mb-2">❌ Returns Not Accepted For:</h3>
        <ul className="list-disc ml-6 text-gray-700 text-sm md:text-base space-y-2">
          <li>Size issues (every product includes accurate measurements)</li>
          <li>Color differences due to screen brightness or lighting</li>
          <li>Minor wear & tear typical of vintage garments</li>
          <li>Change of mind / personal preference</li>
        </ul>

        <p className="mt-6 text-gray-700 text-sm md:text-base">
          All return requests must be raised within **48 hours of delivery** with
          clear photos and proof of issue.
        </p>
      </section>

      {/* SECTION 4 — EXCHANGE POLICY */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Exchange Policy</h2>
        <p className="text-gray-700 text-sm md:text-base">
          Since each thrift item is unique, we cannot offer direct exchanges.
          However, if your order qualifies for return, you may opt for:
        </p>

        <ul className="list-disc ml-6 mt-3 text-gray-700 text-sm md:text-base space-y-2">
          <li>Store credit usable on any collection</li>
          <li>Refund to your original payment method (if applicable)</li>
        </ul>
      </section>

      {/* SECTION 5 — FUTURE POLICY EXPANSION */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Future Return Support</h2>
        <p className="text-gray-700 text-sm md:text-base">
          As we expand our product categories — including brand-new apparel,
          streetwear, and accessories — we will introduce a broader return &
          exchange policy with:
        </p>

        <ul className="list-disc ml-6 mt-3 text-gray-700 text-sm md:text-base space-y-2">
          <li>7-day returns for unused, brand-new items</li>
          <li>Exchange options for size-based issues</li>
          <li>Seamless return pickup through our logistics partners</li>
        </ul>
      </section>

      {/* FOOTER NOTE */}
      <section className="mb-6">
        <p className="text-gray-600 text-sm">
          If you have any concerns about your order, we’re here to help.  
          Contact us via Instagram, WhatsApp, or email for quick support.
        </p>
      </section>
    </div>
  );
};

export default ReturnsPolicy;
