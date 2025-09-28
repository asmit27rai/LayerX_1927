import type { Mapping } from '@graphprotocol/hypergraph/mapping';
import { Id } from '@graphprotocol/hypergraph';

export const mapping: Mapping = {
  Dao: {
    typeIds: [Id("d5706372-ba8a-414e-9e82-371ed5744a29")],
    properties: {
      name: Id("6f9c71d0-d661-4fb9-9faa-b74470193a1a"),
      description: Id("9c62e013-4697-4e03-a2e1-5eb64a87b225"),
      foundedAt: Id("1e7895ec-aace-438a-97ef-2fc5fceddd84"),
      totalMembers: Id("55013eba-785e-4cd1-927a-b22063c0a557"),
      totalProposals: Id("a2d32ec7-9cac-4ee9-b296-36fe76fe8030"),
      treasury: Id("36b2081a-6be3-42ed-b4e1-3dd6896c4907"),
      website: Id("88589325-287b-4ca6-91f0-734fccb71784")
    },
    relations: {
      proposals: Id("11537ccb-a4d8-4486-8d2c-077d1eb946b2")
    },
  },
  Member: {
    typeIds: [Id("e8704d27-3fa0-4048-98b2-55dea6078366")],
    properties: {
      name: Id("6f9c71d0-d661-4fb9-9faa-b74470193a1a"),
      tokens: Id("9c62e013-4697-4e03-a2e1-5eb64a87b225"),
      totalVotingPower: Id("a2d32ec7-9cac-4ee9-b296-36fe76fe8030")
    },
    relations: {
      daos: Id("de3e7d1e-6eef-4a81-bd9c-c36e9bb718ff"),
      proposalsCreated: Id("265ea8e2-f00e-46f2-934a-4d4a9b25cea6"),
      votesCast: Id("f3e8de04-c74e-4fb2-bdb0-06bd3c456af2")
    },
  },
  Voters: {
    typeIds: [Id("e8704d27-3fa0-4048-98b2-55dea6078366")],
    properties: {
      name: Id("6f9c71d0-d661-4fb9-9faa-b74470193a1a"),
      tokens: Id("9c62e013-4697-4e03-a2e1-5eb64a87b225"),
      totalVotingPower: Id("a2d32ec7-9cac-4ee9-b296-36fe76fe8030"),
      joinedAt: Id("1e7895ec-aace-438a-97ef-2fc5fceddd84"),
      isActive: Id("68ee2ce8-8e83-47ce-9d25-8988849453a7")
    },
    relations: {},
  },
  GovernanceProposal: {
    typeIds: [Id("3a2199eb-e5ad-4d33-bedf-32a3d3a18df5")],
    properties: {
      name: Id("6f9c71d0-d661-4fb9-9faa-b74470193a1a"),
      description: Id("f9279b78-0c57-40e3-a01d-f8296133e2c5"),
      status: Id("1e7895ec-aace-438a-97ef-2fc5fceddd84"),
      forVotes: Id("55013eba-785e-4cd1-927a-b22063c0a557")
    },
    relations: {
      voters: Id("11537ccb-a4d8-4486-8d2c-077d1eb946b2"),
      daos: Id("c18030d8-5da3-49c4-9136-0b2b3071094a"),
      proposer: Id("f635fdb0-1546-4044-8a34-be5e0edc6137"),
      votes: Id("ea011af0-943f-4238-a360-65303d8ea09f")
    },
  },
  Proposal: {
    typeIds: [Id("3a2199eb-e5ad-4d33-bedf-32a3d3a18df5")],
    properties: {
      name: Id("6f9c71d0-d661-4fb9-9faa-b74470193a1a"),
      description: Id("f9279b78-0c57-40e3-a01d-f8296133e2c5"),
      status: Id("1e7895ec-aace-438a-97ef-2fc5fceddd84"),
      forVotes: Id("55013eba-785e-4cd1-927a-b22063c0a557"),
      againstVotes: Id("a2d32ec7-9cac-4ee9-b296-36fe76fe8030"),
      abstainVotes: Id("36b2081a-6be3-42ed-b4e1-3dd6896c4907"),
      createdAt: Id("88589325-287b-4ca6-91f0-734fccb71784"),
      votingEndsAt: Id("68ee2ce8-8e83-47ce-9d25-8988849453a7"),
      minVotingPower: Id("de3e7d1e-6eef-4a81-bd9c-c36e9bb718ff")
    },
    relations: {
      voters: Id("11537ccb-a4d8-4486-8d2c-077d1eb946b2")
    },
  },
  Vote: {
    typeIds: [Id("cdf867a9-e6eb-4a5a-81f8-163061ec6f50")],
    properties: {
      choice: Id("88589325-287b-4ca6-91f0-734fccb71784"),
      votingPower: Id("68ee2ce8-8e83-47ce-9d25-8988849453a7"),
      reason: Id("f9279b78-0c57-40e3-a01d-f8296133e2c5"),
      castAt: Id("1e7895ec-aace-438a-97ef-2fc5fceddd84"),
      isConfirmed: Id("55013eba-785e-4cd1-927a-b22063c0a557")
    },
    relations: {
      proposal: Id("77043010-0b40-4e7a-8392-121c85884c54"),
      voter: Id("265ea8e2-f00e-46f2-934a-4d4a9b25cea6")
    },
  },
}