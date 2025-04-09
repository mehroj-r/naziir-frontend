import { HamburgerIcon } from '@chakra-ui/icons'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton
} from '@chakra-ui/react'

export default function ActionMenu({ actions }) {
  return(
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<HamburgerIcon />}
        variant='outline'
        h={8}
        maxW={8}
      />
      <MenuList>
        {actions?.map((action, index) => (
          <MenuItem key={index} onClick={action?.onClick} icon={action?.icon}>
            {action?.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}