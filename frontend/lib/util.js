import flatten from 'lodash/flatten';
import transform from 'lodash/transform';
import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

export const sleep = duration =>
  new Promise(resolve => {
    setTimeout(resolve, duration);
  });

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
    this.setState({ [prop]: newValue }, afterChange);
  };

export const generateInvitationEmailContent = (organization, { name }, url) => {
  const replace = string =>
    string
      .replace(/{{firstname}}/g, name.firstName)
      .replace(/{{lastname}}/g, name.lastName)
      .replace(/{{organization}}/g, organization.generalSettings.name)
      .replace(/{{url}}/g, url);
  return {
    subject: replace(organization.parametersSettings.invitationEmail.subject),
    body: replace(organization.parametersSettings.invitationEmail.body),
  };
};
