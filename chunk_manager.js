const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const chunkSize = process.env.CHUNK_SIZE_IN_MB ;

module.exports = {
    splitChunk:async function(fileOutputDir , filePath , file){
        const fileName = path.basename(filePath);
        const chunkFilePrefix = path.join(fileOutputDir, "chunk_");
        try {
            execSync(`split -b ${chunkSize}m -d "${filePath}" "${chunkFilePrefix}"`);
            const chunkFiles = fs.readdirSync(fileOutputDir).filter(file => file.startsWith("chunk_"));
            return chunkFiles
        } catch (error) {
            console.error(`Failed to split ${fileName}:`, error);
        }
    },

    verifyFileIntegrity: async function (originalHash, chunkDir ) { 
        try {
            
            const reconstructedFilePath = path.join(chunkDir, "reconstructed.tmp");
    
            // Merge all chunk files into one reconstructed file
            execSync(`cat "${chunkDir}"/chunk_* > "${reconstructedFilePath}"`);
    
            // Compute hash of the reconstructed file
            const reconstructedHash = execSync(`sha256sum "${reconstructedFilePath}" | awk '{print $1}'`).toString().trim();
    
            // Delete temporary file after checking integrity
            fs.unlinkSync(reconstructedFilePath);
    
            console.log(`Original Hash      : ${originalHash}`);
            console.log(`Reconstructed Hash : ${reconstructedHash}`);
    
            if (originalHash === reconstructedHash) {
                console.log("File integrity verified: No data loss.");
                return true;
            } else {
                console.log("Data loss detected: Chunks do not match the original file.");
                return false;
            }
        } catch (error) {
            console.error("Error verifying file integrity:", error);
            return false;
        }
    }
}