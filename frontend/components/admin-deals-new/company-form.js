import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { Segment, Form, Button, Header, Grid, Image, Search, Message } from 'semantic-ui-react';
import escapeRegExp from 'lodash/escapeRegExp';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

import { sleep, handleChange } from '../../lib/util';
import { CompanyPropType } from '../../lib/prop-types';
import { companiesQuery } from '../../lib/queries';
import { upsertCompanyMutation } from '../../lib/mutations';

class Company extends Component {
  static propTypes = {
    companies: PropTypes.arrayOf(CompanyPropType),
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = { companies: [] };
  state = {
    company: {
      name: '',
      website: '',
      description: '',
      domain: '',
    },
    isNew: true,
    results: [],
    loading: false,
    success: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const company = omit(this.state.company, 'id', 'domain', '__typename');
    const { data: { upsertCompany } } = await this.props.upsertCompany(company);
    this.setState({ loading: false });
    if (upsertCompany) {
      this.props.onChange(upsertCompany);
      this.setState({
        company: pick(upsertCompany, 'name', 'website', 'description', 'domain'),
        isNew: false,
        success: true,
      });
      await sleep(2000);
      this.setState({ success: false });
    } else {
      console.error('UPSERT COMPANY ERROR');
    }
  };
  companyToResult = company => ({
    title: company.name,
    description: company.description,
    image: `//logo.clearbit.com/${company.domain}?size=192`,
  });
  handleResultSelect = (event, result) => {
    const company = this.props.companies.find(({ name }) => name === result.title);
    this.props.onChange(company);
    this.setState({ company, isNew: false });
  };
  handleSearchChange = async (event, search) => {
    const perfectMatch = this.props.companies.find(({ name }) => name === search);
    this.props.onChange(perfectMatch || { id: '' });
    const company = perfectMatch || { name: search, website: '', description: '' };
    const regExp = new RegExp(escapeRegExp(search), 'i');
    const isMatch = result => regExp.test(result.title);
    const companies = this.props.companies.map(this.companyToResult);
    const results = companies.filter(isMatch);
    this.setState({ company, results, isNew: !perfectMatch });
  };
  handleChange = handleChange().bind(this);
  render() {
    return (
      <div>
        <Header as="h3" dividing>
          Company
        </Header>
        <Grid>
          <Grid.Column width={4}>
            <Image
              src={
                this.state.company.domain
                  ? `//logo.clearbit.com/${this.state.company.domain}?size=192`
                  : '//via.placeholder.com/192?text=COMPANY+LOGO'
              }
              alt={this.state.company.name}
              centered
            />
          </Grid.Column>
          <Grid.Column width={12}>
            <Form id="upsert-company" onSubmit={this.onSubmit} success={this.state.success}>
              <Form.Group>
                <Form.Field
                  label="Name"
                  width={8}
                  control={Search}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={this.handleSearchChange}
                  results={this.state.results}
                  value={this.state.company.name}
                  required
                />
                <div className="field">
                  <label htmlFor="name">&nbsp;</label>
                  <div className="company-name-hint">Enter a new company or an existing one.</div>
                </div>
              </Form.Group>
              <Form.Input
                name="company.website"
                value={this.state.company.website}
                onChange={this.handleChange}
                label="Website"
                placeholder="Website"
                type="url"
                required
              />
              <Form.TextArea
                name="company.description"
                value={this.state.company.description}
                onChange={this.handleChange}
                label="Description"
                placeholder="Description"
                autoHeight
              />
              <Message success header="Success!" content="Company saved." />
            </Form>
          </Grid.Column>
        </Grid>
        <Segment basic textAlign="center">
          <Button
            type="submit"
            form="upsert-company"
            primary
            disabled={this.state.loading}
            content={this.state.isNew ? 'Create company' : 'Update company'}
            icon="checkmark"
            labelPosition="left"
          />
        </Segment>
        <style jsx>{`
          .company-name-hint {
            line-height: 37px;
          }
        `}</style>
      </div>
    );
  }
}

export default compose(
  graphql(companiesQuery, {
    props: ({ data: { companies } }) => ({ companies }),
  }),
  graphql(upsertCompanyMutation, {
    props: ({ mutate }) => ({
      upsertCompany: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: companiesQuery }],
        }),
    }),
  }),
)(Company);
