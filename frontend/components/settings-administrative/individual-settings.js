import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

import { MePropType } from '../../lib/prop-types';
import NameField from '../fields/name-field';
import CountryField from '../fields/country-field';
import BirthdateField from '../fields/birthdate-field';
import FilesField from '../fields/files-field';
import AddressField from '../fields/address-field';

const IndividualSettings = ({ me, handleChange }) =>
  <div>
    <Header as="h3" dividing>
      Individual information
    </Header>
    <NameField name="me.name" value={me.name} onChange={handleChange} />
    <CountryField
      name="me.individualSettings.nationality"
      value={me.individualSettings.nationality}
      onChange={handleChange}
      label="Nationality"
      width={8}
    />
    <BirthdateField
      name="me.individualSettings.birthdate"
      value={me.individualSettings.birthdate}
      onChange={handleChange}
      label="Birthdate"
    />
    <FilesField
      name="me.individualSettings.idDocuments"
      value={me.individualSettings.idDocuments}
      onChange={handleChange}
      label="ID Documents"
      multiple
    />
    <Header as="h3" dividing>
      Fiscal Address
    </Header>
    <AddressField
      name="me.individualSettings.fiscalAddress"
      value={me.individualSettings.fiscalAddress}
      onChange={handleChange}
    />
  </div>;
IndividualSettings.propTypes = {
  me: MePropType.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default IndividualSettings;
