#String Compression with Special Characters#

##Overview##
Using javascript and jquery, this program takes a given input string and performs the following operations:
1. Searches the string for duplicate words
2. Sorts the duplicates according to the frequency of duplication
3. Replaces every duplicated word with an ASCII special Character
  - It starts with the most duplicated word, assigning the same special character to each instance of a duplicate word. When the list of special characters has been exhausted, the program adds x* special characters to replace the next word, where x = the number of times the special character list has been fully traversed.
4. An index of the repeated words / corresponding symbols is retained for decompression.

**NOTE:** this version does not perform decompression. This is only a proof of concept for the special character method of compression. This is meant to be a starting point for experimenting with compression and related concepts. Later versions will look at things like: centralized dictionaries for common words & phrases, integration of ad-hoc dictionaries in the style of L-Z compression, and other creative methods for integrating the decompression keys into the compressed file.
