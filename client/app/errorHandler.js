import Alert from 'react-s-alert';
import {hashHistory} from 'react-router';

export default (response) => {
  Alert.error(response.error.message);

  console.log(response);

  if (response.code === 'B101') {
    window.localStorage.clear();
    hashHistory.push('login');
  }
}
