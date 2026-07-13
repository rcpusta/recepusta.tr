import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { TechStack } from "@/components/sections/TechStack";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Numbers } from "@/components/sections/Numbers";
import { Process } from "@/components/sections/Process";
import { WhyChooseMe } from "@/components/sections/WhyChooseMe";
import { Testimonials } from "@/components/sections/Testimonials";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { Contact } from "@/components/sections/Contact";
import { LatestTechWidget } from "@/components/sections/LatestTechWidget";
import { getAllBlogPosts } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getAllBlogPosts(false);

  return (
    <>
      <Hero />
      <About />
      <Services />
      <TechStack />
      <FeaturedProjects />
      <Numbers />
      <Process />
      <WhyChooseMe />
      <Testimonials />
      <BlogPreview posts={posts} />
      <LatestTechWidget />
      <Contact />
    </>
  );
}
