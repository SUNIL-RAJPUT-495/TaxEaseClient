import Footer from "../component/layout/Footer"
import Navbar from "../component/layout/Navbar"
import Hero from "../component/home/Hero"
import Services from "../component/home/Services"
import Features from "../component/home/Features"
import Testimonials from "../component/home/Testimonials"
import CTA from "../component/home/CTA"

export const IndexPage = () => {
  return (
    <div>   
        <Navbar/>
        <Hero/>
       
        <Services/>
        <Features/>
        <Testimonials/>
        <CTA/>
         <Footer/>
         
    </div>
  )
}