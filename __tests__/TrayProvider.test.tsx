import { render, fireEvent } from '@testing-library/react-native';
import { TrayProvider, useTrays } from '../src';
import { Text, Button } from 'react-native';

describe('TrayProvider', () => {
  const TestTray = ({ message }: { message: string }) => <Text>{message}</Text>;
  const trays = {
    TestTray: { component: TestTray },
  };

  const TestComponent = () => {
    const traysApi = useTrays('main');
    return (
      <>
        <Button
          title="Open"
          onPress={() => traysApi.push('TestTray', { message: 'Hello' })}
        />
      </>
    );
  };

  it('renders tray when pushed', () => {
    const { getByText, getByRole } = render(
      <TrayProvider trays={trays}>
        <TestComponent />
      </TrayProvider>
    );
    fireEvent.press(getByRole('button'));
    expect(getByText('Hello')).toBeTruthy();
  });
});
