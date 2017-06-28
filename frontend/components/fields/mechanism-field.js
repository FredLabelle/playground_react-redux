import PropTypes from 'prop-types';
import RadioField from './radio-field';

const radio = [
  {
    value: 'systematic',
    label: {
      children: (
        <div>
          <p>Systematic with opt-out</p>
          <em>
            You invest a systematic amount in every deal. This guarantees your allocation in the
            deal. You can opt-out if you feel not attracted by the deal.
          </em>
        </div>
      ),
    },
  },
  {
    value: 'dealByDeal',
    label: {
      children: (
        <div>
          <p>Deal-by-Deal</p>
          <em>
            You will be presented the deal, and decide to invest on a case-by-case basis. Your
            allocation in the deal cannot be guaranteed but is based on first come first serve.
          </em>
        </div>
      ),
    },
  },
];

const MechanismField = ({ name, value, onChange, label }) =>
  <RadioField name={name} value={value} onChange={onChange} radio={radio} label={label} />;
MechanismField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default MechanismField;
