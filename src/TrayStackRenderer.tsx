/**
 * TrayStackRenderer.tsx
 *
 * Renders the active tray in a given stack, handling safe area insets and dynamic tray resolution.
 */
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TrayRegistry, TrayStackConfig } from './types';
import { TrayRenderer } from './TrayRenderer';

interface StackTray {
  id: string;
  tray: string;
  props: unknown;
}

/**
 * TrayStackRenderer
 *
 * Renders the top-most (active) tray in the provided stack using the given configuration and tray registry.
 *
 * @template T - The tray registry type.
 * @param stack - The current stack of trays.
 * @param config - Tray stack configuration.
 * @param trays - Registry mapping tray keys to tray components.
 */
export const TrayStackRenderer = <T extends TrayRegistry>({
  stack,
  config,
  trays,
}: {
  stack: StackTray[];
  config: TrayStackConfig;
  trays: T;
}) => {
  const insets = useSafeAreaInsets();
  const activeTray = stack[stack.length - 1];
  if (!activeTray) return null;
  const TrayComponent = trays[activeTray.tray]?.component;

  return (
    <>
      {TrayComponent && (
        <TrayRenderer
          trayKey={activeTray.id}
          trayProps={activeTray.props}
          config={config}
          TrayComponent={TrayComponent}
          insets={
            config.ignoreSafeArea
              ? { top: 0, bottom: 0, left: 0, right: 0 }
              : insets
          }
        />
      )}
    </>
  );
};
