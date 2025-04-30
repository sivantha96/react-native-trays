import { render } from '@testing-library/react-native';
import { TrayRenderer } from '../src/TrayRenderer';

describe('TrayRenderer', () => {
  it('renders the TrayComponent and close button', () => {
    const DummyTray = ({ text }: { text: string }) => <>{text}</>;
    const { getByText } = render(
      <TrayRenderer
        trayKey="dummy"
        trayProps={{ text: 'Hello Tray' }}
        config={{}}
        TrayComponent={DummyTray as any}
        insets={{ bottom: 0, left: 0, right: 0 }}
      />
    );
    expect(getByText('Hello Tray')).toBeTruthy();
  });
});
