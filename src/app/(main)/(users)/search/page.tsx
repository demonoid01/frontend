"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type SearchResult = {
  type: "product" | "category";
  id: number;
  name: string;
  description?: string;
  slug: string;
  parentId?: number | null;
  basePrice?: number;
  salePrice?: number;
  image?: string;
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim()) {
        try {
          const response = await api.get(
            `/search?q=${query}&page=${page}&limit=10`
          );
          const { results, totalPages } = response.data;
          setResults(results);
          setTotalPages(totalPages);
        } catch (error) {
          setResults([]);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, page]);

  return (
    <div className="min-h-dvh p-4 max-w-6xl mx-auto mt-28">
      <div className="sticky top-0 bg-background py-4">
        <Input
          className="h-14 text-lg"
          type="text"
          placeholder="Search products, categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : results?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {results?.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={`/${item.type}/${item.slug}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow relative"
              >
                <Badge
                  className={`absolute top-4 left-4 m-2 text-sm ${
                    item.type === "product" ? "bg-blue-600" : "bg-purple-600"
                  }`}
                  variant={"default"}
                >
                  {item.type}
                </Badge>
                {item.type === "product" && (
                  <>
                    <div className="h-48">
                      {item.image && (
                        <Image
                          src={
                            item?.image
                              ? typeof item.image === "string"
                                ? JSON.parse(item.image)[0]
                                : item.image[0]
                              : "https://icon-library.com/images/images-icon/images-icon-13.jpg"
                          }
                          alt={item.name}
                          width={400}
                          height={300}
                          className="h-48 object-contain rounded-lg"
                        />
                      )}
                    </div>
                    <h3 className="font-semibold mt-2">{item.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-primary font-bold">
                        ₹{item.salePrice || item.basePrice}
                      </span>
                      {item.salePrice && (
                        <span className="line-through text-gray-500">
                          ₹{item.basePrice}
                        </span>
                      )}
                    </div>
                  </>
                )}
                {item.type === "category" && (
                  <>
                    <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={400}
                        height={300}
                        className="h-48 object-contain rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold mt-2">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </>
                )}
              </Link>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              disabled={page === 1}
              className="bg-black text-white"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              className="bg-black text-white"
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="h-96 text-center flex flex-col items-center justify-center">
          <p className="text-gray-500">
            {query ? "No results found" : "Start typing to search..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
