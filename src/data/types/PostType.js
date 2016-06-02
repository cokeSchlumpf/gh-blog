import { GraphQLObjectType as ObjectType, GraphQLInt as IntType, GraphQLString as StringType, GraphQLNonNull as NonNull } from 'graphql';

const PostType = new ObjectType({
  name: 'PostItem',
  fields: {
    key: {
      type: new NonNull(StringType)
    },
    title: {
      type: new NonNull(StringType)
    },
    link: {
      type: new NonNull(StringType)
    },
    author: {
      type: StringType
    },
    lastModifiedDate: {
      type: new NonNull(StringType)
    },
    publishedDate: {
      type: new NonNull(StringType)
    },
    publishedTime: {
      type: IntType
    },
    contentSnippet: {
      type: StringType
    },
    content: {
      type: StringType
    }
  },
});

export default PostType;
