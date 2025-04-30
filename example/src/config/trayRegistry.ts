import { type TrayRegistry } from 'react-native-trays';
import { ShortTray, type ShortTrayProps } from '../components/trays/ShortTray';
import { FormTray, type FormTrayProps } from '../components/trays/FormTray';
import { TallTray, type TallTrayProps } from '../components/trays/TallTray';
import { ImageTray, type ImageTrayProps } from '../components/trays/ImageTray';
import {
  WalletDetailsTray,
  type WalletDetailsTrayProps,
} from '../components/trays/WalletDetailsTray';
import {
  EditWalletTray,
  type EditWalletTrayProps,
} from '../components/trays/EditWalletTray';
import {
  ViewPrivateKeyTray,
  type ViewPrivateKeyTrayProps,
} from '../components/trays/ViewPrivateKeyTray';

export enum TrayEnum {
  Short = 'ShortTray',
  Form = 'FormTray',
  Tall = 'TallTray',
  Image = 'ImageTray',
  WalletDetails = 'WalletDetailsTray',
  EditWallet = 'EditWalletTray',
  ViewPrivateKey = 'ViewPrivateKeyTray',
}

export type TrayProps = {
  [TrayEnum.Form]: FormTrayProps;
  [TrayEnum.Short]: ShortTrayProps;
  [TrayEnum.Tall]: TallTrayProps;
  [TrayEnum.Image]: ImageTrayProps;
  [TrayEnum.WalletDetails]: WalletDetailsTrayProps;
  [TrayEnum.EditWallet]: EditWalletTrayProps;
  [TrayEnum.ViewPrivateKey]: ViewPrivateKeyTrayProps;
};

// Define tray registry with all available tray components
export const trays: TrayRegistry = {
  ShortTray: {
    component: ShortTray,
  },
  FormTray: {
    component: FormTray,
  },
  TallTray: {
    component: TallTray,
  },
  ImageTray: {
    component: ImageTray,
  },
  WalletDetailsTray: {
    component: WalletDetailsTray,
  },
  EditWalletTray: {
    component: EditWalletTray,
  },
  ViewPrivateKeyTray: {
    component: ViewPrivateKeyTray,
  },
};
