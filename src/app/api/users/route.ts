import db from "@/db";
import { signJwt } from "@/utils/jwt";

export async function GET(request: Request) {
  const result = await db.query("SELECT * FROM public.users");

  return Response.json({
    count: result.rowCount,
    data: result.rows
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, nickname = null, profileUrl = null } = body;

  const userQuery = await db.query("SELECT 1 FROM public.users WHERE id = $1::uuid", [id]);

  if (userQuery.rowCount) {
    return Response.json({
      message: "User already exists.",
      token: await signJwt(body)
    });
  }

  await db.query("INSERT INTO public.users (id, nickname, profile_url) VALUES ($1, $2, $3)", [id, nickname, profileUrl]);

  return Response.json({
    token: await signJwt(body)
  }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, nickname = null, profileUrl = null } = body;

  const userQuery = await db.query("SELECT 1 FROM public.users WHERE id = $1::uuid", [id]);

  if (!userQuery.rowCount) {
    return Response.json({
      message: "User doesn't exist."
    }, { status: 400 });
  }

  await db.query("UPDATE public.users SET nickname = $1::text, profile_url = $2::text WHERE id = $3::uuid", [nickname, profileUrl, id]);

  return Response.json(body);
}
