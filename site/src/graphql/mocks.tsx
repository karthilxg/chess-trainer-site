import * as Factory from "factory.ts";
import faker from "faker";
import { MockedResponse } from "@apollo/client/testing";
import { GET_COMMUNITY_REPERTOIRES } from "./queries";
import { GetCommunityRepertoires } from "./__generated__/GetCommunityRepertoires";

// export const AuthorMock = Factory.Sync.makeFactory<Author>({
//   __typename: "Author",
//   id: Factory.each(() => faker.random.uuid()),
//   firstName: Factory.each(() => faker.name.firstName()),
//   lastName: Factory.each(() => faker.name.lastName()),
//   avatarUrl: Factory.each(() => faker.image.avatar()),
// });
//
// export const BookMock = Factory.Sync.makeFactory<Book>({
//   __typename: "Book",
//   id: Factory.each(() => faker.random.uuid()),
//   publishDate: Factory.each(() => faker.date.past().toISOString()),
//   title: Factory.each(() => faker.random.words()),
//   author: Factory.each(() => AuthorMock.build()),
// });

export const repertoiresQueryMock: MockedResponse<GetCommunityRepertoires> = {
  request: {
    query: GET_COMMUNITY_REPERTOIRES,
  },
  result: {
    data: {
      repertoires: [
        {
          __typename: "Human",
          id: "id",
        },
      ],
    },
  },
};
