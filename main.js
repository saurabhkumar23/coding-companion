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