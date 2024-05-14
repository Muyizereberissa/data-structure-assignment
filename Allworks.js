const fs = require('fs');
const path = require('path');

class UniqueInt {
    constructor() {
        this.seen = new Array(2047).fill(false);
        this.minInt = -1023;
    }

    processFile(inputFilePath, outputFilePath) {
        this.seen = new Array(2047).fill(false);
        try {
            const uniqueNumbers = this.readUniqueIntegers(inputFilePath);
            this.writeUniqueIntegers(uniqueNumbers, outputFilePath);
            console.log(`Processed ${path.basename(inputFilePath)} successfully.`);
        } catch (error) {
            console.log(`Error processing ${path.basename(inputFilePath)}: ${error}`);
        }
    }

    readUniqueIntegers(inputFilePath) {
        const uniqueNumbers = [];
        const data = fs.readFileSync(inputFilePath, 'utf8');
        const lines = data.split('\n');
        lines.forEach((line) => {
            const strippedLine = line.trim();
            if (strippedLine) {
                if (this.isValidIntegerLine(strippedLine)) {
                    const number = parseInt(strippedLine);
                    if (-1023 <= number && number <= 1023) {
                        if (!this.seen[number - this.minInt]) {
                            this.seen[number - this.minInt] = true;
                            uniqueNumbers.push(number);
                        }
                    } else {
                        throw new Error(`Number out of range: ${number}`);
                    }
                }
            }
        });
        return this.sortUniqueNumbers(uniqueNumbers);
    }

    isValidIntegerLine(line) {
        return !isNaN(parseInt(line));
    }

    sortUniqueNumbers(numbers) {
        return numbers.sort((a, b) => a - b);
    }

    writeUniqueIntegers(uniqueNumbers, outputFilePath) {
        const data = uniqueNumbers.join('\n');
        fs.writeFileSync(outputFilePath, data);
    }
}

const inputFolder = "C:\\Users\\HP\\Documents\\data-structure-assignment\\Work"; 
const outputFolder = "C:\\Users\\HP\\Documents\\data-structure-assignment\\Results";

const uniqueIntProcessor = new UniqueInt();

try {
    const files = fs.readdirSync(inputFolder);
    files.forEach((filename) => {
        if (filename.endsWith(".txt")) {
            const inputPath = path.join(inputFolder, filename);
            const outputFilename = path.parse(filename).name + "_results.txt";
            const outputPath = path.join(outputFolder, outputFilename);

            const startTime = Date.now();
            uniqueIntProcessor.processFile(inputPath, outputPath);
            const endTime = Date.now();

            console.log(`Processed ${filename} in ${(endTime - startTime) / 1000} seconds`);
        }
    });
} catch (error) {
    console.log(`Error reading input folder: ${error}`);
}
