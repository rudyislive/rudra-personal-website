import { Hero } from '@/components/ui/Hero';
import { Section } from '@/components/ui/Section';
import { Navigation } from '@/components/ui/Navigation';
import { CTA } from '@/components/ui/CTA';
import { SocialLinksComponent } from '@/components/ui/SocialLinks';
import { getResume } from '@/lib/utils/content';
import { getSocialLinks } from '@/lib/utils/social';

export default function ContactPage() {
  const resume = getResume();
  const socialLinks = getSocialLinks();
  const calendlyLink = process.env.NEXT_PUBLIC_CALENDLY_LINK || '';

  return (
    <>
      <Navigation />
      <main className="pt-16">
        <section id="contact" className="min-h-screen">
          <Hero
            title="Let's Connect"
            subtitle="I'd love to hear from you. Whether you have a question, want to collaborate, or just want to say hello, feel free to reach out!"
          >
            <div className="space-y-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                <CTA calendlyLink={calendlyLink} email={resume.email} />
              </div>
              
              <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
                  Connect with me on social media
                </p>
                <SocialLinksComponent socialLinks={socialLinks} size="lg" />
              </div>
            </div>
          </Hero>
        </section>
      </main>
    </>
  );
}

