"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "John Doe",
    role: "Customer",
    review:
      "This service exceeded my expectations! The team was professional and the experience was smooth and hassle-free. Highly recommended!",
    image: "/test-1.jpeg",
  },
  {
    name: "Sarah Smith",
    role: "Customer",
    review:
      "Absolutely fantastic! The quality of work and the attention to detail were top-notch. I will definitely be coming back!",
    image: "/review-2.png",
  },
  {
    name: "Michael Lee",
    role: "Customer",
    review:
      "An amazing experience from start to finish. The team is super responsive and the results speak for themselves!",
    image: "/review-1.png",
  },
  {
    name: "Emily Davis",
    role: "Customer",
    review:
      "I am beyond impressed with the service provided. The team was knowledgeable, friendly, and delivered beyond expectations.",
    image: "/review-3.jpeg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-100 text-center mt-20">
      <h2 className="text-3xl font-bold text-blue-500">What Our Clients Say</h2>
      <p className="text-gray-600 text-lg mt-2">See what our customers have to say about our services</p>

      {/* Carousel Container */}
      <div className="mt-8 mx-auto max-w-[70%] sm:max-w-[85%] lg:max-w-4xl">
        <Carousel>
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-md text-left h-full flex flex-col">
                  {/* Star Rating */}
                  <div className="flex text-yellow-500 mb-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} />
                      ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 flex-grow">{testimonial.review}</p>

                  {/* Author Section */}
                  <div className="flex items-center mt-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <p className="text-lg font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
