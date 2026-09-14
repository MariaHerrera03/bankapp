/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PreviewApp from './PreviewApp';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {/* <LoginScreen /> */}
      <PreviewApp />
    </SafeAreaProvider>
  );
}

export default App;
