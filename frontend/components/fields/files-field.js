import PropTypes from 'prop-types';
import { Component } from 'react';
import { Button, Form, Progress, List } from 'semantic-ui-react';
import uploadcare from 'uploadcare-widget';
import remove from 'lodash/remove';

import { FilePropType } from '../../lib/prop-types';

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

const FilesControl = ({ value, onDeleteClick, progress, uploading, onUploadClick, single }) =>
  <div>
    <List>
      {value.map(file => <FileItem key={file.url} file={file} onDeleteClick={onDeleteClick} />)}
      {uploading &&
        <List.Item>
          <Progress percent={progress * 100} indicating />
        </List.Item>}
    </List>
    {(!single || value.length === 0) &&
      <Button
        type="button"
        primary
        disabled={uploading}
        content={uploading ? 'Uploading…' : 'Upload'}
        icon={uploading ? 'cloud upload' : 'upload'}
        labelPosition="left"
        onClick={onUploadClick}
      />}
  </div>;
FilesControl.propTypes = {
  value: PropTypes.arrayOf(FilePropType).isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired,
  uploading: PropTypes.bool.isRequired,
  onUploadClick: PropTypes.func.isRequired,
  single: PropTypes.bool.isRequired,
};

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(FilePropType),
    onChange: PropTypes.func,
    label: PropTypes.string.isRequired,
    imagesOnly: PropTypes.bool,
    tabs: PropTypes.arrayOf(PropTypes.string),
    crop: PropTypes.string,
    single: PropTypes.bool,
    width: PropTypes.number,
  };
  static defaultProps = {
    value: [],
    onChange: () => {},
    imagesOnly: false,
    tabs: ['file', 'gdrive', 'dropbox', 'url'],
    crop: 'disabled',
    single: false,
    width: 16,
  };
  state = {
    progress: 1,
    value: this.props.value,
  };
  onUploadClick = event => {
    event.preventDefault();
    const [tab] = this.props.tabs;
    const dialog = uploadcare.openDialog(null, tab, {
      imagesOnly: this.props.imagesOnly,
      tabs: this.props.tabs,
      crop: this.props.crop,
    });
    dialog.done(file => {
      file.progress(({ progress }) => {
        this.setState({ progress });
      });
      file.fail(() => {
        this.setState({ progress: 1 });
      });
      file.done(async ({ name, cdnUrl, originalImageInfo }) => {
        const value = [...this.state.value, {
          name,
          url: cdnUrl,
          image: !!originalImageInfo,
          uploaded: false,
        }];
        this.setState({ value });
        this.props.onChange(event, { name: this.props.name, value });
      });
    });
  };
  onDeleteClick = url => event => {
    event.preventDefault();
    const value = [...this.state.value];
    remove(value, file => file.url === url);
    this.setState({ value });
    this.props.onChange(event, { name: this.props.name, value });
  };
  uploading = () => this.state.progress < 1;
  render() {
    return (
      <Form.Field
        label={this.props.label}
        width={this.props.width}
        control={FilesControl}
        value={this.state.value}
        onDeleteClick={this.onDeleteClick}
        progress={this.state.progress}
        uploading={this.uploading()}
        onUploadClick={this.onUploadClick}
        single={this.props.single}
      />
    );
  }
}
