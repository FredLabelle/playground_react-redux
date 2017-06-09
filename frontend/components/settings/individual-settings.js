import PropTypes from 'prop-types';
import { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { CountryDropdown } from 'react-country-region-selector';

import { MePropType } from '../../lib/prop-types';
import NameField from '../fields/name-field';
import FileField from '../fields/file-field';
import AddressField from '../fields/address-field';

export default class extends Component {
  static propTypes = {
    me: MePropType.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleNationalityChange: PropTypes.func.isRequired,
    handleBirthdateChange: PropTypes.func.isRequired,
    updateInvestorFile: PropTypes.func.isRequired,
  };
  componentDidMount() {
    // TODO fix this with css
    const inputContainer = document.querySelector('.react-datepicker__input-container');
    inputContainer.style.width = '100%';
    const selects = [...document.getElementsByTagName('select')];
    selects.forEach(select => {
      const { style } = select;
      style.height = '37px';
    });
  }
  render() {
    return (
      <div>
        <Header as="h3" dividing>Individual information</Header>
        <NameField name="me.name" value={this.props.me.name} onChange={this.props.handleChange} />
        <Form.Group>
          <Form.Field
            label="Nationality"
            width={8}
            control={CountryDropdown}
            value={this.props.me.individualSettings.nationality}
            onChange={this.props.handleNationalityChange}
          />
          <Form.Field
            label="Birthdate"
            width={8}
            control={DatePicker}
            dateFormat="DD-MM-YYYY"
            showMonthDropdown
            showYearDropdown
            selected={this.props.me.individualSettings.birthdate}
            onChange={this.props.handleBirthdateChange}
          />
        </Form.Group>
        <FileField
          // imagesOnly
          field="individualSettings.idDocument"
          label="ID Document"
          file={this.props.me.individualSettings.idDocument}
          mutation={this.props.updateInvestorFile}
          mutationName="updateInvestorFile"
        />
        <Header as="h3" dividing>Fiscal Address</Header>
        <AddressField
          name="me.individualSettings.fiscalAddress"
          value={this.props.me.individualSettings.fiscalAddress}
          onChange={this.props.handleChange}
        />
      </div>
    );
  }
}
