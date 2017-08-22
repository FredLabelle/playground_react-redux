import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form } from 'semantic-ui-react';
import uploadcare from 'uploadcare-widget';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';

import { FilePropType } from '../../../lib/prop-types';
import FilesControl from './files-control';

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
    onUploadingChange: PropTypes.func,
  };
  static defaultProps = {
    value: [],
    onChange: () => {},
    imagesOnly: false,
    tabs: ['file', 'gdrive', 'dropbox', 'url'],
    crop: 'disabled',
    single: false,
    width: 16,
    onUploadingChange: () => {},
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
      this.props.onUploadingChange(true);
      file.progress(({ progress }) => {
        this.setState({ progress });
      });
      file.fail(() => {
        this.setState({ progress: 1 });
        this.props.onUploadingChange(false);
      });
      file.done(async ({ name, cdnUrl }) => {
        const value = cloneDeep(this.state.value);
        value.push({
          name,
          url: cdnUrl,
          uploaded: false,
        });
        this.setState({ value });
        this.props.onChange(event, { name: this.props.name, value });
        this.props.onUploadingChange(false);
      });
    });
  };
  onDeleteClick = url => event => {
    event.preventDefault();
    const value = cloneDeep(this.state.value);
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
