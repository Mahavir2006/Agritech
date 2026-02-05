import { NextRequest, NextResponse } from 'next/server';

interface VoiceNavRequest {
    transcript: string;
    userRole: 'farmer' | 'buyer' | 'guest';
}

const SYSTEM_PROMPT = `
You are a Voice Navigation Assistant for an Agriculture App.
Your goal is to map the user's spoken command to a specific route or action in the app.

CONTEXT:
- User Role: {ROLE} (only allow actions valid for this role)
- App Language: English (but Input can be Hindi/Hinglish)

AVAILABLE ROUTES:
1. DASHBOARD: "/dashboard/{ROLE}"
2. PROFILE: "/dashboard/{ROLE}?tab=profile"
3. LOGIN: "/login" (if guest)
4. LOGOUT: "LOGOUT_ACTION"

FARMER SPECIFIC ROUTES (Role='farmer'):
- MY_CROPS: "/dashboard/farmer?tab=my-crops"
- ORDER_REQUESTS: "/dashboard/farmer?tab=order-requests"
- ADD_PRODUCT: "/dashboard/farmer?tab=add-product&name={name}&price={price}&quantity={qty}"
  - Requirements: Extract 'name', 'price', 'quantity' if mentioned. If missing, leave empty.

BUYER SPECIFIC ROUTES (Role='buyer'):
- BROWSE: "/dashboard/buyer?tab=browse"
- CART: "/dashboard/buyer?tab=cart"

INSTRUCTIONS:
1. Analyze the 'transcript' and 'userRole'.
2. Determine the intent.
3. If the user wants to add a product but is NOT a farmer, redirect to their dashboard or say unauthorized.
4. Translate Hindi/Hinglish commands (e.g., "Mera dashboard kholo") to the correct action.
5. Return JSON ONLY. No markdown. No explanations.

JSON SCHEMA:
{
  "action": "NAVIGATE" | "LOGOUT" | "UNKNOWN",
  "url": "string" | null,
  "feedback": "Two or three words to speak back to the user (e.g., 'Opening Dashboard', 'Adding Tomato')"
}
`;

export async function POST(request: NextRequest) {
    try {
        const { transcript, userRole } = await request.json() as VoiceNavRequest;

        if (!transcript) {
            return NextResponse.json({ error: 'Transcript required' }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                action: "UNKNOWN",
                url: null,
                feedback: "System configuration error."
            });
        }

        // Dynamic prompt with role
        const prompt = SYSTEM_PROMPT.replace(/{ROLE}/g, userRole || 'guest');

        console.log(`Voice Nav analyzing: "${transcript}" for role: ${userRole}`);

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: transcript }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.1, // Low temp for deterministic routing
                max_tokens: 200,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error('No content from LLM');
        }

        const result = JSON.parse(content);
        console.log('Voice Nav Result:', result);

        return NextResponse.json(result);

    } catch (error) {
        console.error('Voice Nav API error:', error);
        return NextResponse.json({
            action: "UNKNOWN",
            url: null,
            feedback: "Sorry, I didn't understand that."
        }, { status: 500 });
    }
}
