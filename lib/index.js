"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const queries_1 = require("./queries");
const core = require("@actions/core");
function generatePullRequestReviewStats(nodes) {
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // const owner = core.getInput('owner', { required: true });
        // const repo = core.getInput('repo', { required: true });
        // const issueNumber = core.getInput('issue', { required: true });
        const owner = 'primer';
        const repo = 'view_components';
        const issueNumber = 1049;
        const data = yield (0, queries_1.issueMetadataGraphQLQuery)({ owner: owner, repo: repo, issueNumber: issueNumber });
        console.log(data);
        const timelineItems = (_a = data.issue.timelineItems) === null || _a === void 0 ? void 0 : _a.edges;
        const comments = data.issue.comments;
        const pullRequestNodes = [];
        const pullRequestIds = [];
        if (!timelineItems && !comments)
            return;
        for (const item of timelineItems) {
            const node = item.node;
            const pullRequest = (_b = node.source) === null || _b === void 0 ? void 0 : _b.title;
            if (pullRequest && !pullRequestIds.includes(node.source.id)) {
                pullRequestNodes.push(node.source);
                pullRequestIds.push(node.source.id);
            }
        }
        console.log(pullRequestNodes);
        // for (const comment of comments) {
        //   const node = comment
        //   // const owner = node.match()
        //   // const repo = node.match()
        //   // const pullRequestNumber = node.match()
        //   const owner = 'primer'
        //   const repo = 'view_components'
        //   const pullRequestNumber = 1121
        //   const pullRequestData = await pullRequestMetadataGraphQLQuery({ owner: owner, repo: repo, pullRequestNumber: pullRequestNumber })
        //   if (pullRequestData && !pullRequestIds.includes(pullRequestData.id)) {
        //     pullRequestNodes.push(pullRequestData.pullRequest)
        //     pullRequestIds.push(pullRequestData.pullRequest.source.id)
        //   }
        // }
        // const pullRequestData = generatePullRequestReviewStats(pullRequestNodes)
        // pass this data to next step?
    }
    catch (err) {
        console.log(err);
        core.setFailed(err.message);
    }
}))();
//# sourceMappingURL=index.js.map