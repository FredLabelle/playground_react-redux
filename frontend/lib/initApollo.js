import { ApolloClient, createBatchingNetworkInterface } from 'react-apollo';
import { Cookies } from 'react-cookie';

import { BACKEND_URL } from './env';

const create = cookies => {
  const networkInterface = createBatchingNetworkInterface({
    uri: `${BACKEND_URL}/graphql`,
    // uri: `http://localhost:8080/graphql`,
    batchInterval: 10,
    // opts: { credentials: 'same-origin' },
    // opts: { credentials: 'include' },
  });
  networkInterface.use([
    {
      applyBatchMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {};
        }
        const token = cookies.get('token', { path: '/' });
        if (token) {
          req.options.headers.authorization = `Bearer ${token}`;
        }
        return next();
      },
    },
  ]);
  return new ApolloClient({
    ssrMode: !process.browser,
    networkInterface,
  });
};

let apolloClient;

const initApollo = cookies => {
  if (!process.browser) {
    return create(cookies);
  }
  if (!apolloClient) {
    apolloClient = create(new Cookies());
  }
  return apolloClient;
};

export const getApolloClient = () => apolloClient;

export default initApollo;
