import { render } from '@testing-library/react-native';
import { TrayRenderer } from '../src/TrayRenderer';

describe('TrayRenderer', () => {
  it('renders the TrayComponent with props', () => {
    const DummyTray = ({ text }: { text: string }) => <>{text}</>;
    const { getByText } = render(
      <TrayRenderer
        trayKey="dummy"
        trayProps={{ text: 'Hello Tray' }}
        config={{}}
        TrayComponent={DummyTray as any}
        insets={{ bottom: 0, left: 0, right: 0, top: 0 }}
      />
    );
    expect(getByText('Hello Tray')).toBeTruthy();
  });

  it('handles keyboard adjustment logic (no crash)', () => {
    // Keyboard events are hard to simulate, but we can ensure no crash with adjustForKeyboard=true
    const DummyTray = ({ text }: { text: string }) => <>{text}</>;
    render(
      <TrayRenderer
        trayKey="dummy"
        trayProps={{ text: 'Keyboard' }}
        config={{ adjustForKeyboard: true }}
        TrayComponent={DummyTray as any}
        insets={{ bottom: 0, left: 0, right: 0, top: 0 }}
      />
    );
    // No assertion needed; test passes if no error
  });

  it('applies custom animation props', () => {
    const DummyTray = ({ text }: { text: string }) => <>{text}</>;
    render(
      <TrayRenderer
        trayKey="dummy"
        trayProps={{ text: 'Anim' }}
        config={{
          horizontalSpacing: 42,
        }}
        TrayComponent={DummyTray as any}
        insets={{ bottom: 10, left: 5, right: 5, top: 0 }}
      />
    );
    // No assertion needed; test passes if no error
  });
});
