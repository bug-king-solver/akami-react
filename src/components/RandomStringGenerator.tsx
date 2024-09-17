import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Container } from '@mui/material';

const RandomStringGenerator: React.FC = () => {
  const [wordCount, setWordCount] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [occurrenceCount, setOccurrenceCount] = useState<number>(0);
  const [wordCountError, setWordCountError] = useState<string>('');

  const generateRandomWords = (count: number): string => {
    const words = Array.from({ length: count }, () =>
      Math.random().toString(36).substring(2, 7)
    );
    return words.join(' ');
  };

  useEffect(() => {
    if (wordCount < 1) {
      setWordCountError('Word count must be a positive integer');
      setGeneratedText('');
    } else {
      setWordCountError('');
      const text = generateRandomWords(wordCount);
      setGeneratedText(text);
    }
  }, [wordCount]);

  useEffect(() => {
    if (generatedText) {
      const count = generatedText.split(' ').filter((word) => word.includes(searchTerm)).length;
      setOccurrenceCount(count);
    } else {
      setOccurrenceCount(0);
    }
  }, [searchTerm, generatedText]);

  return (
    <Container maxWidth="sm" role="main">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
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
          Generated Text:
        </Typography>
        <Box
          sx={{
            maxHeight: '200px',
            overflowY: 'auto', 
            border: '1px solid #ccc',
            padding: '8px', 
            marginBottom: '16px',
          }}
        >
          <Typography variant="body2" style={{ wordBreak: 'break-word' }}>
            {generatedText}
          </Typography>
        </Box>
        <Typography variant="h6" my={2} aria-live="polite">
          Occurrences of "{searchTerm}": {occurrenceCount}
        </Typography>
      </Box>
    </Container>
  );
};

export default RandomStringGenerator;
