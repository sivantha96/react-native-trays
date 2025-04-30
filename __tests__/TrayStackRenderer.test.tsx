import { render } from '@testing-library/react-native';
import { TrayStackRenderer } from '../src/TrayStackRenderer';

describe('TrayStackRenderer', () => {
  const DummyTray = ({ label }: { label: string }) => <>{label}</>;
  const trays = {
    Dummy: { component: DummyTray },
  };
  const stack = [
    { id: '1', tray: 'Dummy', props: { label: 'First' } },
    { id: '2', tray: 'Dummy', props: { label: 'Second' } },
  ];
  it('renders the top tray in the stack', () => {
    const { getByText } = render(
      <TrayStackRenderer stack={stack} config={{}} trays={trays} />
    );
    expect(getByText('Second')).toBeTruthy();
  });
});
