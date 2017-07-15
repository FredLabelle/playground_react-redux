import PropTypes from 'prop-types';
import { Header, Form } from 'semantic-ui-react';

import { InvestorPropType } from '../../lib/prop-types';
import NameField from '../fields/name-field';
import AddressField from '../fields/address-field';
import FilesField from '../fields/files-field';

const CorporationSettingsFields = ({ investor, handleChange }) =>
  <div>
    <Header as="h3" dividing>
      Legal representative
    </Header>
    <NameField name="investor.name" value={investor.name} onChange={handleChange} />
    <Form.Input
      name="investor.corporationSettings.position"
      value={investor.corporationSettings.position}
      onChange={handleChange}
      label="Position"
      placeholder="Position"
    />
    <Header as="h3" dividing>
      Company information
    </Header>
    <Form.Input
      name="investor.corporationSettings.companyName"
      value={investor.corporationSettings.companyName}
      onChange={handleChange}
      label="Name"
      placeholder="Name"
    />
    <AddressField
      name="investor.corporationSettings.companyAddress"
      value={investor.corporationSettings.companyAddress}
      onChange={handleChange}
    />
    <FilesField
      name="investor.corporationSettings.incProof"
      value={investor.corporationSettings.incProof}
      onChange={handleChange}
      label="Inc. Proof"
    />
  </div>;
CorporationSettingsFields.propTypes = {
  investor: InvestorPropType.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default CorporationSettingsFields;
