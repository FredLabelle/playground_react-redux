import { stringify } from 'querystring';

const whitelist = ['users', 'parameters'];

export const linkHref = (pathname, { admin, organizationShortId, shortId }) => {
  const adminPath = admin ? '/admin' : '';
  const newQuery = { organizationShortId };
  if (shortId && !whitelist.includes(shortId)) {
    newQuery.resourceShortId = shortId;
  }
  const queryString = stringify(newQuery);
  return `${adminPath}${pathname}?${queryString}`;
};


export const linkAs = (pathname, { admin, organizationShortId, shortId }) => {
  const adminPath = admin ? '/admin' : '';
  const as = `${adminPath}/organization/${organizationShortId}${pathname}`;
  const newQuery = {};
  const queryString = stringify(newQuery);
  const finalQueryString = queryString ? `?${queryString}` : '';
  if (shortId && !whitelist.includes(shortId)) {
    return `${as}/${shortId}${finalQueryString}`;
  }
  return `${as}${finalQueryString}`;
};
