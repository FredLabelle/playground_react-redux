import { parse } from 'querystring';

const initialState = {
  admin: false,
  organizationShortId: '',
  pathname: '/',
  resourceShortId: '',
  query: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'ON_ROUTE_CHANGE_START': {
      const pathRegexp = /(\/admin)?\/organization\/([\w-]+)(\/[a-z/\w-]*)?\??(.*)?/;
      const matches = payload.url.match(pathRegexp);
      if (!matches) {
        return initialState;
      }
      const [, admin = '', organizationShortId, rawPathname = '/', queryString = ''] = matches;
      const [, pathname = '/', resourceShortId = ''] = rawPathname.match(/(\/[a-z]*)\/?([\w-]+)?/);
      const whitelist = ['users', 'parameters', 'administrative'];
      const finalPathname = whitelist.includes(resourceShortId) ? rawPathname : pathname;
      const query = parse(queryString);
      return {
        admin: admin === '/admin',
        organizationShortId,
        pathname: finalPathname,
        resourceShortId,
        query,
      };
    }
    default: {
      return state;
    }
  }
};
