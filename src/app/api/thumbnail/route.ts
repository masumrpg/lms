import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const videoURL = searchParams.get('videoURL');

    if (!videoURL) {
        return NextResponse.json({ error: 'Missing videoURL parameter' }, { status: 400 });
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const thumbnails = info.videoDetails.thumbnails;
        const highestQualityThumbnail = thumbnails[thumbnails.length - 1].url;
        return NextResponse.json({ thumbnail: highestQualityThumbnail });
    } catch (error: any) {
        return NextResponse.json({ error: `Failed to get thumbnail: ${error.message}` }, { status: 500 });
    }
};