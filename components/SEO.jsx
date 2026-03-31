import Head from 'next/head';

export default function SEO({ title, description, image }) {
  const siteTitle = title ? `${title} | WrongMan` : 'WrongMan – Dress Like A Wrong Man';
  const siteDesc = description || 'Your Gen Z streetwear destination. Top brands at killer prices.';
  const siteImage = image || '/skull.svg';

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDesc} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDesc} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDesc} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}