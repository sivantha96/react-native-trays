import React, { useCallback, useMemo, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
let BlurView: React.ComponentType<any> | null = null;
try {
  BlurView = require('expo-blur').BlurView;
} catch (e) {
  BlurView = null;
}
import Animated from 'react-native-reanimated';
import uuid from 'react-native-uuid';
import { TrayContext } from './context';
import type { TrayRegistry, TrayStackConfig, TrayContextValue } from './types';
import { TrayStackRenderer } from './TrayStackRenderer';

const defaultStackConfig: TrayStackConfig = {
  backdropStyles: {},
  trayStyles: {},
  adjustForKeyboard: true,
  horizontalSpacing: 20,
  dismissOnBackdropPress: true,
};

export interface TrayProviderProps<T extends TrayRegistry> {
  trays: T;
  children: ReactNode;
  stackConfigs?: Record<string, TrayStackConfig>;
}

/**
 * TrayProvider: Manages tray stacks, context, and rendering.
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
        { id: uuid.v4().toString(), tray: trayKey, stackId, props },
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
        modifyStack(stackId, (stack) =>
          stack.map((t) => (t.tray === trayKey ? { ...t, props } : t))
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
              contextValue(stackId).pop();
            }}
          >
            {BlurView && !stackConfigs[stackId]?.disableBackgroundBlur ? (
              <BlurView style={styles.blurView} />
            ) : (
              <View style={styles.blurViewPlaceholder} />
            )}
          </Animated.View>
          <TrayStackRenderer
            stack={stack}
            config={stackConfigs[stackId] || defaultStackConfig}
            trays={trays}
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
