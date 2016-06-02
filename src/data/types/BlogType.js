import { GraphQLList as List, GraphQLObjectType as ObjectType, GraphQLString as StringType, GraphQLNonNull as NonNull } from 'graphql';

const OwnerType = new ObjectType({
  name: 'Owner',
  fields: {
    name: {
      type: new NonNull(StringType)
    },
    avatar: {
      type: new NonNull(StringType)
    },
    twitter: {
      type: StringType
    },
    github: {
      type: new NonNull(StringType)
    }
  }
});

const TemplateType = new ObjectType({
  name: 'Template',
  fields: {
    styles: {
      type: new List(StringType)
    },
    index: {
      type: new NonNull(StringType)
    },
    posts: {
      type: new NonNull(StringType)
    },
    post: {
      type: new NonNull(StringType)
    }
  }
});

const BlogType = new ObjectType({
  name: 'Blog',
  fields: {
    title: {
      type: new NonNull(StringType)
    },
    url: {
      type: new NonNull(StringType)
    },
    user: {
      type: new NonNull(StringType)
    },
    repo: {
      type: new NonNull(StringType)
    },
    owner: {
      type: new NonNull(OwnerType)
    },
    template: {
      type: new NonNull(TemplateType)
    }
  },
});

export default BlogType;
