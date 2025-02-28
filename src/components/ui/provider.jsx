import { ChakraProvider, defaultSystem, extendTheme } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export function ChProvider(props) {


  return (
    <ChakraProvider value={defaultSystem} theme={theme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
