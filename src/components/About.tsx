import { Button } from "@/components/ui/button";

const AboutUs = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center gap-10 px-6 md:px-10 lg:px-20 py-20">
      {/* Images */}
      <div className="relative lg:w-1/2 w-full mx-auto px-10 lg:px-0 mb-28 md:mb-0">
        <img
          src="/doctor1.jpg"
          alt="Doctor 1"
          className="rounded-lg md:w-96 w-52 shadow-lg"
        />
        <img
          src="/doctor2.jpg"
          alt="Doctor 2"
          // width={250}
          // height={200}
          className="absolute w-40 md:w-64 top-[9rem] left-[7rem] md:top-[10rem] md:left-[14rem] border-4 border-white rounded-lg shadow-md"
        />
      </div>

      {/* Text Content */}
      <div className="w-full lg:w-1/2">
        <h5 className="text-blue-500 font-bold mb-2">About Us</h5>
        <h2 className="text-3xl font-bold">
          From Symptoms to Solutions: Your 24/7 AI Health Partner
        </h2>
        <p className="text-gray-600 mt-4">
          Welcome to <b>Doctor AI</b>, an AI-powered medical assistant
          designed to help you with quick disease diagnosis, medicine
          suggestions, and doctor recommendations.
        </p>

        {/* Features List */}
        <ul className="mt-5 space-y-2">
          {[
            "Ambulance Services",
            "Pharmacy On Clinic",
            "24/7 Medical Emergency",
            "Oxygen On Wheel",
            "On Duty Doctors",
          ].map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-3">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <Button className="mt-6 bg-blue-500 hover:bg-green-500">
          Discover More
        </Button>
      </div>
    </section>
  );
};

export default AboutUs;
