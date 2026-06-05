import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert, Box, IconButton, keyframes } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { removeNotification } from '../store/slices/uiSlice';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
`;

export default function GlobalSnackbar() {
  const notifications = useSelector((state) => state.ui.notifications);
  const dispatch = useDispatch();

  const handleClose = (id) => {
    dispatch(removeNotification(id));
  };

  React.useEffect(() => {
    const handleAppNotification = (e) => {
      const { type, message, title } = e.detail;
      dispatch({
        type: 'ui/addNotification', // Using string type to avoid circular/import issues if any
        payload: { id: Date.now().toString(), type, message, title }
      });
    };
    window.addEventListener('app-notification', handleAppNotification);
    return () => window.removeEventListener('app-notification', handleAppNotification);
  }, [dispatch]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        pointerEvents: 'none',
      }}
    >
      {notifications.map((n) => (
        <Snackbar
          key={n.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            position: 'relative',
            pointerEvents: 'auto',
            animation: `${slideIn} 0.3s ease-out forwards`,
          }}
        >
          <Alert
            severity={n.type || 'info'}
            variant="filled"
            onClose={() => handleClose(n.id)}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => handleClose(n.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              backgroundColor: '#111111', // pure minimal black/zinc
              color: '#fafafa',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              border: '1px solid rgba(17, 17, 17, 0.08)',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 500,
              minWidth: 280,
              maxWidth: 400,
              display: 'flex',
              alignItems: 'center',
              '& .MuiAlert-icon': {
                color: n.type === 'error' ? '#ef4444' : n.type === 'success' ? '#10b981' : '#F5B844',
              },
            }}
          >
            {n.title || n.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
}
