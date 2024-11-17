import styles from './Header.module.scss'
import profileImage from "../../assets/images/profileImage.png"
import { HamburgerIcon, SearchIcon } from '../../assets/icons/headerIcons'
import { useNavigate } from 'react-router-dom'

export default function Header({ setOpenSidebar }) {
  const navigate = useNavigate();

  return(
    <div className={styles.header}>

      <button onClick={() => setOpenSidebar(v => !v)}>
        <HamburgerIcon />
      </button>

      <div className={styles.searchContainer}>
        <input type="text" className={styles.searchInput} />
        <button>
          <SearchIcon />
        </button>
      </div>

      <div className={styles.profile} onClick={() => navigate('/logout')}>
        <img src={profileImage} className={styles.profileImage} alt="profile image" />
        <span className={styles.userName}>Palonchiev Pistonchi</span>
      </div>
      
    </div>
  )
}