import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getQuotes } from '../utils/api';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Box,
    Fab,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { formatDate } from '../utils/reusableComponents/reusableComponents';

const QuoteList = () => {
    const [quotes, setQuotes] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();
    const limit = 20;
    const hasFetchedInitial = useRef(false)
    const observer = useRef(null);
    const lastQuoteElementRef = useCallback((node) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                debouncedFetchQuotes();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    const fetchQuotes = useCallback(async () => {
        if (!token || isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const response = await getQuotes(limit, offset, token);
            const newQuotes = response.data;
            if (newQuotes.length === 0) {
                setHasMore(false);
            } else {
                setQuotes((prevQuotes) => [...prevQuotes, ...newQuotes]);
                setOffset((prevOffset) => prevOffset + newQuotes.length);
            }
            if (newQuotes.length < limit) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [token, isLoading, hasMore, offset, limit]);

    const debouncedFetchQuotes = useCallback(
        debounce(() => {
            if (hasFetchedInitial.current) {
                fetchQuotes();
            }
        }, 1000),
        [fetchQuotes]
    );

    useEffect(() => {
        if (!hasFetchedInitial.current) {
            fetchQuotes();
            hasFetchedInitial.current = true;
        }
    }, []);

    return (
        <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3, py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Inspirational Quotes
            </Typography>
            <Grid container spacing={3}>
                {quotes.map((quote, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={quote.id}
                        ref={index === quotes.length - 1 ? lastQuoteElementRef : null}
                    >
                        <Card>
                            <CardMedia
                                component="div"
                                sx={{
                                    height: 0,
                                    paddingTop: '75%', // 4:3 aspect ratio
                                    position: 'relative',
                                }}
                                image={quote.mediaUrl}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: 2,
                                    }}
                                >
                                    <Typography variant="body1" align="center">
                                        {quote.text}
                                    </Typography>
                                </Box>
                            </CardMedia>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    By {quote.username}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    on {formatDate(quote.createdAt)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={() => navigate('/create')}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};

export default QuoteList;

