import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, TextField, Typography, Container, CircularProgress, Alert } from '@mui/material';
import { FixedSizeList as List } from 'react-window';

const RandomStringGenerator: React.FC = () => {
  // State declarations
  const [wordCount, setWordCount] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [occurrenceCount, setOccurrenceCount] = useState<number>(0);
  const [wordCountError, setWordCountError] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedWords, setGeneratedWords] = useState<string[]>([]);

  /**
   * Validates the word count input
   * @param count Number of words to generate
   * @returns Whether the count is valid or not
   */
  const validateWordCount = useCallback((count: number): boolean => {
    if (count < 1) {
      setWordCountError('Word count must be a positive integer');
      setGeneratedWords([]);
      return false;
    }
    setWordCountError('');
    return true;
  }, []);

  /**
   * Generates a random array of words asynchronously with simulated delay
   * @param count Number of words to generate
   * @returns A promise that resolves with an array of words
   */
  const generateRandomWordsAsync = useCallback(async (count: number): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const words = Array.from({ length: count }, () =>
          Math.random().toString(36).substring(2, 7)
        );
        resolve(words);
      }, 500);
    });
  }, []);

  // Effect to handle asynchronous word generation
  useEffect(() => {
    const generateWords = async () => {
      if (!validateWordCount(wordCount)) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const words = await generateRandomWordsAsync(wordCount);
        setGeneratedWords(words);
      } catch (error) {
        setWordCountError('Error generating words. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    generateWords();
  }, [wordCount, validateWordCount, generateRandomWordsAsync]);

  // Memoized search results to avoid unnecessary calculations
  const memoizedSearchResults = useMemo(() => {
    if (searchTerm.trim() === '') {
      return [];
    }
    return generatedWords.filter((word) => word.includes(searchTerm));
  }, [searchTerm, generatedWords]);

  // Effect to update search results and occurrence count
  useEffect(() => {
    setSearchResults(memoizedSearchResults);
    setOccurrenceCount(memoizedSearchResults.length);
  }, [memoizedSearchResults]);

  // Memoized Row renderer for virtualization of generated words
  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <Typography variant="body2" style={style} noWrap>
        {generatedWords[index]}
      </Typography>
    ),
    [generatedWords]
  );

  // Memoized Row renderer for virtualization of search results
  const ResultRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <Typography variant="body2" style={style} noWrap>
        {searchResults[index]}
      </Typography>
    ),
    [searchResults]
  );

  return (
    <Container maxWidth="sm" role="main">
      <Box my={4}>
        <Typography variant="h5" gutterBottom>
          Random String Generator and Search
        </Typography>
        {wordCountError && <Alert severity="error">{wordCountError}</Alert>}
        <TextField
          label="Number of Words"
          type="number"
          variant="outlined"
          value={wordCount}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            setWordCount(Number.isNaN(value) ? 0 : value);
          }}
          error={!!wordCountError}
          helperText={wordCountError}
          fullWidth
          margin="normal"
          aria-label="Number of words to generate"
        />
        <TextField
          label="Search Term"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
          aria-label="Text to search within the generated words"
        />
        <Typography variant="body1" my={2} aria-live="polite">
          Generated Words:
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress aria-busy="true" aria-label="Loading..." />
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: '170px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              padding: '8px',
              marginBottom: '16px',
            }}
          >
            <List
              height={170}
              itemCount={generatedWords.length}
              itemSize={30}
              width="100%"
            >
              {Row}
            </List>
          </Box>
        )}
        <Typography variant="h6" my={2} aria-live="polite">
          Occurrences of "{searchTerm}": {occurrenceCount}
        </Typography>
        {searchTerm.trim() !== '' && (
          <>
            <Typography variant="body1" my={2} aria-live="polite">
              Search Results:
            </Typography>
            <Box
              sx={{
                maxHeight: '170px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                padding: '8px',
                marginBottom: '16px',
              }}
            >
              <List
                height={170}
                itemCount={searchResults.length}
                itemSize={30}
                width="100%"
              >
                {ResultRow}
              </List>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default RandomStringGenerator;
