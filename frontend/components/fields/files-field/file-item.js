import PropTypes from 'prop-types';
import { Button, List } from 'semantic-ui-react';

import { FilePropType } from '../../../lib/prop-types';

const FileItem = ({ file: { name, url, uploaded }, onDeleteClick }) =>
  <List.Item>
    <List.Content floated="left">
      <a href={url} download>
        <Button type="button" primary icon="download" />
      </a>
    </List.Content>
    <List.Content floated="right">
      <Button type="button" color="red" icon="trash" onClick={onDeleteClick(url)} />
    </List.Content>
    <List.Content
      style={{ lineHeight: '36px' }}
      as={uploaded ? 'a' : 'span'}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      verticalAlign="middle"
    >
      {name}
    </List.Content>
  </List.Item>;
FileItem.propTypes = {
  file: FilePropType.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default FileItem;
