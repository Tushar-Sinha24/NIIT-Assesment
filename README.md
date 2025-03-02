# File Chunking Utility

This project is designed to split large input files into smaller chunks while maintaining metadata about the chunks in chunks.json.

## .env

Before running it add a .env file

```bash
CHUNK_SIZE_IN_MB=10
OUTPUT_DIR="./output"
INPUT_DIR="./input"
CHUNK_JSON="chunks.json"
```
## Installation

Install all the dependencies.

```bash
npm i
```

## Run Command

```bash
node index.js
```

Run the script to process files and create chunks:

## Input Folder 
Place the files in the input folder to be split into chunks.
## Output Folder 
Inside the output folder, each file has its own directory containing its chunk files.
## check.json
Used a database to store file and its chunk information while tracking its status.


