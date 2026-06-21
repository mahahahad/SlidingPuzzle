import { Radio_Canada_Big } from "next/font/google";
import "../styles/global.css";

const radioCanadaBig = Radio_Canada_Big({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-radio-canada",
  display: "swap",
});

export default function Document({children}) {
  return (
    <html lang="en" className={radioCanadaBig.variable}>
      <head>
        <meta name="color-scheme" content="dark light" />
        <link rel="icon" href="/favicon.ico" />
        <title>Sliding Puzzle</title>
      </head>
      <body className={radioCanadaBig.className}>
        {children}
      </body>
    </html> 
  );
}

