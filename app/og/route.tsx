import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Blog Post';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            background: 'linear-gradient(to bottom right, #111827, #111827, #1f2937)',
            padding: '80px',
            position: 'relative',
          }}
        >
          {/* Título en la esquina inferior izquierda */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 50 ? '48px' : '64px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: '1.2',
                margin: 0,
                maxWidth: '1000px',
                wordWrap: 'break-word',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#9ca3af',
                margin: 0,
              }}
            >
              @tomihq
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
