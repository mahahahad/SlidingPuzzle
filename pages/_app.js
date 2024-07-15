import "../styles/global.css"
import Head from "next/head"

/**
 * This file is called for every component and wraps that component
 * with the provided code in the return statement here. 
 */

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Sliding Puzzle</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
