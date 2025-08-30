// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface Detection {
  zone: string;
  confidence: number;
  timestamp: string;
  imageUrl: string;
}

interface EmailRequest {
  userId: string;
  detection: Detection;
}

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, detection }: EmailRequest = await req.json();

    if (!userId || !detection) {
      throw new Error("Missing required fields: userId or detection");
    }

    // Get user's email from Supabase
    const { data: user, error: userError } = await supabaseClient
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError || !user?.email) {
      throw new Error(`Failed to get user email: ${userError?.message ?? 'User not found'}`);
    }

    const client = new SmtpClient({
      connection: {
        hostname: Deno.env.get("SMTP_HOST")!,
        port: parseInt(Deno.env.get("SMTP_PORT")!),
        tls: true,
        auth: {
          username: Deno.env.get("SMTP_USER")!,
          password: Deno.env.get("SMTP_PASSWORD")!,
        },
      },
    });

    await client.connect();
    await client.send({
      from: Deno.env.get("SMTP_FROM")!,
      to: user.email,
      subject: `Bird Detection Alert - ${detection.zone}`,
      content: `
        A bird was detected in ${detection.zone} with ${detection.confidence}% confidence at ${detection.timestamp}.
        View the image here: ${detection.imageUrl}
      `,
      html: `
        <h2>Bird Detection Alert</h2>
        <p>A bird was detected in <strong>${detection.zone}</strong></p>
        <p>Confidence: ${detection.confidence}%</p>
        <p>Time: ${detection.timestamp}</p>
        <img src="${detection.imageUrl}" alt="Bird Detection" style="max-width: 500px;" />
      `,
    });
    await client.close();

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});