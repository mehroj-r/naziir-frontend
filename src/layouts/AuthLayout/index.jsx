import { Outlet } from 'react-router-dom';
import styles from './index.module.scss';
import 'react-toastify/dist/ReactToastify.css';

const AuthLayout = () => {
	return (
		<div className={styles.authLayout}>
			<Outlet />
		</div>
	);
};

export default AuthLayout;
