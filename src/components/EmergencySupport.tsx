import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Ambulance } from "lucide-react";

const EmergencySupport = () => {
  const ambulanceServices = [
    { name: "Edhi Ambulance", phone: "115" },
    { name: "Chhipa Ambulance", phone: "1020" },
    { name: "Aman Ambulance", phone: "1021" },
  ];

  return (
    <section className="flex flex-col mt-10 md:flex-row items-center justify-between p-8 w-[90%] mx-auto bg-white rounded-lg shadow-md">
      {/* Left Content */}
      <div className="md:w-1/2 pr-6">
        <h5 className="text-blue-600 font-bold text-lg">🚨 Emergency Helpline</h5>
        <h2 className="text-2xl font-bold mt-2">Need Urgent Ambulance Support?</h2>
        <p className="text-gray-600 mt-2">
          Call the nearest ambulance service instantly with just one tap.
        </p>

        {/* Ambulance Service Contacts */}
        <div className="mt-4 space-y-3">
          {ambulanceServices.map((service, index) => (
            <a
              key={index}
              href={`tel:${service.phone}`}
              className="flex items-center bg-blue-100 p-3 rounded-lg shadow-md hover:bg-blue-500 hover:text-white"
            >
              <Ambulance className="text-2xl mr-3 hover:text-white" />
              <div>
                <p className="font-semibold">{service.name}</p>
                <span className="text-sm text-gray-600 group-hover:text-white">
                  Call Now
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <Button className="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2">
          🚑 Get Help Now
        </Button>
      </div>

      {/* Right Image */}
      <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
        <Image
          src="/helpline_img.png"
          alt="Emergency Support"
          width={400}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default EmergencySupport;
