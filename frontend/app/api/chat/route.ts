import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMessageToGemini } from '@/lib/gemini';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const { message, userProfile, connectedAccounts, messageHistory } = await request.json();

    if (!message || !userProfile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Call Gemini API
    const response = await sendMessageToGemini(message, {
      userProfile,
      connectedAccounts: connectedAccounts || [],
      messageHistory: messageHistory || []
    });

    // Save message to database (optional)
    try {
      await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          content: message,
          sender: 'user',
          created_at: new Date().toISOString()
        });

      await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          content: response.message,
          sender: response.sender,
          future_age: response.futureAge,
          created_at: new Date().toISOString()
        });
    } catch (dbError) {
      console.error('Error saving chat messages:', dbError);
      // Don't fail the request if database save fails
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 