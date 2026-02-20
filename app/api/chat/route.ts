import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, tool, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    const result = await streamText({
      model: google("gemini-2.5-flash-lite"), 
      messages: await convertToModelMessages(messages),
      system: "You are Carisma Assistant. Use 'getInventoryCount' for ALL inventory/brand questions. Pass the brand name to the 'make' parameter if mentioned. Always summarize the result in a friendly sentence.",
      maxSteps: 5, 
      tools: {
        getInventoryCount: tool({
          description: "Get vehicle counts. Use 'make' parameter for specific brands.",
          parameters: z.object({
            make: z.string().optional().describe("The car brand (e.g., 'BMW')"),
          }),
          execute: async ({ make }) => {
            let query = supabase.from('inventory').select('*', { count: 'exact', head: true });
            if (make) query = query.ilike('make', make);
            
            const { count, error } = await query;
            if (error) throw new Error(error.message);
            return { count: count ?? 0, make: make ?? 'all' };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}