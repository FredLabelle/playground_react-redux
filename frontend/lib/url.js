export const linkHref = (pathname, { admin, organizationShortId }) =>
  `${admin}${pathname}?shortId=${organizationShortId}`;

export const linkAs = (pathname, { admin, organizationShortId }) =>
  `${admin}/organization/${organizationShortId}${pathname}`;
