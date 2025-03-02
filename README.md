**File Chunking Utility**
This project is designed to split large input files into smaller chunks while maintaining metadata about the chunks in chunks.json.

**Configuration (.env file)**
**Ensure you have a .env file in the project root with the following variables:**

CHUNK_SIZE_IN_MB=10      # Size of each chunk in MB

OUTPUT_DIR="./output"      # Directory to store chunked files

INPUT_DIR="./input"        # Directory containing input files

CHUNK_JSON="chunks.json"  # Metadata file for chunked files

**How to Use**

Install dependencies:
**npm i**

**Place input files in the input/ directory.**
Run the script to process files and create chunks:
**node index.js**

Chunked files will be saved in the output/ directory.
Metadata about the chunked files will be recorded in chunks.json.

Notes
Ensure the input/ and output/ directories exist before running the script.
Modify CHUNK_SIZE_IN_MB in .env to adjust chunk size as needed.
This project provides a simple yet efficient way to split large files into smaller parts while keeping track of them.

