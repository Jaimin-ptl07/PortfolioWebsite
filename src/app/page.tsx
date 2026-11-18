import { AboutPreview, ContactCTA, Experiments, FeaturedWork, FocusAreas, Hero, WritingPreview } from "@/components/home/HomeSections";
import { resumeAvailable } from "@/lib/assets";

export default function HomePage() {
  const resume = resumeAvailable();
  return (
    <>
      <Hero resumeAvailable={resume} />
      <FeaturedWork />
      <FocusAreas />
      <Experiments />
      <AboutPreview />
      <WritingPreview />
      <ContactCTA resumeAvailable={resume} />
    </>
  );
}
