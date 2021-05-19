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
