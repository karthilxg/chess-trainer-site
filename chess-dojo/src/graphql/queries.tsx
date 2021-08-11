import { gql } from "@apollo/client";

const REPERTOIRE_SIDE_FIELDS = gql`
  fragment RepertoireSideFields on SideRepertoire {
    id
    color
  }
`;

export const GET_COMMUNITY_REPERTOIRES = gql`
  ${REPERTOIRE_SIDE_FIELDS}
  query GetCommunityRepertoires {
    repertoires {
      id
      description
      author {
        name
      }
      black {
        ...RepertoireSideFields
      }
      white {
        ...RepertoireSideFields
      }
    }
  }
`;
