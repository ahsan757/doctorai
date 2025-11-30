import AboutUs from '@/components/About'
import EmergencySupport from '@/components/EmergencySupport'
import FAQ from '@/components/FAQ'
import FindDoctor from '@/components/FindDoctor'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Testimonials from '@/components/Testimonal'

const page = () => {
  return (
    <div className=''>
      <Hero />
      <AboutUs />
      <hr />
      <EmergencySupport />
      <Testimonials />
      <FindDoctor />
      <FAQ />
      <Footer />
    </div>
  )
}

export default page