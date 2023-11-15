import moment from 'moment';

const getDate = () => moment().format('MM-DD-YYYY, h:mm:ss a');

export default getDate;
