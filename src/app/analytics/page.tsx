import type { Metadata } from 'next';
import { AppHeader } from '@/components/common/app-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import { InstitutionalImpactConsole } from '@/components/analytics/institutional-impact-console';
import { fetchInternalImpactAnalyticsAction } from '@/actions/outcome-analytics.actions';

export const metadata: Metadata = {
  title: 'Institutional Impact & Outcome Intelligence · Nyaya Revolution',
  description:
    'Privacy-preserving citizen outcome feedback loop, 7-stage funnel intelligence, small-cell cohort suppression, and learning velocity analytics.',
};

export default async function AnalyticsPage() {
  const { snapshot, role } = await fetchInternalImpactAnalyticsAction('90d');

  return (
    <>
      <AppHeader />
      <main className="min-h-screen py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          <InstitutionalImpactConsole
            initialSnapshot={snapshot}
            viewerRole={role}
          />
        </div>
        <AnalyticsDashboard />
      </main>
      <LandingFooter />
    </>
  );
}
