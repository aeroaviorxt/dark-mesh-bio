import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getMeConfigAction } from '@/app/actions/me';
import MeAdminClient from './MeAdminClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default async function MeAdminPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login?source=admin');
    }

    const config = await getMeConfigAction();

    // ── DISCORD ROLE AUTH CHECK (via Environment Variables) ──
    const requiredGuildId = process.env.DISCORD_GUILD_ID;
    const requiredRoleId = process.env.DISCORD_ROLE_ID;

    if (requiredGuildId && requiredRoleId) {
        const discordIdentity = user.identities?.find(id => id.provider === 'discord');

        if (!discordIdentity) {
            redirect('/auth/login?source=admin&error=discord_required');
        }

        const discordId = discordIdentity.id;
        const { checkDiscordRole } = await import('@/utils/discord');
        const hasRole = await checkDiscordRole(requiredGuildId, discordId, requiredRoleId);

        if (!hasRole) {
            redirect('/auth/login?source=admin&error=unauthorized_role');
        }
    }

    const { data: spotifyToken } = await supabase
        .from('spotify_tokens')
        .select('id')
        .single();

    return (
        <MeAdminClient
            initialConfig={config}
            isSpotifyConnected={!!spotifyToken}
        />
    );
}
