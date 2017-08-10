var debugToggle = 0;

var masterBranchName = "master";
var whitelistedBranchPrefixes = ["hotfix", "release", "breaking-release", "pre-hotfix", "pre-release", "pre-breaking-release"];

var baseBranchXpath = '//*[@id="js-repo-pjax-container"]/div[2]/div[1]/div[1]/div[3]/div[1]/div[2]/button/span';
var headBranchXpath = '//*[@id="js-repo-pjax-container"]/div[2]/div[1]/div[1]/div[3]/div[2]/div[2]/button/span';

function main() {
    debug("main running");
    
    if (document.querySelector('.range-cross-repo-pair') !== null) {
        debug("detected branches");
        
        if (!areBranchesValid()) {
            debug("branches are not valid");
            
            alert("Invalid branches. Do not PR!!!!!!")
        }
    }
}
function areBranchesValid() {
    debug(isHeadBranchAWhitelistedBranch());
    return (isBaseBranchMaster() && isHeadBranchAWhitelistedBranch()) || (!isBaseBranchMaster());
}

function isBaseBranchMaster() {
    return getTextContentByXpath(baseBranchXpath) === masterBranchName;
}

function isHeadBranchAWhitelistedBranch() {
    var branchName = getTextContentByXpath(headBranchXpath);
    var branchNamePrefix = getBranchNamePrefix(branchName);
    debug(branchNamePrefix);

    return (whitelistedBranchPrefixes.indexOf(branchNamePrefix.toLowerCase()) > -1)
}

function getBranchNamePrefix(branchName) {
    return branchName.substring(0, branchName.indexOf("/"));
}

function getTextContentByXpath(xpath) {
    var baseBranch = getElementByXpath(xpath);
    return baseBranch.textContent;
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function debug(msg) {
    if(debugToggle) console.log(msg);
}

main();
