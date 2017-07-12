import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Form, Button, Header, Message } from 'semantic-ui-react';
import Router from 'next/router';
import moment from 'moment';

import { linkHref, linkAs } from '../../lib/url';
import { sleep, handleChange } from '../../lib/util';
import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery, dealsQuery } from '../../lib/queries';
import { createDealMutation } from '../../lib/mutations';
import CompanyForm from './company-form';
import CreateUpdateDealFields, { afterHandleChange } from '../common/create-update-deal-fields';

const defaultAmount = ({ parametersSettings }) => ({
  amount: '',
  currency: parametersSettings.investmentMechanisms.defaultCurrency,
});

class CreateNewDeal extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
    createDeal: PropTypes.func.isRequired,
  };
  static defaultProps = {
    organization: null,
    companies: [],
  };
  state = {
    deal: {
      companyId: '',
      categoryId: '',
      name: '',
      spvName: '',
      description: '',
      deck: [],
      roundSize: defaultAmount(this.props.organization),
      premoneyValuation: defaultAmount(this.props.organization),
      amountAllocatedToOrganization: defaultAmount(this.props.organization),
      minTicket: defaultAmount(this.props.organization),
      maxTicket: defaultAmount(this.props.organization),
      referenceClosingDate: moment().format('DD-MM-YYYY'),
      carried: '',
      hurdle: '',
    },
    companyIdError: false,
    categoryIdError: false,
    carriedError: false,
    loading: false,
    success: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    const companyIdError = !this.state.deal.companyId;
    const categoryIdError = !this.state.deal.categoryId;
    this.setState({ companyIdError, categoryIdError });
    if (companyIdError || categoryIdError) {
      return;
    }
    this.setState({ loading: true });
    const { data: { createDeal } } = await this.props.createDeal(this.state.deal);
    if (createDeal) {
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
      Router.push(linkHref('/', this.props.router), linkAs('/', this.props.router));
    } else {
      console.error('CREATE DEAL ERROR');
      this.setState({ loading: false });
    }
  };
  handleCompanyChange = ({ id: companyId }) => {
    this.setState({
      deal: {
        ...this.state.deal,
        companyId,
      },
    });
  };
  handleChange = handleChange(afterHandleChange.bind(this)).bind(this);
  dealCategoriesOptions = () => {
    const { dealCategories } = this.props.organization;
    return dealCategories.map(dealCategory => ({
      key: dealCategory.id,
      text: dealCategory.name,
      value: dealCategory.id,
    }));
  };
  render() {
    return (
      this.props.organization &&
      <Segment attached="bottom" className="tab active">
        {!this.state.success &&
          <div>
            <Header as="h2" dividing>
              Create new deal
            </Header>
            <CompanyForm onChange={this.handleCompanyChange} />
            <Header as="h3" dividing>
              Details
            </Header>
          </div>}
        <Form
          onSubmit={this.onSubmit}
          success={this.state.success}
          error={this.state.companyIdError || this.state.categoryIdError}
        >
          {!this.state.success &&
            <CreateUpdateDealFields
              deal={this.state.deal}
              handleChange={this.handleChange}
              organizationName={this.props.organization.generalSettings.name}
              dealCategoriesOptions={this.dealCategoriesOptions()}
            />}
          {this.state.companyIdError &&
            <Message error header="Error!" content="Company is required." />}
          {this.state.categoryIdError &&
            <Message error header="Error!" content="Category is required." />}
          <Message success header="Success!" content="New deal created." />
          <Segment basic textAlign="center">
            <Button
              type="submit"
              primary
              disabled={this.state.loading}
              content="Create"
              icon="checkmark"
              labelPosition="left"
            />
          </Segment>
        </Form>
      </Segment>
    );
  }
}

export default compose(
  connect(({ router }) => ({ router })),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
  graphql(createDealMutation, {
    props: ({ mutate }) => ({
      createDeal: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: dealsQuery }],
        }),
    }),
  }),
)(CreateNewDeal);
