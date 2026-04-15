import BlogSection from "./components/BlogSection";
import FooterSection from "./components/FooterSection";
import HeroSection from "./components/HeroSection";


export default function HomePage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            <HeroSection />
            <BlogSection />
            <FooterSection />
        </div>
    );
}