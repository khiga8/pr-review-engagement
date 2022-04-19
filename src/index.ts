import { pullRequestMetadataGraphQLQuery, issueMetadataGraphQLQuery } from "./queries"
import * as core from '@actions/core'

function generatePullRequestReviewStats(nodes) {
  
}

(async () => {
  try {
    // const owner = core.getInput('owner', { required: true });
    // const repo = core.getInput('repo', { required: true });
    // const issueNumber = core.getInput('issue', { required: true });
    
    const owner = 'primer'
    const repo = 'view_components'
    const issueNumber = 1048

    const data = await issueMetadataGraphQLQuery({owner: owner, repo: repo, issueNumber: issueNumber})
    const timelineItems = data.issue.timelineItems?.edges
    const comments = data.issue.comments

    const pullRequestNodes = []
    const pullRequestIds = []

    if (!timelineItems && !comments) return

    for (const item of timelineItems) {
      const node = item.node
      const pullRequest = node.source?.title
      if (pullRequest && !pullRequestIds.includes(node.source.id)) {
        pullRequestNodes.push(node.source)
        pullRequestIds.push(node.source.id)
      }
    }
    console.log(pullRequestNodes)
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
  } catch (err) {
      core.setFailed(err.message);
  }
})();