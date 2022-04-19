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
exports.issueMetadataGraphQLQuery = exports.pullRequestMetadataGraphQLQuery = void 0;
const graphql_1 = require("@octokit/graphql");
const GH_TOKEN = process.env.GH_TOKEN;
function pullRequestMetadataGraphQLQuery({ owner, repo, pullRequestNumber }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield (0, graphql_1.graphql)(`
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
    `, {
            owner,
            repo,
            pullRequestNumber
        });
        return data;
    });
}
exports.pullRequestMetadataGraphQLQuery = pullRequestMetadataGraphQLQuery;
function issueMetadataGraphQLQuery({ owner, repo, issueNumber }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield (0, graphql_1.graphql)(`
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
    `, {
            owner,
            repo,
            issueNumber,
            headers: {
                authorization: `token ${GH_TOKEN}`,
            },
        });
        return data;
    });
}
exports.issueMetadataGraphQLQuery = issueMetadataGraphQLQuery;
//# sourceMappingURL=queries.js.map