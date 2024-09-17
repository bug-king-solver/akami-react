import React, { useState, useEffect, useMemo } from 'react';
import { Box, TextField, Typography, Container } from '@mui/material';
import { FixedSizeList as List } from 'react-window';

const RandomStringGenerator: React.FC = () => {
  const [wordCount, setWordCount] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [occurrenceCount, setOccurrenceCount] = useState<number>(0);
  const [wordCountError, setWordCountError] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const generateRandomWords = (count: number): string[] => {
    return Array.from({ length: count }, () =>
      Math.random().toString(36).substring(2, 7)
    );
  };

  const generatedWords = useMemo(() => {
    if (wordCount < 1) {
      setWordCountError('Word count must be a positive integer');
      return [];
    } else {
      setWordCountError('');
      return generateRandomWords(wordCount);
    }
  }, [wordCount]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setOccurrenceCount(0);
      setSearchResults([]);
    } else {
      const results = generatedWords.filter((word) => word.includes(searchTerm));
      setSearchResults(results);
      setOccurrenceCount(results.length);
    }
  }, [searchTerm, generatedWords]);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <Typography variant="body2" style={style} noWrap>
      {generatedWords[index]}
    </Typography>
  );

  const ResultRow = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <Typography variant="body2" style={style} noWrap>
      {searchResults[index]}
    </Typography>
  );

  return (
    <Container maxWidth="sm" role="main">
      <Box my={4}>
        <Typography variant="h5" gutterBottom>
          Random String Generator and Search
        </Typography>
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
        <Box
          sx={{
            maxHeight: '180px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '8px',
            marginBottom: '16px',
          }}
        >
          <List
            height={180}
            itemCount={generatedWords.length}
            itemSize={30}
            width="100%"
          >
            {Row}
          </List>
        </Box>
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
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                padding: '8px',
                marginBottom: '16px',
              }}
            >
              <List
                height={200}
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
