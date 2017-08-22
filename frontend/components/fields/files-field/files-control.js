import PropTypes from 'prop-types';
import { Progress, Button, List } from 'semantic-ui-react';

import { FilePropType } from '../../../lib/prop-types';
import FileItem from './file-item';

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

export default FilesControl;
