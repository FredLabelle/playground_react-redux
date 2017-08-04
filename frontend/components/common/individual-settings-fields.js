import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

import { InvestorPropType } from '../../lib/prop-types';
import NameField from '../fields/name-field';
import CountryField from '../fields/country-field';
import DateField from '../fields/date-field';
import IdDocumentsField from '../fields/id-documents-field';
import AddressField from '../fields/address-field';

const IndividualSettingsFields = ({ investor, handleChange }) =>
  <div>
    <Header as="h3" dividing>
      Individual information
    </Header>
    <NameField name="investor.name" value={investor.name} onChange={handleChange} />
    <CountryField
      name="investor.individualSettings.nationality"
      value={investor.individualSettings.nationality}
      onChange={handleChange}
      label="Nationality"
      width={8}
    />
    <DateField
      name="investor.individualSettings.birthdate"
      value={investor.individualSettings.birthdate}
      onChange={handleChange}
      label="Birthdate"
    />
    <IdDocumentsField
      name="investor.individualSettings.idDocuments"
      value={investor.individualSettings.idDocuments}
      onChange={handleChange}
      label="ID Documents"
    />
    <Header as="h3" dividing>
      Fiscal Address
    </Header>
    <AddressField
      name="investor.individualSettings.fiscalAddress"
      value={investor.individualSettings.fiscalAddress}
      onChange={handleChange}
    />
  </div>;
IndividualSettingsFields.propTypes = {
  investor: InvestorPropType.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default IndividualSettingsFields;
