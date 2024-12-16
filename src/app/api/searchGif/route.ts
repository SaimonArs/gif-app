'use server'
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    const CLIENT_KEY = 'my_test_app'; // Или другой идентификатор вашего приложения
    const lmt = 27; // Лимит результатов
    const TENOR_API_KEY = process.env.NEXT_PUBLIC_TENOR_API_KEY;
    const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
      q || ''
    )}&key=${TENOR_API_KEY}&client_key=${CLIENT_KEY}&limit=${lmt}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Ошибка при запросе к Tenor API:', error);
      return NextResponse.error();
    }
  }


