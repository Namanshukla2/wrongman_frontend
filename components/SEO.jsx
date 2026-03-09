import Head from 'next/head';

const SEO = ({
  title = "Wrong Man — Multi-Brand Gen Z Streetwear",
  description = "Your Gen Z streetwear destination — Levi's, Zara, H&M, Nike & more at killer prices!",
  image = "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1200&h=630&fit=crop"
}) => {
  const fullTitle = title.includes('Wrong Man') ? title : `${title} | Wrong Man`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default SEO;