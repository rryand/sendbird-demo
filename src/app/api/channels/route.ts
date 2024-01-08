import db from "@/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { channelUrl, createdBy = '', chatmateId = '', messageCount = 0 } = body;

  const values = [channelUrl, createdBy, chatmateId, messageCount];
  await db.query("INSERT INTO public.channels (channel_url, created_by, chatmate_id, message_count) VALUES ($1, $2, $3, $4)", values);

  return Response.json(body, { status: 201 });
}
