import { registerRootComponent } from 'expo';
import React from 'react';
import NativeUserApp from './src/components/native/NativeUserApp';

/**
 * MobileExpoApp Root Component
 * 100% Pure React Native Application
 */
function MobileExpoApp() {
  return <NativeUserApp />;
}

registerRootComponent(MobileExpoApp);

export default MobileExpoApp;
