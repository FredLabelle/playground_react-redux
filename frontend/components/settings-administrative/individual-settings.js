import PropTypes from 'prop-types';
import { Header, Form } from 'semantic-ui-react';

import { MePropType } from '../../lib/prop-types';
import NameField from '../fields/name-field';
import CountryField from '../fields/country-field';
import DateField from '../fields/date-field';
import FileField from '../fields/file-field';
import AddressField from '../fields/address-field';

const IndividualSettings = ({ me, handleChange, updateInvestorFile }) =>
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
    <FileField
      // imagesOnly
      field="individualSettings.idDocument"
      label="ID Document"
      file={me.individualSettings.idDocument}
      mutation={updateInvestorFile}
      mutationName="updateInvestorFile"
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
  updateInvestorFile: PropTypes.func.isRequired,
};

export default IndividualSettings;
