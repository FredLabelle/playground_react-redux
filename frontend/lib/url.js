import { stringify } from 'querystring';

const whitelist = ['users', 'parameters', 'administrative'];

export const linkHref = (pathname, { admin, organizationShortId, query = {}, shortId }) => {
  const adminPath = admin ? '/admin' : '';
  const newQuery = { organizationShortId };
  if (query.invited) {
    newQuery.invited = query.invited;
  }
  if (shortId && !whitelist.includes(shortId)) {
    newQuery.resourceShortId = shortId;
  }
  const queryString = stringify(newQuery);
  return `${adminPath}${pathname}?${queryString}`;
};
/* console.log('--------');
console.log(linkHref('/', {
  admin: false,
  organizationShortId: 'eclub',
  query: { invited: 'true' },
}));
console.log(linkHref('/deals', {
  admin: true,
  organizationShortId: 'eclub',
}));
console.log(linkHref('/deals', {
  admin: true,
  organizationShortId: 'eclub',
  resourceShortId: 'SkeS17a8Z',
}));
console.log('--------'); */

export const linkAs = (pathname, { admin, organizationShortId, query = {}, shortId }) => {
  const adminPath = admin ? '/admin' : '';
  const as = `${adminPath}/organization/${organizationShortId}${pathname}`;
  const newQuery = {};
  if (query.invited) {
    newQuery.invited = query.invited;
  }
  const queryString = stringify(newQuery);
  const finalQueryString = queryString ? `?${queryString}` : '';
  if (shortId && !whitelist.includes(shortId)) {
    return `${as}/${shortId}${finalQueryString}`;
  }
  return `${as}${finalQueryString}`;
};
/* console.log('--------');
console.log(linkAs('/deals', { admin: true, organizationShortId: 'eclub' }));
console.log(linkAs('/deals/new', { admin: true, organizationShortId: 'eclub' }));
console.log(linkAs('/deals/abc-_', { admin: true, organizationShortId: 'eclub' }));
console.log('--------'); */
