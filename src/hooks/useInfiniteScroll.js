import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export function useInfiniteScroll({ hasMore, status, onLoadMore }) {
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && hasMore && status !== "loading") {
      onLoadMore();
    }
  }, [inView, hasMore, status, onLoadMore]);

  return { ref, inView };
}
