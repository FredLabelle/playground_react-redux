import { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { CookiesProvider, Cookies } from 'react-cookie';

import initApollo from './initApollo';
import initRedux from './initRedux';
import { onRouteChangeStart } from '../actions/router';

export default ComposedComponent =>
  class WithData extends Component {
    static displayName = `WithData(${ComposedComponent.displayName})`;
    static propTypes = {
      universalCookies: PropTypes.shape().isRequired,
      serverState: PropTypes.shape().isRequired,
    };
    static async getInitialProps(context) {
      const universalCookies = process.browser ? new Cookies() : context.req.universalCookies;
      const serverState = {};
      const composedInitialProps = ComposedComponent.getInitialProps
        ? await ComposedComponent.getInitialProps(context)
        : {};
      if (!process.browser) {
        const apollo = initApollo(universalCookies);
        const redux = initRedux(apollo);
        redux.dispatch(onRouteChangeStart(context.req.url));
        const url = { query: context.query, pathname: context.pathname };
        const app = (
          <CookiesProvider cookies={universalCookies}>
            <ApolloProvider client={apollo} store={redux}>
              <ComposedComponent url={url} {...composedInitialProps} />
            </ApolloProvider>
          </CookiesProvider>
        );
        await getDataFromTree(app);
        const state = redux.getState();
        Object.assign(serverState, {
          apollo: {
            data: state.apollo.data,
          },
          router: state.router,
        });
      }
      return {
        universalCookies,
        serverState,
        ...composedInitialProps,
      };
    }
    constructor(props) {
      super(props);
      this.cookies = process.browser ? new Cookies() : props.universalCookies;
      this.apollo = initApollo(this.cookies);
      this.redux = initRedux(this.apollo, props.serverState);
    }
    render() {
      return (
        <CookiesProvider cookies={this.cookies}>
          <ApolloProvider client={this.apollo} store={this.redux}>
            <ComposedComponent {...this.props} />
          </ApolloProvider>
        </CookiesProvider>
      );
    }
  };
