import flatten from 'lodash/flatten';
import transform from 'lodash/transform';
import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

export const omitDeep = (object, ...omittedKeys) => {
  const omittedKeysFlattened = flatten(omittedKeys);
  const iteratee = (result, value, key) => {
    if (omittedKeysFlattened.includes(key)) {
      return;
    }
    const newValue = isObject(value) ? transform(value, iteratee) : value;
    Object.assign(result, { [key]: newValue });
  };
  return transform(object, iteratee);
};

export const handleChange = afterChange =>
  function handleChangeFunc(event, { name, value }) {
    const [field, ...path] = name.split('.');
    const newState = cloneDeep(this.state[field]);
    const prop = path.length ? field : name;
    const newValue = path.length ? set(newState, path, value) : value;
    this.setState({ [prop]: newValue }, () => {
      if (afterChange) {
        afterChange(name);
      }
    });
  };

const numberFormatter = currency =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  });

export const formatAmount = ({ currency, amount }) => numberFormatter(currency).format(amount);
