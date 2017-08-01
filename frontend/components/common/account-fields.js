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
    <Form.Input
      name="investor.email"
      value={investor.email}
      onChange={handleChange}
      label="Email"
      placeholder="Email"
      type="email"
      required
      disabled={signup}
    />
    <Form.Group>
      <Form.Input
        name="investor.phone1"
        value={investor.phone1}
        onChange={handleChange}
        label="Phone 1"
        placeholder="Phone 1"
        type="tel"
        width={8}
      />
      <Form.Input
        name="investor.phone2"
        value={investor.phone2}
        onChange={handleChange}
        label="Phone 2"
        placeholder="Phone 2"
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
    {!signup &&
      <InvestmentField
        name="investor.investmentSettings"
        value={investor.investmentSettings}
        onChange={handleChange}
        dealCategories={dealCategories}
        defaultCurrency={defaultCurrency}
      />}
  </div>;
AccountFields.propTypes = {
  investor: InvestorPropType.isRequired,
  signup: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  organization: OrganizationPropType.isRequired,
};
AccountFields.defaultProps = { signup: false };

export default AccountFields;
