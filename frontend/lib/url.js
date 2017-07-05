import { stringify } from 'querystring';

const whitelist = ['new', 'users', 'parameters', 'administrative'];

export const linkHref = (rawPathname, { admin, organizationShortId }, me) => {
  const adminProp = me ? me.role : admin;
  const adminPath = adminProp ? '/admin' : '';
  const [, pathname, resourceShortId] = rawPathname.match(/(\/[a-z]*)\/?([\w-]+)?/);
  const finalPathname = whitelist.includes(resourceShortId) ? rawPathname : pathname;
  const query = { organizationShortId };
  if (resourceShortId && !whitelist.includes(resourceShortId)) {
    query.resourceShortId = resourceShortId;
  }
  const queryString = stringify(query);
  return `${adminPath}${finalPathname}?${queryString}`;
};
/* console.log('--------');
console.log(linkHref('/deals', { admin: true, organizationShortId: 'eclub' }));
console.log(linkHref('/deals/new', { admin: true, organizationShortId: 'eclub' }));
console.log(linkHref('/deals/abc-_', { admin: true, organizationShortId: 'eclub' }));
console.log('--------');*/

export const linkAs = (rawPathname, { admin, organizationShortId }, me) => {
  const adminProp = me ? me.role : admin;
  const adminPath = adminProp ? '/admin' : '';
  const [, pathname, resourceShortId] = rawPathname.match(/(\/[a-z]*)\/?([\w-]+)?/);
  const finalPathname = whitelist.includes(resourceShortId) ? rawPathname : pathname;
  const as = `${adminPath}/organization/${organizationShortId}${finalPathname}`;
  if (resourceShortId && !whitelist.includes(resourceShortId)) {
    return `${as}/${resourceShortId}`;
  }
  return as;
};
/* console.log('--------');
console.log(linkAs('/deals', { admin: true, organizationShortId: 'eclub' }));
console.log(linkAs('/deals/new', { admin: true, organizationShortId: 'eclub' }));
console.log(linkAs('/deals/abc-_', { admin: true, organizationShortId: 'eclub' }));
console.log('--------');*/
