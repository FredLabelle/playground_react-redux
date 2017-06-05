import { parse } from 'querystring';

const initialState = {
  organizationShortId: '',
  pathname: '/',
  query: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'ON_ROUTE_CHANGE_START': {
      const pathRegexp = /\/organization\/([a-z]+)(\/[a-z]+)?(\?.*)?/;
      const matches = payload.url.match(pathRegexp);
      if (!matches) {
        return initialState;
      }
      const [, organizationShortId, pathname = '/', queryString = '?'] = matches;
      const query = parse(queryString.substr(1));
      return { organizationShortId, pathname, query };
    }
    default: {
      return state;
    }
  }
};
