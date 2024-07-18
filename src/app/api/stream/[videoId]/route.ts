import { authorize } from "@/google/auth-google";
import { streamFile } from "@/google/google-drive";
import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";
import { PassThrough } from "stream";

export async function GET(req: Request, { params }: { params: { videoId: string } }) {
    const videoId = params.videoId;

    try {
        const authClient: OAuth2Client = await authorize();
        const fileStream = await streamFile(authClient, videoId as string);

        const passThrough = new PassThrough();
        fileStream.pipe(passThrough);

        const response = new NextResponse(passThrough as any, {
            headers: {
                "Content-Type": "application/octet-stream"
            }
        });

        return response;
    } catch (error) {
        console.error("Error streaming file:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}