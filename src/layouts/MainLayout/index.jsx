import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import styles from './MainLayout.module.scss';
import Sidebar from "../../components/Sidebar";
import { useState } from "react";

const MainLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(true);
  return (
    <div className={styles.mainLayout} >
      <span className={`${styles.sidebarWrapper} ${openSidebar ? '' : styles.closeSidebar}`}>
        <Sidebar />
      </span>
      <div className={styles.container}>
        <span className={`${styles.headerWrapper} ${openSidebar ? '' : styles.longHeader}`}>
          <Header setOpenSidebar={setOpenSidebar}/>
        </span>
        <div className={`${styles.outlet} ${openSidebar ? '' : styles.longOutlet}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};


export default MainLayout;
