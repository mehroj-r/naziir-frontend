import { Outlet } from 'react-router-dom';
import styles from './index.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthLayout = () => {
	return (
		<div className={styles.authLayout}>
			<GoogleOAuthProvider clientId="809059444803-jn9ol6ntnvc4nsqnoff0crrpgfpluj7g.apps.googleusercontent.com">
				<Outlet />
			</GoogleOAuthProvider>
		</div>
	);
};

export default AuthLayout;
