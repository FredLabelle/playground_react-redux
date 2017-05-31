import { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { CookiesProvider } from 'react-cookie';

import initApollo from './initApollo';
import initRedux from './initRedux';
import { onRouteChangeStart } from '../actions/router';

export default ComposedComponent =>
  class WithData extends Component {
    static displayName = `WithData(${ComposedComponent.displayName})`;
    static propTypes = {
      serverState: PropTypes.shape().isRequired,
    };
    static async getInitialProps(context) {
      let serverState = {};
      const composedInitialProps = ComposedComponent.getInitialProps
        ? await ComposedComponent.getInitialProps(context)
        : {};
      if (!process.browser) {
        const apollo = initApollo(context.req.universalCookies);
        const redux = initRedux(apollo);
        redux.dispatch(onRouteChangeStart(context.req.url));
        const url = { query: context.query, pathname: context.pathname };
        const app = (
          <CookiesProvider cookies={context.req.universalCookies}>
            <ApolloProvider client={apollo} store={redux}>
              <ComposedComponent url={url} {...composedInitialProps} />
            </ApolloProvider>
          </CookiesProvider>
        );
        /* const app = (
          <ApolloProvider client={apollo} store={redux}>
            <ComposedComponent url={url} {...composedInitialProps} />
          </ApolloProvider>
        );*/
        await getDataFromTree(app);
        const state = redux.getState();
        serverState = {
          apollo: {
            data: state.apollo.data,
          },
          router: state.router,
        };
      }
      return {
        serverState,
        ...composedInitialProps,
      };
    }
    constructor(props) {
      super(props);
      this.apollo = initApollo();
      this.redux = initRedux(this.apollo, this.props.serverState);
    }
    render() {
      /* return (
        <ApolloProvider client={this.apollo} store={this.redux}>
          <ComposedComponent {...this.props} />
        </ApolloProvider>
      );*/
      return (
        <CookiesProvider>
          <ApolloProvider client={this.apollo} store={this.redux}>
            <ComposedComponent {...this.props} />
          </ApolloProvider>
        </CookiesProvider>
      );
    }
  };
