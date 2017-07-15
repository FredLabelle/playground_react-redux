import PropTypes from 'prop-types';
import { Header, Form } from 'semantic-ui-react';

import { InvestorPropType } from '../../lib/prop-types';
import RadioField from '../fields/radio-field';
import IndividualSettingsFields from './individual-settings-fields';
import CorporationSettingsFields from './corporation-settings-fields';
import NameField from '../fields/name-field';

const AdministrativeFields = ({ investor, handleChange }) =>
  <div>
    <RadioField
      name="investor.type"
      value={investor.type}
      onChange={handleChange}
      radio={[
        { value: 'individual', label: 'Individual' },
        { value: 'corporation', label: 'Corporation' },
      ]}
      label="Type of Investor"
    />
    {investor.type === 'individual'
      ? <IndividualSettingsFields investor={investor} handleChange={handleChange} />
      : <CorporationSettingsFields investor={investor} handleChange={handleChange} />}
    <Header as="h3" dividing>
      Advisor
    </Header>
    <p>
      You can mention the information of an advisor that will be in copy of every correspondence.
    </p>
    <NameField name="investor.advisor.name" value={investor.advisor.name} onChange={handleChange} />
    <Form.Input
      name="investor.advisor.email"
      value={investor.advisor.email}
      onChange={handleChange}
      label="Email"
      placeholder="Email"
      type="email"
    />
  </div>;
AdministrativeFields.propTypes = {
  investor: InvestorPropType.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default AdministrativeFields;
