import { HamburgerIcon } from '@chakra-ui/icons'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton
} from '@chakra-ui/react'
import { useState } from 'react'

export default function ActionMenu({ actions }) {
  const [openMenu, setOpenMenu] = useState(false)

  const handleActionClick = (e, action) => {
    e.stopPropagation()
    action?.onClick()
  }

  const handleMenuClick = (e) => {
    e.stopPropagation()
    setOpenMenu(old => !old)
  }

  return(
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<HamburgerIcon />}
        variant='outline'
        h={8}
        maxW={8}
        onClick={handleMenuClick}
      />
      <MenuList _open={openMenu}>
        {actions?.map((action, index) => (
          <MenuItem key={index} onClick={(e) => handleActionClick(e, action)} icon={action?.icon}>
            {action?.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}