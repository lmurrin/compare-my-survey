import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/20/solid';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import Breadcrumb from '@/app/components/Breadcrumbs';
import '../../article.css';

export const dynamic = 'force-dynamic';

async function getArticle(slug) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?filters[slug][$eq]=${slug}&populate[cover][populate]=true&populate[blocks][populate]=*`,
        { cache: 'no-store' }
      );

  
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Strapi API Error:', errorData);
        return null;
      }
  
      const data = await res.json();
      return data.data?.[0] || null;
    } catch (error) {
      console.error('Fetch Error:', error);
      return null;
    }
  }
  

export default async function ArticlePage({ params }) {
  const slug = params.slug;
  const article = await getArticle(slug);

  if (!article) return notFound();

  const { title, description, cover, blocks } = article;

  const pages = [
    { name: 'Blog Archive', href: '/blog', current: false },
    { name: title, href: `/blog/${slug}`, current: true },
  ];

  return (
    <div className="bg-white px-6 py-32 lg:px-8">
        
      <div className="mx-auto max-w-3xl text-base/7 text-gray-700">
      <div className='pb-8'>
            <Breadcrumb pages={pages} />
            </div>
        <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 text-xl/8">{description}</p>

        {cover && (
            <figure className="mt-10">
                <img
                src={cover.formats?.large?.url || cover.url}
                alt={cover.alternativeText || title}
                className="aspect-video rounded-xl bg-gray-50 object-cover"
                />
               
            </figure>
            )}


        <div className="mt-10 max-w-full space-y-8">
       
          {blocks?.map((block) => {
            switch (block.__component) {
              case 'shared.rich-text':
                return <div key={block.id} className='article-content' dangerouslySetInnerHTML={{ __html: marked(block.body) }} />;
              case 'shared.quote':
                return (
                    <>
                    
                  <figure key={block.id} className="border-l border-indigo-600 pl-6">
                    <blockquote className="font-semibold text-gray-900">
                      <p>{block.body}</p>
                    </blockquote>
                    <figcaption className="mt-2 text-sm text-gray-500">{block.title}</figcaption>
                  </figure>
                  </>
                );
            //   case 'shared.media':
            //     return (
            //       <img
            //         key={block.id}
            //         src={`http://localhost:1337${block.file?.url}`}
            //         alt={block.file?.alternativeText}
            //         className="rounded-lg mt-4"
            //       />
            //     );
            //   case 'shared.slider':
            //     return (
            //       <div key={block.id} className="grid grid-cols-2 gap-4">
            //         {block.files?.map((file) => (
            //           <img
            //             key={file.id}
            //             src={`http://localhost:1337${file.url}`}
            //             alt={file.alternativeText}
            //             className="rounded-md"
            //           />
            //         ))}
            //       </div>
            //     );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
