import PropTypes from 'prop-types';
import { Header, Form } from 'semantic-ui-react';

import { MePropType } from '../../lib/prop-types';
import NameField from '../fields/name-field';
import AddressField from '../fields/address-field';
import FilesField from '../fields/files-field';

const CorporationSettings = ({ me, handleChange, updateInvestorFiles }) =>
  <div>
    <Header as="h3" dividing>
      Legal representative
    </Header>
    <NameField name="me.name" value={me.name} onChange={handleChange} />
    <Form.Input
      name="me.corporationSettings.position"
      value={me.corporationSettings.position}
      onChange={handleChange}
      label="Position"
      placeholder="Position"
    />
    <Header as="h3" dividing>
      Company information
    </Header>
    <Form.Input
      name="me.corporationSettings.companyName"
      value={me.corporationSettings.companyName}
      onChange={handleChange}
      label="Name"
      placeholder="Name"
    />
    <AddressField
      name="me.corporationSettings.companyAddress"
      value={me.corporationSettings.companyAddress}
      onChange={handleChange}
    />
    <FilesField
      field="corporationSettings.incProof"
      label="Inc. Proof"
      files={me.corporationSettings.incProof}
      mutation={updateInvestorFiles}
      mutationName="updateInvestorFiles"
    />
  </div>;
CorporationSettings.propTypes = {
  me: MePropType.isRequired,
  handleChange: PropTypes.func.isRequired,
  updateInvestorFiles: PropTypes.func.isRequired,
};

export default CorporationSettings;
