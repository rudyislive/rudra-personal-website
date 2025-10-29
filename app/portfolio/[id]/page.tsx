import { notFound } from 'next/navigation';
import { Navigation } from '@/components/ui/Navigation';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { CTA } from '@/components/ui/CTA';
import { getCampaigns, getResume } from '@/lib/utils/content';
import { formatDate } from '@/lib/utils/date';
import { SocialLinksComponent } from '@/components/ui/SocialLinks';
import { getSocialLinks } from '@/lib/utils/social';

interface PortfolioPageProps {
  params: {
    id: string;
  };
}

export default function PortfolioPage({ params }: PortfolioPageProps) {
  const campaigns = getCampaigns();
  const campaign = campaigns.find((c) => c.id === params.id);
  const resume = getResume();
  const socialLinks = getSocialLinks();
  const calendlyLink = process.env.NEXT_PUBLIC_CALENDLY_LINK || '';

  if (!campaign) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <main className="pt-16">
        <Section className="bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-16">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <a
                href="/#portfolio"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline text-sm font-medium inline-flex items-center gap-2 mb-6"
              >
                ← Back to Portfolio
              </a>
            </div>

            <Card className="mb-8">
              <div className="mb-6">
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  {formatDate(campaign.date)}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-zinc-900 dark:text-zinc-50">
                  {campaign.title}
                </h1>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-6">
                  {campaign.description}
                </p>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
                  Results & Achievements
                </h2>
                <ul className="space-y-3">
                  {campaign.results.map((result, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300"
                    >
                      <span className="text-purple-600 dark:text-purple-400 mt-1">✓</span>
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {campaign.link && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
                  <a
                    href={campaign.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl"
                  >
                    View Project →
                  </a>
                </div>
              )}
            </Card>
          </div>
        </Section>

        <Section className="bg-white dark:bg-zinc-900 py-16">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">
              Interested in Working Together?
            </h2>
            <CTA calendlyLink={calendlyLink} email={resume.email} />
            <div className="mt-8">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">Connect with me</p>
              <SocialLinksComponent socialLinks={socialLinks} size="lg" />
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}

