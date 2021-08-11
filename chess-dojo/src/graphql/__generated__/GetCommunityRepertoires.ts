/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Color } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetCommunityRepertoires
// ====================================================

export interface GetCommunityRepertoires_repertoires_black {
  __typename: "SideRepertoire";
  id: any;
  color: Color;
}

export interface GetCommunityRepertoires_repertoires_white {
  __typename: "SideRepertoire";
  id: any;
  color: Color;
}

export interface GetCommunityRepertoires_repertoires {
  __typename: "Repertoire";
  id: any;
  description: string;
  author: any;
  black: GetCommunityRepertoires_repertoires_black | null;
  white: GetCommunityRepertoires_repertoires_white | null;
}

export interface GetCommunityRepertoires {
  repertoires: GetCommunityRepertoires_repertoires[];
}
