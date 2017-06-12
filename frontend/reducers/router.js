import { parse } from 'querystring';

const initialState = {
  admin: '',
  organizationShortId: '',
  pathname: '/',
  query: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'ON_ROUTE_CHANGE_START': {
      const pathRegexp = /(\/admin)?\/organization\/([a-z]+)(\/[a-z/]+)?(\?.*)?/;
      const matches = payload.url.match(pathRegexp);
      if (!matches) {
        return initialState;
      }
      const [, admin = '', organizationShortId, pathname = '/', queryString = '?'] = matches;
      const query = parse(queryString.substr(1));
      return { admin, organizationShortId, pathname, query };
    }
    default: {
      return state;
    }
  }
};
