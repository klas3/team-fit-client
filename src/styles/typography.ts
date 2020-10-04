import { Spacing } from '.';
import { theme } from '../other/constants';

export const smallInfoLabel = {
  textAlign: 'center' as 'center',
  fontSize: Spacing.base,
};

export const largeInfoLable = {
  fontSize: Spacing.larger,
  marginBottom: Spacing.small,
  color: theme.colors.text,
};

export const errorText = {
  ...smallInfoLabel,
  color: theme.colors.primary,
  marginBottom: Spacing.smallest,
};

export const successText = {
  ...smallInfoLabel,
  color: 'green',
  marginBottom: Spacing.smallest,
};

export const infoText = {
  ...smallInfoLabel,
  color: theme.colors.textAccent,
  textAlign: 'left' as 'left',
};

export const buttonText = {
  fontSize: Spacing.large,
  color: 'white',
  textTransform: 'none' as 'none',
};
