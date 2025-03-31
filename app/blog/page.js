"use client";

import { useState, useEffect } from "react";
import cmsLogo from '../../public/cms.svg'

export default function BlogPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
          
          const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?populate[cover]=true&populate[blocks][populate]=*`);
          
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
  
        const data = await res.json();
        if (!Array.isArray(data.data)) throw new Error("Invalid data format");

        const sortedData = data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
  
        const formattedPosts = data.data.map((article) => {
            const formats = article.cover?.formats;
            const directUrl = article.cover?.url;
          
            const imageUrl =
              formats?.medium?.url ||
              formats?.large?.url ||
              formats?.small?.url ||
              directUrl ||
              null;
          
            return {
              id: article.id,
              title: article.title,
              description: article.description,
              imageUrl: imageUrl
                ? imageUrl.startsWith('http')
                  ? imageUrl
                  : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${imageUrl}`
                : "https://via.placeholder.com/800x400?text=No+Image",
              href: `/blog/${article.slug}`,
              date: new Date(article.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              datetime: article.createdAt,
              author: {
                name: article.author?.name || "Unknown Author",
                imageUrl: "https://via.placeholder.com/50",
              },
            };
          });
          
  
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
  
    fetchArticles();
  }, []);
  
  

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
            >
              <img
                alt={post.title}
                src={post.imageUrl}
                className="absolute inset-0 -z-10 size-full object-cover"
                />

              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
                <time dateTime={post.datetime} className="mr-8">
                  {post.date}
                </time>
                <div className="-ml-4 flex items-center gap-x-4">
                  <svg
                    viewBox="0 0 2 2"
                    className="-ml-0.5 size-0.5 flex-none fill-white/50"
                  >
                    <circle r={1} cx={1} cy={1} />
                  </svg>
                  <div className="flex gap-x-2.5">
                    <img
                      alt=""
                      src={cmsLogo.src}
                      className="size-6 flex-none rounded-full bg-white p-1"
                    />
                    Compare My Survey
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-lg/6 font-semibold text-white">
                <a href={post.href}>
                  <span className="absolute inset-0" />
                  {post.title}
                </a>
              </h3>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
