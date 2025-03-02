require("dotenv").config();
const fs = require("fs");
const path = require("path");
const cron = require('node-cron');


const {is_file_exits_in_db , save_chunk_info_to_db , update_file_status , insert_file_to_db} = require('./file_manger')
const {splitChunk , verifyFileIntegrity} = require('./chunk_manager')


const inputDir = process.env.INPUT_DIR || "./input";
let outputDir = process.env.OUTPUT_DIR || "./output";
const chunkJson = process.env.CHUNK_JSON || "chunks.json";
const fileDatabasePath = path.join(outputDir, chunkJson);


// Validate the output directory exists
if (!fs.existsSync(outputDir)) {
    try {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log("Output folder created successfully.");
    } catch (err) {
        console.error("Error creating output folder:", err);
    }
}



async function processFileChunksWithIntegrityCheck(filePath, file ,fileHash) {
    const fileName = path.basename(filePath);
    const fileOutputDir = path.join(outputDir, fileName);
    if (!fs.existsSync(fileOutputDir)) {
        fs.mkdirSync(fileOutputDir, { recursive: true });
    }
    chunk = await splitChunk(fileOutputDir , filePath , file)
    await save_chunk_info_to_db(chunk , filePath , fileOutputDir) 
    isFileIntact = await  verifyFileIntegrity(fileHash, fileOutputDir )
    if (isFileIntact){
        await update_file_status("Completed" , filePath)
    }
    else {
        await update_file_status("Failure" , filePath)
    }
    return
}

async function processFiles() {
    try {
        let jsonData = fs.readFileSync(fileDatabasePath, "utf8");
        jsonData = jsonData ? JSON.parse(jsonData) : {};
        const files = Object.entries(jsonData);
        
        for (let [key, file] of files) {
            if (file?.status === "watch") {
                await update_file_status("process", file.filePath);
                await processFileChunksWithIntegrityCheck(file.filePath, file.file , key);
            }
        }
        //calling it Recursively
        setTimeout(processFiles, 2000); 
    } catch (err) {
        console.error("Error processing files:", err);
        setTimeout(processFiles, 5000);
    }
}


async function folder_sync_to_db(){
    fs.readdir(inputDir, (err, files) => {
        if (err) {
            console.error("Error reading input folder:", err);
            return;
        }

        files.forEach(async(file) => {
            if (file !== ".DS_Store") {
                const filePath = path.join(inputDir, file);
                if (fs.lstatSync(filePath).isFile()) {
                    dbHasFile =await is_file_exits_in_db(filePath)
                    if (!dbHasFile) {
                        await insert_file_to_db(file ,filePath)
                    } else {
                        console.log(`Skipping already processed file: ${file}`);
                    }
                }
            }
        });
    });
}



processFiles();
cron.schedule('*/5 * * * *', () => {
    folder_sync_to_db();
  });
