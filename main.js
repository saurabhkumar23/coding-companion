///////////////////////////////////////////// requires //////////////////////////////////
let puppeteer = require('puppeteer');
let fs = require('fs');
let path = require('path');
let readline = require('readline-sync');

////////// variables ///////////
let platform;
let contestId;
let coding_lang;
let codeTemplate;
let totalProbs = [];
let leetEmail;
let leetPass;
let src;
let dest;
let contestPath;
let codeTemplatePath;

// ask for platform
platform = readline.question('Choose your website:\n1. Codeforces \n2. Leetcode \n3. Codechef \n4. atCoder\n')
if(platform !=  '1' && platform != '2' && platform != '3' && platform != '4'){
    console.log('Sorry, we have only these platforms available. choose correct option :)')
    process.exit()
}
else if(platform == '1'){
    platform = 'codeforces'
}
else if(platform == '2'){
    leetEmail = readline.question('write your leetcode email')
    leetPass = readline.question('write your leetcode password')
    platform = 'leetcode'
}
else if(platform == '3'){
    platform = 'codechef'
}
else if(platform == '4'){
    platform = 'atcoder'
}

// ask for contest id
contestId = readline.question('Enter your contest ID (you will find it on the contest page URL, get copy paste from there!)\n')
// set urls
let cfUrl = 'https://codeforces.com/contest/'+contestId;
let lcUrl = 'https://leetcode.com/contest/'+contestId;
let ccUrl = 'https://www.codechef.com/'+contestId;
let acUrl = 'https://atcoder.jp/contests/'+contestId+'/tasks';

// ask for coding language
coding_lang = readline.question('Enter your coding language: (cpp / java / py)\n')
if(coding_lang != 'cpp' && coding_lang != 'java' && coding_lang != 'py'){
    console.log('for now, choose cpp,java or python.')
    process.exit()
}
// set codeTemplate
if(coding_lang == 'cpp'){
    codeTemplate = 'cppTemplate.txt'
}
else if(coding_lang == 'java'){
    codeTemplate = 'javaTemplate.txt'
}
else{
    codeTemplate = 'pyTemplate.txt'
}

// set directory paths
setPaths();

// calling main function 
if(platform == 'codeforces'){
    getCodeforces()
}
else if(platform == 'leetcode'){
    getLeetcode()
}
else if(platform == 'codechef'){
    getCodechef()
}
else{
    getAtcoder()
}

async function getCodeforces(){
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-fullscreen', '--disable-notifications', '--incognito'],
        defaultViewport: null,
        slowMo: 20,
    });

    let pages = await browser.pages();
    let page = pages[0];

    // codeforces contest
    page.goto(cfUrl,{
        waitUntil: 'networkidle2'
    })

    // fetch no of problems
    await page.waitForSelector('.problems tbody tr td:nth-of-type(1) a',{
        visible:true
    });
    totalProbs = await page.$$eval('.problems tbody tr td:nth-of-type(1) a', probs => probs.map(prob => prob.textContent));

    // trim problems content
    for(let prob in totalProbs){
        totalProbs[prob] = totalProbs[prob].trim();
    }

    // go to every problem and download test cases
    for(let prob in totalProbs){
        await page.goto('https://codeforces.com/contest/'+contestId+'/problem/'+totalProbs[prob],{waitUntil:'networkidle2'});
        await page.waitForSelector('.input',{
            visible:true
        });
        let input = await page.$$eval('.input pre', arr => arr.map(e => e.textContent));      // input array
        let output = await page.$$eval('.output pre', arr => arr.map(e => e.textContent));    // output array
        let inputData = '';
        let outputData = '';
        let problemPath = path.join(contestPath,totalProbs[prob]);                           // create problem path
        if (fs.existsSync(problemPath) == false){           // create problem folder if not exist
            fs.mkdirSync(problemPath);                   
        }
        let inputPath = path.join(problemPath,'input.txt');
        let outputPath = path.join(problemPath,'output.txt');
        let yourInputPath = path.join(problemPath,'your_input.txt');
        let yourOutputPath = path.join(problemPath,'your_output.txt');
        let codePath = path.join(problemPath,totalProbs[prob] + '.' + coding_lang);
        //console.log(input,output);
        for(let i = 0; i < input.length ; i++){             
            inputData += `(INPUT - ${i+1})\n${input[i]}\n`;                 // input
        }
        for(let i = 0 ; i < output.length ; i++){                          
            outputData += `(OUTPUT - ${i+1})\n${output[i]}\n`;                 // output
        }
        //console.log(inputData);
        //console.log(outputData);
        fs.writeFileSync(inputPath,inputData,function(err){      // create input file                    
            if(err){
                return console.log(err);
            }
        });
        fs.writeFileSync(outputPath,outputData,function(err){   // create output file                    
            if(err){
                return console.log(err);
            }
        });
        fs.writeFileSync(yourInputPath,"",function(err){      // create your_input file                    
            if(err){
                return console.log(err);
            }
        });
        fs.writeFileSync(yourOutputPath,"",function(err){   // create your_output file                    
            if(err){
                return console.log(err);
            }
        });
        fs.copyFileSync(codeTemplatePath,codePath);                            // create code file
    }

    console.log('test cases download successfully...!!');
    await browser.close();
    
}



function setPaths(){
    src = process.cwd();
    dest = path.join(src,'code');
    codeTemplatePath = path.join(src,'templates/'+codeTemplate);

    // create code folder if not exist
    if (fs.existsSync(dest) == false){         
        fs.mkdirSync(dest);                   
    }

    dest = path.join(dest,platform);
    // create platform folder if not exist
    if (fs.existsSync(dest) == false){         
        fs.mkdirSync(dest);                   
    }

    // create contest folder if not exist
    contestPath = path.join(dest,contestId);
    if (fs.existsSync(contestPath) == false){         
        fs.mkdirSync(contestPath);                   
    }
}