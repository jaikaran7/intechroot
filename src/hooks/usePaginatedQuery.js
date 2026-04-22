import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export function usePaginatedQuery(queryKey, fetchFn, options = {}) {
  const [page, setPage] = useState(1);
  const limit = options.limit || 20;

  const staticParams =
    queryKey.length > 1 &&
    typeof queryKey[1] === 'object' &&
    queryKey[1] !== null &&
    !Array.isArray(queryKey[1])
      ? queryKey[1]
      : {};

  const query = useQuery({
    queryKey: [...queryKey, { page, limit }],
    queryFn: () => fetchFn({ ...staticParams, page, limit }),
    placeholderData: (prev) => prev,
    staleTime: options.staleTime,
  });

  return {
    ...query,
    page,
    setPage,
    limit,
    totalPages: query.data?.pagination?.totalPages ?? 1,
    total: query.data?.pagination?.total ?? 0,
  };
}
