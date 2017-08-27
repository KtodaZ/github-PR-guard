var debugToggle = 0;

var masterBranchName = "master";
var whitelistedBranchPrefixes = ["hotfix", "release", "breaking-release", "pre-hotfix", "pre-release", "pre-breaking-release"];

var baseBranchXpath = '//*[@id="js-repo-pjax-container"]/div[2]/div[1]/div[1]/div[3]/div[1]/div[2]/button/span';
var headBranchXpath = '//*[@id="js-repo-pjax-container"]/div[2]/div[1]/div[1]/div[3]/div[2]/div[2]/button/span';
var submitButtonXpath = '//*[@id="new_pull_request"]/div[2]/div/div/div[3]/button';

var classThatIsOnlyFoundOnThePRPage = '.range-cross-repo-pair';

var areYouSureMsg = "HEAD/BASE branches are invalid. Are you sure you want to submit?";
var invalidBranchesMsg = "HEAD/BASE branches are invalid.";


function main() {
    debug("main running");

    if (isPageOnPRPage()) {
        debug("detected branches");

        if (!areBranchesValid()) {
            debug("branches are not valid");

            alert(invalidBranchesMsg);
        }

        changeSubmitBtnOnClickFunctionalityToAlertOnBadBranch();
    }
}

function isPageOnPRPage() {
    return document.querySelector(classThatIsOnlyFoundOnThePRPage) !== null;
}

function areBranchesValid() {
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


function changeSubmitBtnOnClickFunctionalityToAlertOnBadBranch() {
    var createPullRequestButton = getElementByXpath(submitButtonXpath);
    if(!createPullRequestButton) return;

    var hiddenSubmitButton = createHiddenSubmitButton();
    createPullRequestButton.parentNode.appendChild(hiddenSubmitButton);

    createPullRequestButton.type = 'button'; // disable submit functionality
    createPullRequestButton.onclick = function () {
        if(areBranchesValid() || ( !areBranchesValid() && confirm(areYouSureMsg) )) {
            hiddenSubmitButton.click();
        }
    };
}

function createHiddenSubmitButton() {
    var hiddenSubmitButton = document.createElement("button");
    hiddenSubmitButton.style.visibility = 'hidden';
    return hiddenSubmitButton;
}


function getTextContentByXpath(xpath) {
    var element = getElementByXpath(xpath);
    return element ? element.textContent : element;
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function debug(msg) {
    if(debugToggle) console.log(msg);
}

main();
