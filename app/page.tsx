import { Hero } from '@/components/ui/Hero';
import { Section } from '@/components/ui/Section';
import { Navigation } from '@/components/ui/Navigation';
import { Campaigns } from '@/components/portfolio/Campaigns';
import { ResumeSection } from '@/components/portfolio/Resume';
import { SocialFeedWrapper } from '@/components/social/SocialFeedWrapper';
import { CTA } from '@/components/ui/CTA';
import { SocialLinksComponent } from '@/components/ui/SocialLinks';
import { getResume, getCampaigns } from '@/lib/utils/content';
import { getSocialLinks } from '@/lib/utils/social';

export default function Home() {
  const resume = getResume();
  const campaigns = getCampaigns();
  const socialLinks = getSocialLinks();
  
  // You can add your Calendly link here or in environment variables
  const calendlyLink = process.env.NEXT_PUBLIC_CALENDLY_LINK || '';

  return (
    <>
      <Navigation />
      <main className="pt-16">
        <section id="home">
          <Hero
            title={`Hi, I'm ${resume.name}`}
            subtitle={resume.summary}
          >
            <div className="space-y-6">
              <CTA calendlyLink={calendlyLink} email={resume.email} />
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">Connect with me</p>
                <SocialLinksComponent socialLinks={socialLinks} size="md" />
              </div>
            </div>
          </Hero>
        </section>

        <Section id="portfolio" className="bg-white dark:bg-zinc-900">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-50">
              Portfolio
            </h2>
            <Campaigns campaigns={campaigns} />
          </div>
        </Section>

        <Section id="resume" className="bg-zinc-50 dark:bg-zinc-950">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-50">
              Resume
            </h2>
            <ResumeSection resume={resume} />
          </div>
        </Section>

        <Section id="social" className="bg-white dark:bg-zinc-900">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-50">
              Latest Posts
            </h2>
            <SocialFeedWrapper />
          </div>
        </Section>

        <Section id="contact" className="bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">
              Let's Connect
            </h2>
            <CTA calendlyLink={calendlyLink} email={resume.email} />
            <div className="mt-8">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">Follow me on social media</p>
              <SocialLinksComponent socialLinks={socialLinks} size="lg" />
            </div>
          </div>
        </Section>
      </main>

      <footer className="bg-zinc-900 dark:bg-black text-zinc-400 py-8 text-center">
        <div className="container mx-auto">
          <SocialLinksComponent socialLinks={socialLinks} size="sm" variant="minimal" />
          <p className="mt-4">&copy; {new Date().getFullYear()} {resume.name}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
