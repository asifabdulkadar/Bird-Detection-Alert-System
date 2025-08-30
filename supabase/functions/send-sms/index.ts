/// <reference lib="deno.ns" />
import { serve } from "std/http/server.ts";
import { Twilio } from "twilio";

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

interface SMSRequest {
  userId: string;
  detection: Detection;
  verifyServiceSid?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, detection }: SMSRequest = await req.json();

    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const verifyServiceSid = Deno.env.get("TWILIO_VERIFY_SERVICE_SID");
    
    if (!accountSid || !authToken || !verifyServiceSid) {
      throw new Error("Missing required Twilio configuration");
    }

    // Get recipient's number from user profile or environment
    const toNumber = Deno.env.get("NOTIFICATION_PHONE_NUMBER");
    const client = new Twilio(accountSid, authToken);

    // Create message content
    const message = `🚨 Bird Alert!
Location: ${detection.zone}
Confidence: ${detection.confidence}%
Time: ${new Date(detection.timestamp).toLocaleString()}

Take immediate action to protect your crops!`;

    // Send verification using Twilio Verify
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: toNumber,
        channel: "sms",
        customMessage: message
      });

    return new Response(
      JSON.stringify({ 
        message: "SMS alert initiated",
        status: verification.status,
        sid: verification.sid
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending SMS:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send SMS" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});