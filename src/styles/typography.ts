import { Sizes } from '.';
import { theme } from '../other/constants';

export const smallInfoLabel = {
  textAlign: 'center' as 'center',
  fontSize: Sizes.base,
};

export const largeInfoLable = {
  fontSize: Sizes.larger,
  marginBottom: Sizes.small,
  color: theme.colors.text,
};

export const errorText = {
  ...smallInfoLabel,
  color: theme.colors.primary,
  marginBottom: Sizes.smallest,
};

export const successText = {
  ...smallInfoLabel,
  color: 'green',
  marginBottom: Sizes.smallest,
};

export const infoText = {
  ...smallInfoLabel,
  color: theme.colors.textAccent,
  textAlign: 'left' as 'left',
};

export const buttonText = {
  fontSize: Sizes.large,
  textTransform: 'none' as 'none',
};
