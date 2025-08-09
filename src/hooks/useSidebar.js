import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

export const useSidebar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isSmallScreen);

  useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const closeDrawer = () => {
    if (isSmallScreen) {
      setOpen(false);
    }
  };

  return {
    open,
    isSmallScreen,
    toggleDrawer,
    closeDrawer,
  };
};
