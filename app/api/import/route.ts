import { NextRequest, NextResponse } from "next/server";

export function GET(_: NextRequest) {
    return NextResponse.json([
        { id: 1, subject: "數學", startTime: "01:00", endTime: "02:00" },
        { id: 2, subject: "國文", startTime: "03:00", endTime: "04:00" },
        { id: 3, subject: "自然", startTime: "05:00", endTime: "06:00" }
    ])
}