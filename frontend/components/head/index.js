import { Head } from 'next/document';

import { FRONTEND_URL } from '../../lib/env';
import UploadcareScript from './uploadcare-script';

const title = 'InvestorX';
const description = 'InvestorX description';
// const socialUrl = `${FRONTEND_URL}/img/social.jpg`;

export default () =>
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
    <meta property="og:url" content={FRONTEND_URL} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={title} />
    <meta property="og:description" content={description} />
    {/* <meta property="og:image" content={socialUrl} />*/}
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="600" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@efounders" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {/* <meta name="twitter:image" content={socialUrl} />*/}
    {/* <link rel="icon" type="image/png" href="/static/img/favicon.png" />*/}
    <link rel="icon" type="image/png" href="//logo.clearbit.com/efounders.co?size=192" />
    <link
      rel="stylesheet"
      href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"
    />
    <link
      rel="stylesheet"
      href="//cdnjs.cloudflare.com/ajax/libs/react-datepicker/0.48.0/react-datepicker.min.css"
    />
    <UploadcareScript />
  </Head>;
