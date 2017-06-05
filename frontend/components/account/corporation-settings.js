import PropTypes from 'prop-types';
import { Header, Form } from 'semantic-ui-react';

import { MePropType } from '../../lib/prop-types';
import NameField from '../fields/name-field';
import AddressField from '../fields/address-field';
import FileField from '../fields/file-field';

const CorporationSettings = ({ me, handleChange, updateInvestorFile }) =>
  <div>
    <Header as="h3" dividing>Legal representative</Header>
    <NameField name="name" value={me.name} onChange={handleChange} />
    <Form.Input
      name="corporationSettings.position"
      value={me.corporationSettings.position}
      onChange={handleChange}
      label="Position"
      placeholder="Position"
    />
    <Header as="h3" dividing>Company information</Header>
    <AddressField
      name="corporationSettings.companyAddress"
      value={me.corporationSettings.companyAddress}
      onChange={handleChange}
    />
    <FileField
      field="corporationSettings.incProof"
      label="Inc. Proof"
      file={me.corporationSettings.incProof}
      mutation={updateInvestorFile}
      mutationName="updateInvestorFile"
    />
  </div>;
CorporationSettings.propTypes = {
  me: MePropType.isRequired,
  handleChange: PropTypes.func.isRequired,
  updateInvestorFile: PropTypes.func.isRequired,
};

export default CorporationSettings;