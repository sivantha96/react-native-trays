/**
 * TrayProvider.tsx
 *
 * Provides the TrayProvider React context component for managing tray stacks and rendering trays in a React Native app.
 * This file contains the core logic for tray registration, stack management, and context propagation.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  type TrayContextValue,
  type TrayProviderProps,
  type TrayRegistry,
  type TrayStackConfig,
} from './types';
import { TrayStackRenderer } from './TrayStackRenderer';
import { TrayContext } from './context';
import { generateUniqueId } from './utils';

let BlurView;
try {
  BlurView = require('expo-blur').BlurView;
} catch (e) {
  BlurView = null;
}

const defaultStackConfig: TrayStackConfig = {
  backdropStyles: {},
  trayStyles: {},
  adjustForKeyboard: true,
  horizontalSpacing: 20,
  dismissOnBackdropPress: true,
};

/**
 * TrayProvider: Manages tray stacks, context, and rendering.
 *
 * @template T - The tray registry type.
 * @param trays - An object mapping tray keys to their components.
 * @param children - React children to render inside the provider.
 * @param stackConfigs - Optional per-stack configuration overrides.
 *
 * Provides context to manage multiple, optionally-configurable tray stacks and their lifecycle.
 */
export const TrayProvider = <T extends TrayRegistry>({
  trays,
  children,
  stackConfigs = {},
}: TrayProviderProps<T>) => {
  const [stackMap, setStackMap] = useState<
    Record<
      string,
      Array<{
        id: string;
        tray: string;
        stackId: string;
        props: unknown;
      }>
    >
  >({});

  const modifyStack = useCallback(
    (
      stackId: string,
      updater: (
        stack: Array<{
          id: string;
          tray: string;
          stackId: string;
          props: unknown;
        }>
      ) =>
        | Array<{
            id: string;
            tray: string;
            stackId: string;
            props: unknown;
          }>
        | undefined
    ) => {
      setStackMap((prev) => {
        const updated = updater(prev[stackId] || []);
        if (!updated || updated.length === 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [stackId]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [stackId]: updated };
      });
    },
    []
  );

  const push = useCallback(
    (stackId: string, trayKey: string, props: unknown) => {
      modifyStack(stackId, (stack) => [
        ...stack,
        { id: generateUniqueId(), tray: trayKey, stackId, props },
      ]);
    },
    [modifyStack]
  );

  const contextValue: TrayContextValue = useCallback(
    (stackId) => ({
      push: (trayKey, props) => push(stackId, trayKey, props),
      pop: () => modifyStack(stackId, (stack) => stack.slice(0, -1)),
      replaceById: (trayId, props) =>
        modifyStack(stackId, (stack) =>
          stack.map((t) => (t.id === trayId ? { ...t, props } : t))
        ),
      replace: (trayKey, props) =>
        modifyStack(stackId, (stack) => {
          const trayExists = stack.some((t) => t.tray === trayKey);
          if (trayExists) {
            return stack.map((t) => (t.tray === trayKey ? { ...t, props } : t));
          }
          return [
            ...stack,
            { id: generateUniqueId(), tray: trayKey, stackId, props },
          ];
        }),
      replaceTrayById: (trayId, newTrayKey, props) =>
        modifyStack(stackId, (stack) =>
          stack.map((t) =>
            t.id === trayId ? { ...t, tray: newTrayKey, props } : t
          )
        ),
      replaceTray: (trayKey, newTrayKey, props) =>
        modifyStack(stackId, (stack) =>
          stack.map((t) =>
            t.tray === trayKey ? { ...t, tray: newTrayKey, props } : t
          )
        ),
      dismissById: (trayId) =>
        modifyStack(stackId, (stack) => stack.filter((t) => t.id !== trayId)),
      dismiss: (trayKey) =>
        modifyStack(stackId, (stack) =>
          stack.filter((t) => t.tray !== trayKey)
        ),
      dismissAll: () =>
        setStackMap((prev) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [stackId]: _, ...rest } = prev;
          return rest;
        }),
    }),
    [push, modifyStack]
  );

  const activeStacks = useMemo(() => Object.entries(stackMap), [stackMap]);

  return (
    <TrayContext.Provider value={contextValue}>
      {children}

      {activeStacks.map(([stackId, stack]) => (
        <React.Fragment key={stackId}>
          <Animated.View
            style={[styles.backdrop, stackConfigs[stackId]?.backdropStyles]}
            entering={FadeIn}
            exiting={FadeOut}
            onTouchEnd={() => {
              if (stackConfigs[stackId]?.dismissOnBackdropPress) {
                contextValue(stackId).pop();
              }
            }}
            pointerEvents={stackConfigs[stackId]?.backdropPointerEvents}
          >
            {BlurView && !stackConfigs[stackId]?.disableBackgroundBlur ? (
              <BlurView
                style={styles.blurView}
                {...(stackConfigs[stackId]?.blurViewProps ?? {})}
              />
            ) : (
              <View style={styles.blurViewPlaceholder} />
            )}
          </Animated.View>
          <TrayStackRenderer
            stack={stack}
            config={stackConfigs[stackId] || defaultStackConfig}
            trays={trays}
            onDismiss={() => contextValue(stackId).pop()}
          />
        </React.Fragment>
      ))}
    </TrayContext.Provider>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },
  blurView: {
    flex: 1,
  },
  blurViewPlaceholder: {
    flex: 1,
  },
});
