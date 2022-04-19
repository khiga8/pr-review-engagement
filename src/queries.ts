import { graphql } from "@octokit/graphql"

const GH_TOKEN = process.env.GH_TOKEN

export async function issueMetadataGraphQLQuery({ owner, repo, issueNumber}) {
  const query =`
    query ($owner: String!, $repo: String!, $issueNumber: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $issueNumber) {
          comments(first: 50) {
            nodes {
              bodyHTML
            }
          }
          timelineItems(first: 50) {
            edges {
              node {
                ... on CrossReferencedEvent {
                  source {
                    ... on PullRequest {
                      id
                      title
                      url
                      reviews(first: 50) {
                        nodes {
                          createdAt
                          onBehalfOf(first: 1) {
                            nodes {
                              name
                            }
                          }
                        }
                      }
                      closingIssuesReferences(first: 10) {
                        nodes {
                          id
                        }
                      }
                    }
                  }
                }
                ... on ConnectedEvent {
                  source {
                    ... on PullRequest {
                      id
                      url
                      reviews(first: 50) {
                        nodes {
                          createdAt
                          onBehalfOf(first: 1) {
                            nodes {
                              name
                            }
                          }
                        }
                      }
                      title
                      closingIssuesReferences(first: 10) {
                        nodes {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `
  
  const {repository: repository} = await graphql(
    query, 
    {owner, repo, issueNumber, headers: {authorization: `token ${GH_TOKEN}`}}
    )

  return repository
}

export async function pullRequestMetadataGraphQLQuery({ owner, repo, pullRequestNumber}) {
  const { data } = await graphql(
    `
      query ($owner: String!, $repo: String!, $pullRequestNumber: Int!) {
        repository(owner: $owner, name: $repo) {
          pullRequest(number: $pullRequestNumber) {
            id
            title
            url
            reviews(first: 50) {
              nodes {
                createdAt
                onBehalfOf(first: 1) {
                  nodes {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `, 
    {
      owner,
      repo,
      pullRequestNumber,
      headers: {
        authorization: `token ${GH_TOKEN}`,
      },
    }
  )
  return data
}

// TODO: This might not work
export async function closedByPullRequestsGraphQLQuery({owner, repo, issueNumber}) {
  const { data } = await graphql(
    `
      query ($owner: String!, $repo: String!, $issueNumber: Int!) {
        repository(owner: $owner, name: $repo) {
          issue(number: $issueNumber) {
            closedByPullRequestsReferences(first: 10) {
              nodes {
                title
              }
            }
          }
        }
      }
    `, {
      owner,
      repo, 
      issueNumber,
      headers: {
        authorization: `token ${GH_TOKEN}`,
      },
    })
    return data
}
