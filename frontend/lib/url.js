import { stringify } from 'querystring';

const whitelist = ['users', 'parameters', 'administrative'];

export const linkHref = (rawPathname, { admin, organizationShortId, query }, user) => {
  const adminProp = user ? user.role === 'admin' : admin;
  const adminPath = adminProp ? '/admin' : '';
  const [, pathname, resourceShortId] = rawPathname.match(/(\/[a-z/]*)\/?([\w-]+)?/);
  const finalPathname = whitelist.includes(resourceShortId) ? rawPathname : pathname;
  const newQuery = { organizationShortId };
  if (query.invited) {
    newQuery.invited = query.invited;
  }
  if (resourceShortId && !whitelist.includes(resourceShortId)) {
    newQuery.resourceShortId = resourceShortId;
  }
  const queryString = stringify(newQuery);
  return `${adminPath}${finalPathname}?${queryString}`;
};
/* console.log('--------');
console.log(linkHref('/deals', { admin: true, organizationShortId: 'eclub' }));
console.log(linkHref('/deals/new', { admin: true, organizationShortId: 'eclub' }));
console.log(linkHref('/deals/abc-_', { admin: true, organizationShortId: 'eclub' }));
console.log('--------'); */

export const linkAs = (rawPathname, { admin, organizationShortId, query }, user) => {
  const adminProp = user ? user.role === 'admin' : admin;
  const adminPath = adminProp ? '/admin' : '';
  const [, pathname, resourceShortId] = rawPathname.match(/(\/[a-z]*)\/?([\w-]+)?/);
  const finalPathname = whitelist.includes(resourceShortId) ? rawPathname : pathname;
  const as = `${adminPath}/organization/${organizationShortId}${finalPathname}`;
  const newQuery = {};
  if (query.invited) {
    newQuery.invited = query.invited;
  }
  const queryString = stringify(newQuery);
  const finalQueryString = queryString ? `?${queryString}` : '';
  if (resourceShortId && !whitelist.includes(resourceShortId)) {
    return `${as}/${resourceShortId}${finalQueryString}`;
  }
  return `${as}${finalQueryString}`;
};
/* console.log('--------');
console.log(linkAs('/deals', { admin: true, organizationShortId: 'eclub' }));
console.log(linkAs('/deals/new', { admin: true, organizationShortId: 'eclub' }));
console.log(linkAs('/deals/abc-_', { admin: true, organizationShortId: 'eclub' }));
console.log('--------'); */
