import { graphql } from "@octokit/graphql"

const GH_TOKEN = process.env.GH_TOKEN

export async function pullRequestMetadataGraphQLQuery({ owner, repo, pullRequestNumber}) {
  const { data } = await graphql(
    `
    query ($owner: String!, $repo: String!, $pullRequestNumber: Int!) {
      repository(owner: $owner, name: $repo) {
        pullRequest(number: ) {
          id
          title
          url
          reviews(first: 100) {
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
      pullRequestNumber
    }
  )
  return data
}

export async function issueMetadataGraphQLQuery({ owner, repo, issueNumber}) {
  const { data } = await graphql(
    `
    query ($owner: String!, $repo: String!, $issueNumber: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $issueNumber) {
          comments(first: 100) {
            nodes {
              bodyHTML
            }
          }
          timelineItems(first: 200) {
            edges {
              node {
                ... on CrossReferencedEvent {
                  source {
                    ... on PullRequest {
                      id
                      title
                      url
                      reviews(first: 100) {
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
                      reviews(first: 100) {
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
    `,
    {
      owner,
      repo,
      issueNumber,
      headers: {
        authorization: `token ${GH_TOKEN}`,
      },
    }
  );
  return data
}
