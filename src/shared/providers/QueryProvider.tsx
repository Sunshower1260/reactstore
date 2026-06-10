'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function QueryProvider({ children }: { children: ReactNode }) {
  // Tạo QueryClient instance một lần duy nhất cho mỗi user session
  // Tránh việc tạo lại client mỗi khi component re-render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Dữ liệu sẽ stale sau 1 phút
            refetchOnWindowFocus: false, // Tắt tự động fetch lại khi switch tab (có thể bật lại nếu cần)
            retry: 1, // Chỉ thử lại 1 lần nếu fetch lỗi
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
