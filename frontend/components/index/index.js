import { connect } from 'react-redux';

import { RouterPropType } from '../../lib/prop-types';
import Home from './home';

const Index = ({ router }) => <Home />;
Index.propTypes = { router: RouterPropType.isRequired };

export default connect(({ router }) => ({ router }))(Index);
