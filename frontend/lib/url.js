export const linkHref = (pathname, { admin, organizationShortId }, me) =>
  me
    ? `${me.role === 'admin' ? '/admin' : ''}${pathname}?shortId=${organizationShortId}`
    : `${admin}${pathname}?shortId=${organizationShortId}`;

export const linkAs = (pathname, { admin, organizationShortId }, me) =>
  me
    ? `${me.role === 'admin' ? '/admin' : ''}/organization/${organizationShortId}${pathname}`
    : `${admin}/organization/${organizationShortId}${pathname}`;
