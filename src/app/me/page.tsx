import { getMeConfigAction } from '@/app/actions/me';
import MeClient from './MeClient';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Profile | Links & Portfolio',
    description: 'Explore the personal profile, creative work, and social links.',
    keywords: ['link in bio', 'developer portfolio', 'digital profile'],
};

export const revalidate = 60; // Revalidate data every 60 seconds

export default async function MePage() {
    const config = await getMeConfigAction();

    return (
        <MeClient initialConfig={config} />
    );
}
