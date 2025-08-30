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

interface WhatsAppRequest {
  message: string;
  detection: Detection;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, detection }: WhatsAppRequest = await req.json();
    const phone = "+918525062274"; // This should come from user settings in a real app
    const apiKey = Deno.env.get("CALLMEBOT_API_KEY");

    if (!apiKey) {
      throw new Error("CALLMEBOT_API_KEY is not configured");
    }

    // Format the WhatsApp message
    const formattedMessage = `🚨 Bird Alert!
Location: ${detection.zone}
Confidence: ${detection.confidence}%
Time: ${new Date(detection.timestamp).toLocaleString()}
Image: ${detection.imageUrl}`;

    // URL encode the message
    const encodedMessage = encodeURIComponent(formattedMessage);

    const response = await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`,
      { method: "GET" }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CallMeBot API Error:", errorText);
      throw new Error("Failed to send WhatsApp message");
    }

    return new Response(
      JSON.stringify({ message: "WhatsApp message sent successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send WhatsApp message" }),
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