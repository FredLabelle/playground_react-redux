import PropTypes from 'prop-types';
import { Header, Form } from 'semantic-ui-react';

import { InvestorPropType, OrganizationPropType } from '../../lib/prop-types';
import NameField from '../fields/name-field';
import PasswordField from '../fields/password-field';
import InvestmentField from '../fields/investment-field';

const AccountFields = ({
  investor,
  signup,
  handleChange,
  organization: {
    dealCategories,
    parametersSettings: { investmentMechanisms: { defaultCurrency, optOutTime } },
  },
}) =>
  <div>
    <Header as="h3" dividing>
      Investor identity
    </Header>
    <Form.Group>
      <Form.Input
        name="investor.email"
        value={investor.email}
        onChange={handleChange}
        label="Email"
        placeholder="Email"
        type="email"
        required
        disabled={signup}
        width={8}
      />
      <Form.Input
        name="investor.phone"
        value={investor.phone}
        onChange={handleChange}
        label="Phone"
        placeholder="Phone"
        type="tel"
        width={8}
      />
    </Form.Group>
    <NameField name="investor.name" value={investor.name} onChange={handleChange} />
    {signup &&
      <PasswordField
        grouped
        name="investor.password"
        value={investor.password}
        onChange={handleChange}
      />}
    <Header as="h3" dividing>
      Investment methods & criteria
    </Header>
    <p>
      For <strong>Systematic with opt-out</strong>, the opt-out time is {optOutTime} days.
    </p>
    <InvestmentField
      name="investor.investmentSettings"
      value={investor.investmentSettings}
      onChange={handleChange}
      dealCategories={dealCategories}
      defaultCurrency={defaultCurrency}
    />
  </div>;
AccountFields.propTypes = {
  investor: InvestorPropType.isRequired,
  signup: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  organization: OrganizationPropType.isRequired,
};
AccountFields.defaultProps = { signup: false };

export default AccountFields;
