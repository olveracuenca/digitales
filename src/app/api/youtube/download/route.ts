import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import ytdl from '@distube/ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

// Set ffmpeg path if available
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

export async function GET() {
  try {
    const defaultDir = path.join(os.homedir(), 'Downloads');
    return NextResponse.json({ defaultFolder: defaultDir });
  } catch (error) {
    return NextResponse.json({ defaultFolder: 'C:\\Downloads' });
  }
}

export async function POST(req: Request) {
  try {
    const { url, targetFolder } = await req.json();

    if (!url || !targetFolder) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos: url y targetFolder' }, { status: 400 });
    }

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: 'La URL de YouTube no es válida' }, { status: 400 });
    }

    // Ensure target directory exists
    const resolvedPath = path.resolve(targetFolder);
    try {
      if (!fs.existsSync(resolvedPath)) {
        fs.mkdirSync(resolvedPath, { recursive: true });
      }
      // Test writability
      const testFile = path.join(resolvedPath, `.test_write_${Date.now()}`);
      fs.writeFileSync(testFile, '');
      fs.unlinkSync(testFile);
    } catch (err: any) {
      return NextResponse.json({ error: `La carpeta destino no es válida o no tiene permisos de escritura: ${err.message}` }, { status: 400 });
    }

    // Fetch video info
    let info;
    try {
      info = await ytdl.getInfo(url);
    } catch (err: any) {
      return NextResponse.json({ error: `No se pudo obtener información del video: ${err.message}` }, { status: 500 });
    }

    const title = info.videoDetails.title;
    const cleanTitle = title.replace(/[\\/:*?"<>|]/g, '_');
    const outputPath = path.join(resolvedPath, `${cleanTitle}.mp3`);
    const duration = parseInt(info.videoDetails.lengthSeconds || '0', 10);
    const author = info.videoDetails.author.name;

    // Create ReadableStream for Server-Sent Events (SSE)
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const sendEvent = (event: string, data: any) => {
          try {
            controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
          } catch (e) {
            // Controller might be closed
          }
        };

        sendEvent('start', { title, author, duration, outputPath });

        const videoStream = ytdl(url, {
          quality: 'highestaudio',
          filter: 'audioonly',
        });

        let downloadPercent = 0;
        videoStream.on('progress', (_, downloaded, total) => {
          downloadPercent = Math.round((downloaded / total) * 100);
          sendEvent('progress', { stage: 'downloading', percent: downloadPercent });
        });

        // Transcode to MP3
        const command = ffmpeg(videoStream)
          .audioBitrate(192)
          .toFormat('mp3')
          .on('progress', (progress) => {
            const convertPercent = progress.percent ? Math.round(progress.percent) : null;
            sendEvent('progress', { stage: 'converting', percent: convertPercent });
          })
          .on('end', () => {
            sendEvent('complete', { outputPath, title });
            controller.close();
          })
          .on('error', (err) => {
            sendEvent('error', { message: err.message });
            controller.close();
          });

        command.save(outputPath);
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
