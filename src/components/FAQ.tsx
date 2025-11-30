"use client";

import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "What Happens To My Sample Once I Have Provided It?",
    answer: "Your sample is securely transported to our laboratory for analysis by expert technicians.",
  },
  {
    question: "Where Can I Go To Provide A Sample For Testing?",
    answer: "You can visit any of our partnered collection centers to submit your sample.",
  },
  {
    question: "What Will Laboratory Testing Cost Me?",
    answer: "The cost varies depending on the type of test. Please visit our pricing page for details.",
  },
  {
    question: "Can I Make Appointments by Phone?",
    answer: "Yes, you can call our support team to schedule an appointment easily.",
  },
  {
    question: "Using Innovative Technology",
    answer: "We use the latest medical technology to ensure accurate and fast results.",
  },
];

const FAQ = () => {
  return (
    <section className="py-16 bg-blue-50 text-center relative px-6">
      {/* Top Icon */}
      <div className="absolute top-4 left-4 opacity-50 hidden md:block">
        <HelpCircle className="w-10 h-10 text-blue-500" />
      </div>

      {/* Title */}
      <p className="text-blue-500 font-bold uppercase tracking-wide">FAQ</p>
      <h2 className="text-3xl font-bold text-gray-900 mt-2">Frequently Asked Questions</h2>

      {/* FAQ Container */}
      <div className="flex flex-col md:flex-row justify-center items-center max-w-6xl mx-auto mt-10 gap-10">
        {/* FAQ Content */}
        <div className="w-full md:w-1/2">
          <Accordion type="multiple">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-blue-300 bg-blue-100 rounded-lg p-4 mb-3 shadow-md"
              >
                <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* FAQ Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image 
            src="/doctor_2.png"
            alt="FAQ Image"
            width={350}
            height={350}
            className="rounded-lg shadow-md border-4 border-blue-500 max-w-xs sm:max-w-sm md:max-w-md"
          />
        </div>
      </div>

      {/* Bottom Icon */}
      <div className="absolute bottom-4 right-4 opacity-50 hidden md:block">
        <HelpCircle className="w-10 h-10 text-blue-500" />
      </div>
    </section>
  );
};

export default FAQ;
