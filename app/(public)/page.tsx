import Navbar from "@/components/layout/Navbar";
import Hero from "./_sections/Hero";
import Courses from "./_sections/Courses";
import HowItWorks from "./_sections/HowItWorks";
import About from "./_sections/About";
import Contact from "./_sections/Contact";

export default function HomePage(): React.JSX.Element {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Courses />
      <HowItWorks />
      <About />
      <Contact />
    </div>
  );
}
