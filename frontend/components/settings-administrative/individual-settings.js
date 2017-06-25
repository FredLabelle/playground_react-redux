import PropTypes from 'prop-types';
import { Header, Form } from 'semantic-ui-react';

import { MePropType } from '../../lib/prop-types';
import NameField from '../fields/name-field';
import CountryField from '../fields/country-field';
import DateField from '../fields/date-field';
import FilesField from '../fields/files-field';
import AddressField from '../fields/address-field';

const IndividualSettings = ({ me, handleChange, updateInvestorFiles }) =>
  <div>
    <Header as="h3" dividing>Individual information</Header>
    <NameField name="me.name" value={me.name} onChange={handleChange} />
    <Form.Group>
      <CountryField
        name="me.individualSettings.nationality"
        value={me.individualSettings.nationality}
        onChange={handleChange}
        label="Nationality"
        width={8}
      />
      <DateField
        name="me.individualSettings.birthdate"
        value={me.individualSettings.birthdate}
        onChange={handleChange}
        label="Birthdate"
        width={8}
      />
    </Form.Group>
    <FilesField
      multiple
      field="individualSettings.idDocuments"
      label="ID Documents"
      files={me.individualSettings.idDocuments}
      mutation={updateInvestorFiles}
      mutationName="updateInvestorFiles"
    />
    <Header as="h3" dividing>Fiscal Address</Header>
    <AddressField
      name="me.individualSettings.fiscalAddress"
      value={me.individualSettings.fiscalAddress}
      onChange={handleChange}
    />
  </div>;
IndividualSettings.propTypes = {
  me: MePropType.isRequired,
  handleChange: PropTypes.func.isRequired,
  updateInvestorFiles: PropTypes.func.isRequired,
};

export default IndividualSettings;
