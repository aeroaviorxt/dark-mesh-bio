/**
 * Discord API Utilities for Role-Based Authentication
 */

export async function checkDiscordRole(guildId: string, userId: string, roleId: string) {
    const botToken = process.env.DISCORD_BOT_TOKEN;

    if (!botToken) {
        console.warn('DISCORD_BOT_TOKEN is missing. Role check will be bypassed for safety during setup.');
        return true; // Bypass if token is missing to prevent lockout
    }

    try {
        const response = await fetch(
            `https://discord.com/api/v10/guilds/${guildId}/members/${userId}`,
            {
                headers: {
                    Authorization: `Bot ${botToken}`,
                },
            }
        );

        if (!response.ok) {
            console.error('Discord API Error:', response.statusText);
            return false;
        }

        const data = await response.json();
        const roles: string[] = data.roles || [];
        return roles.includes(roleId);
    } catch (error) {
        console.error('Discord API Fetch Failed:', error);
        return false;
    }
}
