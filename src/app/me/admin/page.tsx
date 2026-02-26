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

    // ── DISCORD ROLE AUTH CHECK ──
    if (config.auth?.discordRoleEnabled) {
        const discordIdentity = user.identities?.find(id => id.provider === 'discord');

        if (!discordIdentity) {
            // User did not login with Discord
            redirect('/auth/login?source=admin&error=discord_required');
        }

        const discordId = discordIdentity.id;
        const guildId = config.auth.discordServerId;
        const roleId = config.auth.discordRoleId;

        if (guildId && roleId) {
            const { checkDiscordRole } = await import('@/utils/discord');
            const hasRole = await checkDiscordRole(guildId, discordId, roleId);

            if (!hasRole) {
                // If bot token is missing, checkDiscordRole returns true (logged warning)
                // Otherwise if false, they are denied
                redirect('/auth/login?source=admin&error=unauthorized_role');
            }
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
