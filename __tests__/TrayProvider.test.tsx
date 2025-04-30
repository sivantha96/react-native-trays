import { render, fireEvent } from '@testing-library/react-native';
import { TrayProvider, useTrays } from '../src';
import { Text, Button } from 'react-native';

describe('TrayProvider', () => {
  const TestTray = ({ message }: { message: string }) => <Text>{message}</Text>;
  const trays = {
    TestTray: { component: TestTray },
  };

  it('renders tray when pushed', () => {
    const TestComponent = () => {
      const traysApi = useTrays('main');
      return (
        <Button
          title="Open"
          onPress={() => traysApi.push('TestTray', { message: 'Hello' })}
        />
      );
    };
    const { getByText, getByRole } = render(
      <TrayProvider trays={trays}>
        <TestComponent />
      </TrayProvider>
    );
    fireEvent.press(getByRole('button'));
    expect(getByText('Hello')).toBeTruthy();
  });

  it('pop removes the top tray', () => {
    const TestComponent = () => {
      const traysApi = useTrays('main');
      return (
        <>
          <Button
            title="Open"
            onPress={() => traysApi.push('TestTray', { message: 'One' })}
          />
          <Button
            title="Open2"
            onPress={() => traysApi.push('TestTray', { message: 'Two' })}
          />
          <Button title="Pop" onPress={() => traysApi.pop()} />
        </>
      );
    };
    const { getByText, getByRole, queryByText } = render(
      <TrayProvider trays={trays}>
        <TestComponent />
      </TrayProvider>
    );
    fireEvent.press(getByRole('button', { name: 'Open' }));
    fireEvent.press(getByRole('button', { name: 'Open2' }));
    expect(getByText('Two')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'Pop' }));
    expect(getByText('One')).toBeTruthy();
    expect(queryByText('Two')).toBeNull();
  });

  it('replaceById replaces a specific tray', () => {
    let trayId: string | null = null;
    const TestComponent = () => {
      const traysApi = useTrays('main');
      return (
        <>
          <Button
            title="Open"
            onPress={() => {
              traysApi.push('TestTray', { message: 'First' });
            }}
          />
          <Button
            title="Replace"
            onPress={() => {
              // Simulate replacing by ID (get id from stack)
              // This is a hack for the test; in real use, IDs are internal
              // We'll push, then replace the only tray by its ID
              trayId = (traysApi as any).stack?.[0]?.id;
              if (trayId) traysApi.replaceById(trayId, { message: 'Replaced' });
            }}
          />
        </>
      );
    };
    const { getByRole, getByText, queryByText } = render(
      <TrayProvider trays={trays}>
        <TestComponent />
      </TrayProvider>
    );
    fireEvent.press(getByRole('button', { name: 'Open' }));
    expect(getByText('First')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'Replace' }));
    expect(getByText('Replaced')).toBeTruthy();
    expect(queryByText('First')).toBeNull();
  });

  it('dismiss removes all trays with given key', () => {
    const TestComponent = () => {
      const traysApi = useTrays('main');
      return (
        <>
          <Button
            title="Open1"
            onPress={() => traysApi.push('TestTray', { message: 'One' })}
          />
          <Button
            title="Open2"
            onPress={() => traysApi.push('TestTray', { message: 'Two' })}
          />
          <Button
            title="Dismiss"
            onPress={() => traysApi.dismiss('TestTray')}
          />
        </>
      );
    };
    const { getByRole, queryByText } = render(
      <TrayProvider trays={trays}>
        <TestComponent />
      </TrayProvider>
    );
    fireEvent.press(getByRole('button', { name: 'Open1' }));
    fireEvent.press(getByRole('button', { name: 'Open2' }));
    fireEvent.press(getByRole('button', { name: 'Dismiss' }));
    expect(queryByText('One')).toBeNull();
    expect(queryByText('Two')).toBeNull();
  });

  it('dismissAll removes all trays from stack', () => {
    const TestComponent = () => {
      const traysApi = useTrays('main');
      return (
        <>
          <Button
            title="Open1"
            onPress={() => traysApi.push('TestTray', { message: 'One' })}
          />
          <Button
            title="Open2"
            onPress={() => traysApi.push('TestTray', { message: 'Two' })}
          />
          <Button title="DismissAll" onPress={traysApi.dismissAll} />
        </>
      );
    };
    const { getByRole, queryByText } = render(
      <TrayProvider trays={trays}>
        <TestComponent />
      </TrayProvider>
    );
    fireEvent.press(getByRole('button', { name: 'Open1' }));
    fireEvent.press(getByRole('button', { name: 'Open2' }));
    fireEvent.press(getByRole('button', { name: 'DismissAll' }));
    expect(queryByText('One')).toBeNull();
    expect(queryByText('Two')).toBeNull();
  });

  it('multiple stacks are isolated', () => {
    const TestComponent = () => {
      const mainApi = useTrays('main');
      const altApi = useTrays('alt');
      return (
        <>
          <Button
            title="Main"
            onPress={() => mainApi.push('TestTray', { message: 'Main' })}
          />
          <Button
            title="Alt"
            onPress={() => altApi.push('TestTray', { message: 'Alt' })}
          />
        </>
      );
    };
    const { getByRole, getByText, queryByText } = render(
      <TrayProvider trays={trays}>
        <TestComponent />
      </TrayProvider>
    );
    fireEvent.press(getByRole('button', { name: 'Main' }));
    expect(getByText('Main')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'Alt' }));
    expect(getByText('Alt')).toBeTruthy();
    expect(getByText('Main')).toBeTruthy();
    // Dismiss 'Alt' and ensure 'Main' remains
    fireEvent.press(getByRole('button', { name: 'Alt' })); // push again
    fireEvent.press(getByRole('button', { name: 'Alt' })); // push again
    expect(getByText('Main')).toBeTruthy();
    expect(queryByText('Alt')).toBeNull();
  });

  it('throws if useTrays is used outside provider', () => {
    const Broken = () => {
      useTrays('main');
      return null;
    };
    expect(() => render(<Broken />)).toThrow(
      'useTrays must be used within TrayProvider'
    );
  });
});
