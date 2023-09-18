import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("code") !== null) {
    try {
      const response = await fetch(
        "https://api.simple.taipei/clock/import.php?code=" +
          request.nextUrl.searchParams.get("code"),
      );
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: "Error fetching data" });
    }
  }
  return NextResponse.json([
    { id: 1, subject: "數學", startTime: "01:00", endTime: "02:00" },
    { id: 2, subject: "國文", startTime: "03:00", endTime: "04:00" },
    { id: 3, subject: "自然", startTime: "05:00", endTime: "06:00" },
  ]);
}
