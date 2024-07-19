import ytdl from 'ytdl-core';

const videoURL = "https://www.youtube.com/watch?v=LXb3EKWsInQ";

export async function getThumbnailURL(videoURL: string): Promise<string> {
    try {
        const info = await ytdl.getInfo(videoURL);
        const thumbnails = info.videoDetails.thumbnails;
        const highestQualityThumbnail = thumbnails[thumbnails.length - 1].url;
        return highestQualityThumbnail;
    } catch (error) {
        throw new Error(`Failed to get thumbnail: ${error.message}`);
    }
}

getThumbnailURL(videoURL)
    .then(thumbnailURL => {
        console.log('Thumbnail URL:', thumbnailURL);
    })
    .catch(error => {
        console.error('Error:', error);
    });
