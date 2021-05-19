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
