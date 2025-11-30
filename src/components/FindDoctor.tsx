"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

const doctors = [
  {
    name: "Dr. John Smith",
    specialty: "Neurologist",
    image: "/team-3.jpg",
  },
  {
    name: "Dr. Sarah Brown",
    specialty: "Cardiologist",
    image: "/team-4.jpg",
  },
  {
    name: "Dr. Mark Wilson",
    specialty: "Ophthalmologist",
    image: "/team-1.jpg",
  },
  {
    name: "Dr. Emily Davis",
    specialty: "Pediatrician",
    image: "/team-3.jpg",
  },
  {
    name: "Dr. Daniel White",
    specialty: "Dermatologist",
    image: "/team-4.jpg",
  },
  {
    name: "Dr. Olivia Green",
    specialty: "Orthopedic Surgeon",
    image: "/team-1.jpg",
  },
];

const FindDoctor = () => {
  return (
    <section className="py-16 bg-gray-100 text-center">
      <h2 className="text-3xl font-bold text-blue-500">Find a Doctor</h2>
      <p className="text-gray-600 text-lg mt-2">Search for experienced specialists across different fields.</p>

      {/* Carousel Container */}
      <div className="mt-8 mx-auto max-w-[70%] md:max-w-[80%] lg:max-w-4xl">
        <Carousel>
          <CarouselContent className="-ml-2">
            {doctors.map((doctor, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4 p-4">
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md text-center h-full">
                  {/* Doctor Image */}
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={200}
                    height={200}
                    className="rounded-lg mx-auto"
                  />

                  {/* Doctor Info */}
                  <h3 className="text-lg font-semibold mt-3">{doctor.name}</h3>
                  <p className="text-sm text-gray-500">{doctor.specialty}</p>

                  {/* View Profile Button */}
                  <Button className="mt-3 bg-blue-500 hover:bg-yellow-500 transition">
                    View Profile
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Custom Navigation Buttons */}
          <CarouselPrevious className="bg-white text-blue-500 hover:bg-yellow-500 shadow-md">
            <ArrowLeft />
          </CarouselPrevious>
          <CarouselNext className="bg-white text-blue-500 hover:bg-yellow-500 shadow-md">
            <ArrowRight />
          </CarouselNext>
        </Carousel>
      </div>
    </section>
  );
};

export default FindDoctor;
