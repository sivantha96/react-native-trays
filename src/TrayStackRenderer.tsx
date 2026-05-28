import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TrayRegistry, TrayStackConfig } from './types';
import { TrayRenderer } from './TrayRenderer';

interface StackTray {
  id: string;
  tray: string;
  props: unknown;
}

export const TrayStackRenderer = <T extends TrayRegistry>({
  stack,
  config,
  trays,
}: {
  stack: StackTray[];
  config: TrayStackConfig;
  trays: T;
}) => {
  const { top, bottom, left, right } = useSafeAreaInsets();
  const insets = { top, bottom, left, right };
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
          insets={insets}
        />
      )}
    </>
  );
};
