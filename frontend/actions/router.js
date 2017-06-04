/* Router.routeChangeComplete = url => {
  console.log('App changed to: ', url);
};*/

export const onRouteChangeStart = url => ({
  type: 'ON_ROUTE_CHANGE_START',
  payload: { url },
});

export const onRouteChangeComplete = () => {};
