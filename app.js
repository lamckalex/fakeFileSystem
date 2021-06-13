import readline from 'readline';
import SimpleUserStorageService from './classes/simpleUserStorageService.js'
import FileSystem from './classes/fileSystem.js'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let userID;
let suss = new SimpleUserStorageService();
let fs;
let currentPath = '';

console.log('Welcome');

rl.question("What is your user ID ? Hit enter if you don't have one \n", (input) => {
    input = '0b45d32d-df67-48d3-a0ec-6af3535873ef' //DEBUG
    if(input){
        userID = input;
        question();
    } else {
        suss.createUser().then((newID)=>{
            userID = newID;
            console.log('Your new ID is ', userID)
            question();
        }, (error) => {
            console.log('Failed to create user');
        })
    }
});

function updateDB(){    
    suss.writeUserData(userID, fs.fsToString());
}

function question(){

    suss.getUserData(userID).then((data) => {
        fs = new FileSystem(data)
    });

    rl.question("What is your command? ", function(response){
        const responseSplit = response.split(' ');
        switch(responseSplit[0]){
            case 'ls':
                console.log('Reading Directory');
                fs.ls(currentPath);
            break;
            case 'tree':
                if(responseSplit.length === 2){
                    fs.tree(responseSplit[1])
                }
                break;
            case 'cat':
                console.log('Reading File')
                if(responseSplit.length > 1){
                    fs.cat(currentPath, responseSplit[1])
                } else {
                    console.log('Please specify a name')
                }
            break;
            case 'touch':
                console.log('Create File');
                if(responseSplit.length > 1){
                    //Defect here is that the parser parses on spaces, and the content in the file we might want spaces
                    //We'll just skip that for now
                    fs.touch(currentPath, responseSplit[1], responseSplit[2])
                    updateDB();
                } else {
                    console.log('Please specify a name')
                }

            break;
            case 'mkdir':
                console.log('Make Directory');
                if(responseSplit.length > 1){
                    responseSplit.shift();
                    responseSplit.forEach((folderName)=>{
                        if(folderName){
                            fs.mkdir(currentPath, folderName)
                        }
                    });

                    updateDB();
                } else {
                    console.log('Please specify a name')
                }
            break;
            case 'rm':
                if(responseSplit.length === 2){
                    var path = currentPath + '/' + responseSplit[1]
                    const exists = fs.fileExists(path);
                    if(exists){
                        fs.deleteFile(currentPath, responseSplit[1])
                        console.log('File deleted')
                        updateDB();
                    } else {
                        console.log('Could not find file')
                    }
                }
            break;
            case 'rmdir':
                if(responseSplit.length === 2){
                    var path = currentPath + '/' + responseSplit[1]
                    const exists = fs.folderExists(path);
                    if(exists){
                        fs.deleteFile(currentPath, responseSplit[1])
                        console.log('Folder deleted')                    
                        updateDB();
                    } else {
                        console.log('Could not find file')
                    }
                }
            break;
            case 'cd':
                if(responseSplit.length === 2){
                    var path;
                    switch(responseSplit[1]){
                        case '/':
                            path = '/';
                        break;
                        case '..':
                            //To be implemented and traverse one level up
                            let lastSlash = currentPath.lastIndexOf('/')
                            if(lastSlash > 0){
                                path = currentPath.substr(0, lastSlash);
                            } else {
                                path = '/';
                            }
                        break;
                        default:
                            path = currentPath + '/' + responseSplit[1]
                    }

                    const exists = fs.folderExists(path);
                    if(exists){
                        currentPath = path
                        console.log(currentPath);
                    } else {
                        console.log('Could not find path')
                    }
                } else {
                    console.log('Please specify a path')
                }

            break;
            case 'pwd':
                console.log('Current Path: ' + currentPath)
            break;
            case 'exit':
                console.log('Exiting');
                process.exit(0);
            break;
            case 'help':
                console.log('User guide');
                const helpGuide = [
                    ['Command', 'Param(s)', 'Description'],
                    ['tree', '{absolutePathName}', 'Prints Tree Structure'],
                    ['ls', '', 'Lists current directory'],
                    ['cat', '{fileName}', 'reads a file'],
                    ['touch', '{fileName} {fileContent}', 'Writes a file with file content'],
                    ['rm', '{fileName}', 'Removes a file'],
                    ['mkdir', '{folderName}', 'Creates a folder'],
                    ['rmdir', '{folderName}', 'Removes a folder'],
                    ['cd', '{pathName}', 'Navigates to a path'],
                    ['pwd', '', 'Prints current Path']
                    ['exit', '', 'Exits the program gracefully'],
                    ['help', '', 'Prints help'],
                ]
                console.table(helpGuide);

                break;
            default:
                console.log('Unknown Command');
        }
        question();
    })
}
