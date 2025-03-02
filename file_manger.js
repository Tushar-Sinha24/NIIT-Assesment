require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const crypto = require("crypto")

const outputDir = process.env.OUTPUT_DIR || "./output";
const chunkJson = process.env.CHUNK_JSON || "chunks.json";

const fileDatabasePath = path.join(outputDir, chunkJson);
let fileDatabase = {};

if (fs.existsSync(fileDatabasePath)) {
    try {
        const fileData = fs.readFileSync(fileDatabasePath, "utf8");
        fileDatabase = fileData ? JSON.parse(fileData) : {};
    } catch (error) {
        console.error("Error reading fileDatabase file:", error);
    }
}

function get_file_hash(filePath) {
    return execSync(`sha256sum "${filePath}" | awk '{print $1}'`).toString().trim();
}

async function update_db_json(fileDatabase , fileHash , filePath , file){
    if (fileHash && !fileDatabase[fileHash]){
        fileDatabase[fileHash] = {
            chunks: [],
            failedChunks: [],
            status:"watch",
            filePath:filePath,
            file:file
        };
    }   
    fs.writeFileSync(fileDatabasePath, JSON.stringify(fileDatabase, null, 2));
}



module.exports = {
    is_file_exits_in_db: async function (filePath) {
        const fileHash = get_file_hash(filePath)
        if (!fileDatabase[fileHash]){
            return false;
        }
        return true;
    },

    async insert_file_to_db(file ,filePath){
        const fileHash = get_file_hash(filePath)
        await update_db_json(fileDatabase , fileHash , filePath , file)
    },
    
    save_chunk_info_to_db:async function(chunkFiles , filePath , fileOutputDir){
        
        const fileHash = get_file_hash(filePath)
        chunkFiles.forEach((chunkFile, index) => {
            fileDatabase[fileHash].chunks.push({
                index,
                fileName: chunkFile,
                path: path.join(fileOutputDir, chunkFile),
            });
        });
        await update_db_json(fileDatabase)
    },

    update_file_status:async function(status , filePath){
        const fileHash = get_file_hash(filePath)
        fileDatabase[fileHash]["status"] = status;
        await update_db_json(fileDatabase)
    },
};