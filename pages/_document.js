import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="dark light"></meta>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Radio+Canada+Big:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
        <style jsx global>{`
          html {
            font-family: "Radio Canada Big"
            }
            `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html> 
  );
}
