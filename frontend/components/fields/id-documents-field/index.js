import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form } from 'semantic-ui-react';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import remove from 'lodash/remove';
import uuid from 'uuid/v4';

import { IdDocumentPropType } from '../../../lib/prop-types';
import IdDocumentControl from './id-document-control';

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(IdDocumentPropType).isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
  };
  onAddIdDocument = idDocument => {
    const value = cloneDeep(this.props.value);
    value.push({
      id: uuid(),
      ...idDocument,
    });
    this.props.onChange(null, { name: this.props.name, value });
  };
  onEditIdDocument = idDocument => {
    const value = cloneDeep(this.props.value);
    const index = findIndex(value, ({ id }) => idDocument.id === id);
    value[index] = idDocument;
    this.props.onChange(null, { name: this.props.name, value });
  };
  onDeleteIdDocument = idDocument => event => {
    const value = cloneDeep(this.props.value);
    remove(value, ({ id }) => idDocument.id === id);
    this.props.onChange(event, { name: this.props.name, value });
    setTimeout(() => {
      document.body.classList.add('dimmable', 'dimmed');
    }, 0);
  };
  render() {
    return (
      <Form.Field
        label={this.props.label}
        control={IdDocumentControl}
        value={this.props.value}
        onAddIdDocument={this.onAddIdDocument}
        onEditIdDocument={this.onEditIdDocument}
        onDeleteIdDocument={this.onDeleteIdDocument}
      />
    );
  }
}
