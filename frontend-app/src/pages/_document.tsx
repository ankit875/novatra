import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased" style={{ backgroundColor: 'rgb(9, 69, 162)' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
