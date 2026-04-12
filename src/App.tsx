import './App.css'
import BlogSection from './pages/home/components/blog-sections'
import FooterSection from './components/footer'
import HeroSection from './pages/home/components/hero'
import Navbar from './components/navbar/navbar'

function App() {

  return (
    <>
      <Navbar />
      <HeroSection />
      <BlogSection />
      <FooterSection />
    </>
  )
}

export default App
