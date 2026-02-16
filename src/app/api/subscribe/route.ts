import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || 'c21420ff-8ed5-4385-a588-6ec40c384fa7';

// Helper to enforce the 4-second processing time
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'INVALID_EMAIL_FORMAT' },
                { status: 400 }
            );
        }

        if (!process.env.RESEND_API_KEY) {
            console.warn('Resend API key not configured');
            return NextResponse.json(
                { error: 'EMAIL_SERVICE_NOT_CONFIGURED' },
                { status: 503 }
            );
        }

        // --- STEP 1: SCAN FOR EXISTING SUBSCRIBER ---
        const { data: contacts } = await resend.contacts.list({
            audienceId: AUDIENCE_ID,
        });

        const exists = contacts?.data?.some(
            (c: { email: string }) => c.email.toLowerCase() === email.toLowerCase()
        );

        if (exists) {
            return NextResponse.json(
                { error: 'YOU ARE ALREADY SUBSCRIBED' },
                { status: 409 }
            );
        }

        // --- STEP 2: REGISTER NEW CONTACT ---
        const { error: regError } = await resend.contacts.create({
            email: email,
            unsubscribed: false,
            audienceId: AUDIENCE_ID,
        });

        if (regError) {
            if (regError.message.includes('already exists')) {
                return NextResponse.json(
                    { error: 'YOU ARE ALREADY SUBSCRIBED' },
                    { status: 409 }
                );
            }
            throw new Error(regError.message);
        }

        // --- STEP 3: ARTIFICIAL DELAY (ENFORCE 4s UPLINK) ---
        await sleep(4000);

        // --- STEP 4: DISPATCH WELCOME EMAIL ---
        const emailResult = await resend.emails.send({
            from: `avrxt <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
            to: [email],
            subject: '👋 Welcome to the avrxt network',
            html: `
                <div style="font-family: monospace; background-color: #000; color: #f8f8f8; padding: 40px; border: 1px solid #333; max-width: 600px; margin: auto;">
                    <h2 style="color: #666; font-size: 18px;">// CONNECTION_ESTABLISHED</h2>
                    <p>Your subscription is now active.</p>
                    <p style="color: #aaa; font-size: 13px;">Your node is now connected to the network. Expect technical updates and architecture deep-dives.</p>
                    <div style="margin: 30px 0;">
                        <a href="https://avrxt.in/" style="background: #fff; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold; font-size: 12px;">EXPLORE_SYSTEM</a>
                    </div>
                    <p style="font-size: 10px; color: #444; border-top: 1px solid #222; padding-top: 20px;">
                        © 2025 avrxt | Secure Transmission
                    </p>
                </div>
            `,
        });

        if (emailResult.error) {
            if (emailResult.error.name === 'rate_limit_exceeded') {
                return NextResponse.json(
                    { error: 'SYSTEM_BUSY: RETRY_IN_60S' },
                    { status: 429 }
                );
            }
            throw new Error(emailResult.error.message);
        }

        return NextResponse.json({ message: 'NODE_REGISTERED' });

    } catch (error: unknown) {
        console.error('SUBSCRIBE_API_ERROR:', error);
        return NextResponse.json(
            { error: 'SYSTEM_FAILURE' },
            { status: 500 }
        );
    }
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
