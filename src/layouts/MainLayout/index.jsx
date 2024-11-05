import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import styles from './MainLayout.module.scss';

const MainLayout = () => {
  return (
    <div className={styles.mainLayout} >
      <Header />
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  );
};


export default MainLayout;
