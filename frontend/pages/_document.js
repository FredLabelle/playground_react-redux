import 'isomorphic-fetch'; //TO CHECK  ???
import Document, { Main, NextScript } from 'next/document';

import Head from '../components/head';

export default class extends Document {
  render() {
    return (
      <html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
