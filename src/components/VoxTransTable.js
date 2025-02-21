import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as ContentCopyIcon,
  Translate as TranslateIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import './Pagination.css';
import { useNavigate } from 'react-router-dom';

const VoiceTransTable = () => {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ username: '', userId: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const entriesPerPage = 5;

  const handleVisibilityClick = useCallback((id) => {
    navigate(`/dashboard/voice/${id}`);
  }, [navigate]);


  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setActiveRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveRow(null);
  };

  const fetchTranslations = useCallback(async () => {
    setLoading(true);
    if (!user.userId) {
      console.error('Invalid user ID format');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post('https://agents.tericlab.com:8080/get_voices', {
        user_id: user.userId
      });
      
      const processedData = response.data.entries.map(entry => ({
        id: entry.doc_id,
        date: new Date(entry.Date),
        originalText: entry.Original_transcript.map(t => t.text).join(' '),
        sourceLang: entry.source_lang,
        translations: Object.entries(entry.Translations).map(([lang, texts]) => ({
          language: lang,
          text: texts.map(t => t.text).join(' ')
        }))
      }));
      
      setTranslations(processedData);
    } catch (err) {
      setError('Failed to fetch translations');
      setSnackbar({
        open: true,
        message: 'Failed to fetch translations',
        severity: 'error'
      });
      console.error('Error fetching translations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({
        open: true,
        message: 'Text copied to clipboard',
        severity: 'success'
      });
    }).catch(() => {
      setSnackbar({
        open: true,
        message: 'Failed to copy text',
        severity: 'error'
      });
    });
    handleMenuClose();
  };

  const handleDownload = (id) => {
    setSnackbar({
      open: true,
      message: 'Download started',
      severity: 'success'
    });
    handleMenuClose();
  };

  const handleDelete = async (id) => {
    try {
      // Implement delete logic here
      setSnackbar({
        open: true,
        message: 'Translation deleted successfully',
        severity: 'success'
      });
      fetchTranslations();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete translation',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  const filteredTranslations = translations.filter(trans =>
    trans.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trans.translations.some(t => t.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedTranslations = filteredTranslations.sort((a, b) => {
    if (orderBy === 'date') {
      return order === 'asc' ? a.date - b.date : b.date - a.date;
    }
    const aValue = a[orderBy]?.toString().toLowerCase() || '';
    const bValue = b[orderBy]?.toString().toLowerCase() || '';
    return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  const displayedTranslations = sortedTranslations.slice(
    currentPage * entriesPerPage,
    (currentPage + 1) * entriesPerPage
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
            Voice Translations
          </Typography>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table aria-label="voice translations table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'date'}
                        direction={orderBy === 'date' ? order : 'asc'}
                        onClick={() => handleSort('date')}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Original Text</TableCell>
                    <TableCell>Source Language</TableCell>
                    <TableCell>Translations</TableCell>
                    <TableCell></TableCell>
                        
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedTranslations.map((trans) => (
                    <TableRow key={trans.id} hover>
                      <TableCell>
                        {trans.date.toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 250 }}>
                        <Tooltip title={trans.originalText}>
                          <Typography noWrap>{trans.originalText}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<TranslateIcon />}
                          label={trans.sourceLang.toUpperCase()}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Stack spacing={1}>
                          {trans.translations.map((t, idx) => (
                            <Box key={idx}>
                              <Typography variant="caption" color="text.secondary">
                                {t.language.toUpperCase()}:
                              </Typography>
                              <Tooltip title={t.text}>
                                <Typography noWrap>{t.text}</Typography>
                              </Tooltip>
                            </Box>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell 

                          onClick={() => handleVisibilityClick(trans.id)}
                        >
                        <VisibilityIcon/>
                        </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, trans)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <ReactPaginate
                previousLabel="Previous"
                nextLabel="Next"
                breakLabel="..."
                pageCount={Math.ceil(filteredTranslations.length / entriesPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={({ selected }) => setCurrentPage(selected)}
                containerClassName="pagination"
                activeClassName="active"
                previousClassName="page-item"
                nextClassName="page-item"
                pageClassName="page-item"
                breakClassName="page-item"
                pageLinkClassName="page-link"
                previousLinkClassName="page-link"
                nextLinkClassName="page-link"
                breakLinkClassName="page-link"
                activeLinkClassName="active-link"
              />
            </Box>
          </>
        )}
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleCopyText(activeRow?.originalText)}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          Copy Original Text
        </MenuItem>
        <MenuItem onClick={() => handleDownload(activeRow?.id)}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
        <MenuItem onClick={() => handleDelete(activeRow?.id)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VoiceTransTable;