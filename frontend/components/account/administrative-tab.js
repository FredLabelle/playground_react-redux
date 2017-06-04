import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { Form, Image, Progress, Header, Segment, Button } from 'semantic-ui-react';
import omit from 'lodash/omit';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import uploadcare from 'uploadcare-widget';

import { MePropType } from '../../lib/prop-types';
import { updateInvestorMutation, uploadInvestorIdDocumentMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';

class AdministrativeTab extends Component {
  static propTypes = {
    me: MePropType.isRequired,
    active: PropTypes.bool.isRequired,
    updateInvestor: PropTypes.func.isRequired,
    uploadInvestorIdDocument: PropTypes.func.isRequired,
  };
  state = {
    firstName: this.props.me.firstName,
    lastName: this.props.me.lastName,
    birthdate: moment(this.props.me.birthdate, 'DD-MM-YYYY'),
    nationality: this.props.me.nationality,
    idDocument: this.props.me.idDocument,
    address1: this.props.me.address1,
    address2: this.props.me.address2,
    city: this.props.me.city,
    zipCode: this.props.me.zipCode,
    country: this.props.me.country,
    state: this.props.me.state,
    advisorFullName: this.props.me.advisorFullName,
    advisorEmail: this.props.me.advisorEmail,
    progress: 1,
    loading: false,
  };
  componentDidMount() {
    // TODO fix this with css
    const selects = [...document.querySelectorAll('.country-state-select')];
    selects.forEach(select => {
      const { style } = select;
      style.height = '37px';
    });
    const inputContainer = document.querySelector('.react-datepicker__input-container');
    inputContainer.style.width = '100%';
  }
  onUploadClick = event => {
    event.preventDefault();
    const dialog = uploadcare.openDialog(null, {
      imagesOnly: true,
      tabs: ['file', 'gdrive', 'dropbox', 'url'],
    });
    dialog.done(file => {
      file.progress(({ progress }) => {
        // console.log(progress, uploadProgress);
        this.setState({ progress });
      });
      file.done(async ({ cdnUrl }) => {
        this.setState({ idDocument: cdnUrl });
        const { data: { uploadInvestorIdDocument } } = await this.props.uploadInvestorIdDocument(
          cdnUrl,
        );
        if (uploadInvestorIdDocument) {
          // console.info('DONE');
        } else {
          console.error('UPLOAD INVESTOR ID DOCUMENT ERROR');
        }
      });
      file.fail(() => {
        this.setState({ progress: 1 });
      });
    });
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { updateInvestor } } = await this.props.updateInvestor({
      ...omit(this.state, 'idDocument', 'progress', 'loading'),
      birthdate: this.state.birthdate.format('DD-MM-YYYY'),
    });
    this.setState({ loading: false });
    if (updateInvestor) {
      //
    } else {
      console.error('UPDATE INVESTOR ERROR');
    }
  };
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };
  handleBirthdateChange = birthdate => {
    this.setState({ birthdate });
  };
  handleNationalityChange = nationality => {
    this.setState({ nationality });
  };
  handleCountryChange = country => {
    this.setState({ country });
  };
  handleStateChange = state => {
    this.setState({ state });
  };
  uploading = () => this.state.progress < 1;
  render() {
    return (
      <Segment attached="bottom" className={`tab ${this.props.active ? 'active' : ''}`}>
        <Form onSubmit={this.onSubmit}>
          <Header as="h3" dividing>Individual information</Header>
          <Form.Group>
            <Form.Input
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleChange}
              label="First name"
              placeholder="First Name"
              width={8}
            />
            <Form.Input
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleChange}
              label="Last Name"
              placeholder="Last Name"
              width={8}
            />
          </Form.Group>
          <div className="fields">
            <div className="eight wide field">
              <label htmlFor="nationality">Nationality</label>
              <CountryDropdown
                value={this.state.nationality}
                onChange={this.handleNationalityChange}
                classes="country-state-select"
              />
            </div>
            <div className="eight wide field">
              <label htmlFor="birthdate">Birthdate</label>
              <DatePicker
                dateFormat="DD-MM-YYYY"
                showMonthDropdown
                showYearDropdown
                selected={this.state.birthdate}
                onChange={this.handleBirthdateChange}
              />
            </div>
          </div>
          <div className="fields">
            <div className="field" style={{ width: '100%' }}>
              <label htmlFor="idDocument">ID Document</label>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  primary
                  disabled={this.uploading()}
                  content={this.uploading() ? 'Uploading…' : 'Upload'}
                  icon={`${this.uploading() ? 'cloud ' : ''}upload`}
                  labelPosition="left"
                  onClick={this.onUploadClick}
                />
              </div>
            </div>
          </div>
          {this.uploading()
            ? <Progress percent={this.state.progress * 100} indicating />
            : <Image src={this.state.idDocument} alt="ID Document" size="medium" centered />}
          <Header as="h3" dividing>Fiscal Address</Header>
          <Form.Input
            name="address1"
            value={this.state.address1}
            onChange={this.handleChange}
            label="Address 1"
            placeholder="9 rue Ambroise Thomas"
          />
          <Form.Input
            name="address2"
            value={this.state.address2}
            onChange={this.handleChange}
            label="Address 2"
          />
          <Form.Group>
            <Form.Input
              name="city"
              value={this.state.city}
              onChange={this.handleChange}
              label="City"
              placeholder="Paris"
              width={8}
            />
            <Form.Input
              name="zipCode"
              value={this.state.zipCode}
              onChange={this.handleChange}
              label="Zip Code"
              placeholder="75009"
              width={8}
            />
          </Form.Group>
          <div className="fields">
            <div className="eight wide field">
              <label htmlFor="country">Country</label>
              <CountryDropdown
                value={this.state.country}
                onChange={this.handleCountryChange}
                classes="country-state-select"
              />
            </div>
            <div className="eight wide field">
              <label htmlFor="state">State</label>
              <RegionDropdown
                country={this.state.country}
                value={this.state.state}
                onChange={this.handleStateChange}
                classes="country-state-select"
              />
            </div>
          </div>
          <Header as="h3" dividing>Advisor</Header>
          <p>
            You can mention the information of an advisor
            that will be in copy of every correspondence.
          </p>
          <Form.Input
            name="advisorFullName"
            value={this.state.advisorFullName}
            onChange={this.handleChange}
            label="Advisor Full Name"
            placeholder="Advisor Full Name"
          />
          <Form.Input
            name="advisorEmail"
            value={this.state.advisorEmail}
            onChange={this.handleChange}
            label="Advisor Email"
            placeholder="Advisor Email"
          />
          <Segment basic textAlign="center">
            <Button primary disabled={this.state.loading}>Save administrative settings</Button>
          </Segment>
        </Form>
        <style jsx>{`
          .uploadcare-widget-button {
            line-height: 2 !important;
            height: 40px;
          }
        `}</style>
      </Segment>
    );
  }
}

export default compose(
  graphql(updateInvestorMutation, {
    props: ({ mutate }) => ({
      updateInvestor: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
  graphql(uploadInvestorIdDocumentMutation, {
    props: ({ mutate }) => ({
      uploadInvestorIdDocument: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
)(AdministrativeTab);
